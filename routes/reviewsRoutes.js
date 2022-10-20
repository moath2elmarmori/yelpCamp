const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviewsContollers = require("../controllers/reviewsControllers");

// @desc Posting A New Review
// @route POST /campgrounds/:id/reviews
// @access private
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewsContollers.postingNewReview)
);

// @desc Deleting A Specific Campground
// @route DELETE /campgrounds/:id
// @access private
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsContollers.deletingReview)
);

module.exports = router;
