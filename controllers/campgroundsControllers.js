const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const Campground = require("../models/campgroundModel");
const { cloudinary } = require("../cloudinary/cloudinaryConfig");

module.exports.showAllCampgrounds = async (req, res) => {
  const allCampgrounds = await Campground.find({});
  res.render("campgrounds/index", {
    allCampgrounds,
    pageTitle: "Campgrounds",
  });
};

module.exports.renderNewCampgroundForm = (req, res) => {
  res.render("campgrounds/newCampground", {
    pageTitle: "Make A New Campground",
  });
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const foundCampground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!foundCampground) {
    req.flash("error", "Couldn't find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/showCampground", {
    campground: foundCampground,
    pageTitle: foundCampground.title,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const foundCampground = await Campground.findById(id);
  if (!foundCampground) {
    req.flash("error", "Couldn't find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/editCampground", {
    campground: foundCampground,
    pageTitle: `Editing${foundCampground.title}`,
  });
};

module.exports.insertingNewCampground = async (req, res) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const { campground } = req.body;
  const newCampground = new Campground(campground);
  newCampground.geometry = geoData.body.features[0].geometry;
  const imagesArray = req.files.map((obj) => ({
    url: obj.path,
    filename: obj.filename,
  }));
  newCampground.images = imagesArray;
  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash("success", "Made A new campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.editingCampground = async (req, res) => {
  const { id } = req.params;
  const { campground } = req.body;
  const imagesArray = req.files.map((obj) => ({
    url: obj.path,
    filename: obj.filename,
  }));
  const edittedCampground = await Campground.findByIdAndUpdate(id, campground, {
    runValidators: true,
  });
  edittedCampground.images.push(...imagesArray);
  await edittedCampground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    await edittedCampground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deletingCampground = async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
