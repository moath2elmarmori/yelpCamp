const Campground = require("./models/campgroundModel");
const Review = require("./models/reviewModel");
const { campgruondSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.originalUrl);
    // store the url where the user tried to go in the session
    // checking an edge case that if the returnTo has the "/reviews" in its string, if so i have to redirect the user to the campground itself
    if (req.originalUrl.includes("/reviews")) {
      // i'm going to save the first portion of the returnTo property that exists in the session that (portion) must return the path of the specific campground that the user were in and tried to delete a review,
      // the postion that we are tring to save must look like this (/campgrounds/:id);
      req.session.returnTo = req.originalUrl.split("/reviews")[0];
    } else {
      req.session.returnTo = req.originalUrl;
    }
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.isCampgroundAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const result = campgruondSchema.validate(req.body);
  if (result.error) {
    const errorMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(errorMsg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!req.user._id.equals(review.author)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  console.log("from validating");
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    const errorMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(errorMsg, 400);
  } else {
    next();
  }
};
