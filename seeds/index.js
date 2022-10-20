const mongoose = require("mongoose");
const Campground = require("../models/campgroundModel");
const cities = require("./cities");
const { descriptors, places } = require("./seedsHelpers");
// setting mongoose connection with mongoDBAtlas
mongoose.connect(
  "mongodb+srv://moo3a:moath2002MOATH@cluster1.i0asn.mongodb.net/yelpCamp?retryWrites=true&w=majority"
);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log("Error from mongoose connection");
  console.log(err);
});
db.once("open", () => {
  console.log("Mongoose connection open");
});

const returningRandomElementFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const randomNumber1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const newCampground = new Campground({
      author: "634e656219397e3c9c4e19d7",
      title: `${returningRandomElementFromArray(
        descriptors
      )} ${returningRandomElementFromArray(places)}`,
      location: `${cities[randomNumber1000].city}, ${cities[randomNumber1000].state}`,
      geometry: {
          type: "Point",
          coordinates: [cities[randomNumber1000].longitude, cities[randomNumber1000].latitude],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dk5awi1mn/image/upload/v1666106484/YelpCamp/kmc2gpf6holbxckfyfik.jpg",
          filename: "YelpCamp/kmc2gpf6holbxckfyfik",
        },
        {
          url: "https://res.cloudinary.com/dk5awi1mn/image/upload/v1666106485/YelpCamp/bh3pqbicw31p5rmdlqlc.jpg",
          filename: "YelpCamp/bh3pqbicw31p5rmdlqlc",
        },
      ],
    });
    await newCampground.save();
  }
};

seedDB().then(() => {
  console.log("Inserted Data Successfully");
  mongoose.connection.close();
  console.log("Closing Connection");
});
