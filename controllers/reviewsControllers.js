const Review = require("../models/reviewModel");
const Campground = require("../models/campgroundModel");

module.exports.postingNewReview = async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  const foundCampground = await Campground.findById(id);
  const newReview = new Review(review);
  newReview.author = req.user._id;
  foundCampground.reviews.push(newReview);
  await newReview.save();
  await foundCampground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deletingReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
};
