const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary/cloudinaryConfig");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campgroundModel");
const {
  isLoggedIn,
  isCampgroundAuthor,
  validateCampground,
} = require("../middleware");
const campgroundsControllers = require("../controllers/campgroundsControllers");

// @desc Show All Campgrounds
// @route GET /campgrounds
// @access public
router.get("/", catchAsync(campgroundsControllers.showAllCampgrounds));

// @desc Render New Campground Form
// @route GET /campgrounds/new
// @access private
router.get("/new", isLoggedIn, campgroundsControllers.renderNewCampgroundForm);

// @desc Show A Specific Campground
// @route GET /campgrounds/:id
// @access public
router.get("/:id", catchAsync(campgroundsControllers.showCampground));

// @desc Render Edit Campground Form
// @route GET /campgrounds/:id/edit
// @access private
router.get(
  "/:id/edit",
  isLoggedIn,
  isCampgroundAuthor,
  catchAsync(campgroundsControllers.renderEditForm)
);

// @desc Inserting A New Campground
// @route POST /campgrounds
// @access private
router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(campgroundsControllers.insertingNewCampground)
);

// @desc Editing A Specific Campground
// @route PUT /campgrounds/:id
// @access private
router.put(
  "/:id",
  isLoggedIn,
  isCampgroundAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(campgroundsControllers.editingCampground)
);

// DELETE Routes
// ##########
// @desc Deleting A Specific Campground
// @route DELETE /campgrounds/:id
// @access private
router.delete(
  "/:id",
  isLoggedIn,
  isCampgroundAuthor,
  catchAsync(campgroundsControllers.deletingCampground)
);

module.exports = router;
