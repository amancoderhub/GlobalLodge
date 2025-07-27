const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsyc(userController.signup)
);

router
.route("/login")
.get( userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), userController.Login
);

router.get("/logout", userController.Logout);

module.exports = router;