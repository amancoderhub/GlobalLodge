const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            const duplicateField = existingUser.email === email ? "email" : "username";
            req.flash("error", `An account with that ${duplicateField} already exists.`);
            return res.redirect("/signup");
        }

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcom to GlobalLodge!");
            res.redirect("/listings");
        })
    } catch (e) {
        if (e.code === 11000 || e.name === "UserExistsError") {
            req.flash("error", "That email or username is already registered.");
            return res.redirect("/signup");
        }

        req.flash("error", e.message);
        res.redirect("/signup");
    }

};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcom to GlobalLodge!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};
