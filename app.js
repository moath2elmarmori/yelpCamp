if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// requiring from packages
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressSession = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo")
// requiring from folders
const User = require("./models/userModel");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgroundsRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const usersRoutes = require("./routes/usersRoutes");

// setting mongoose connection with mongoDBAtlas
const dbUrl = process.env.DB_URL;
mongoose.connect(
  dbUrl
);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log("Error from mongoose connection");
  console.log(err);
});
db.once("open", () => {
  console.log("Mongoose connection open");
});

// setting the view engine to be "ejs"
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
// ###########

// serve static files to public directory
app.use(express.static("public"));

// a middleware to parse incoming data
app.use(express.urlencoded({ extended: true }));

// a middleware to handle methodOverriding
app.use(methodOverride("_method"));

// initializing the session store to our mongo database (session store defaults to memory, and we don't want that)
const secret = process.env.SECRET || "thisshouldbeagoodsecret"
const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
})

// initializing the session options
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

// using the session
app.use(expressSession(sessionConfig));

// make a middleware that will put the flashing messages in the request object
app.use(flash());

// using helmet for more security
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dk5awi1mn/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dk5awi1mn/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dk5awi1mn/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dk5awi1mn/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dk5awi1mn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dk5awi1mn/" ],
            childSrc   : [ "blob:" ]
        }
    })
);


// configuring authintication using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// a middleware to put local helpers available to every template in the views directory
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Using the main route to the YelpCamp app
app.use("/", usersRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

// @desc HomePage
// @route GET /
// @access public
app.get("/", (req, res) => {
  res.render("home", { pageTitle: "YelpCamp" });
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "hmar@gmail.com", username: "hmar" });
  const newUser = await User.register(user, "hmarhmar");
  res.send(newUser);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  console.log("this is from the error middleware");
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", { error: err, pageTitle: "YelpCamp" });
});

// initialize the server
app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
