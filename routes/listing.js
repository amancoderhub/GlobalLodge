const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } 
});

// Index & Create
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
    );

// New Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, Delete
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
