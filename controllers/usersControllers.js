const User = require("../models/userModel");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register", { pageTitle: "Register" });
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome To YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login", { pageTitle: "Login" });
};

module.exports.loginUser = (req, res) => {
  // saving the returnTo in a variable and giving it a backup value if there's nothing in it
  const redirectingToUrl = req.session.returnTo || "/campgrounds";
  // deleting the returnTo from the session to keep it clean as possible
  delete req.session.returnTo;
  req.flash("success", "Welcome Back");
  res.redirect(redirectingToUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "Goodbye");
    res.redirect("/campgrounds");
  });
};
