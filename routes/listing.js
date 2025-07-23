const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//index routes 
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Show Routes 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
    const listingData = req.body.listing;
    if (typeof listingData.image === "string") {
        listingData.image = {
            url: listingData.image,
            filename: "custom", // or leave blank if not needed
        };
    }

    const newListing = new Listing(listingData);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route 
router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.listing;
    if (typeof updatedData.image === "string") {
        updatedData.image = {
            url: updatedData.image,
            filename: "custom"
        };
    }
    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing updated!");

    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;