const Listing = require("../models/listing");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

const getReturnPath = (returnTo) => (
    typeof returnTo === "string" && (returnTo.startsWith("/listings") || returnTo === "/favorites")
        ? returnTo
        : "/listings"
);

module.exports.showFavorites = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({ path: "favorites", options: { sort: { _id: -1 } } });

    res.render("users/favorites.ejs", { favoriteListings: user.favorites });
};

module.exports.toggleFavorite = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.exists({ _id: id });

    if (!listing) throw new ExpressError(404, "Listing not found");

    const user = await User.findById(req.user._id);
    const favoriteIndex = user.favorites.findIndex((favoriteId) => favoriteId.equals(id));

    if (favoriteIndex === -1) {
        user.favorites.push(id);
        req.flash("success", "Listing saved to your favourites.");
    } else {
        user.favorites.splice(favoriteIndex, 1);
        req.flash("success", "Listing removed from your favourites.");
    }

    await user.save();
    res.redirect(getReturnPath(req.body.returnTo));
};
