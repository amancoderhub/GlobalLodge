const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

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
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
    }
    console.log(listing);
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
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
    isOwner,
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
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;