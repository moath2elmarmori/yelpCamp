const mongoose = require("mongoose");
const Review = require("./reviewModel");

// an options object to save virtuals of the campgroundShcema to use them
const opts = { toJSON: { virtuals: true } };

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: [imageSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`
})

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
