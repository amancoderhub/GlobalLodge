const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const { q } = req.query;
    let filter = {};

    if (q && q.trim() !== "") {
        filter = {
            $or: [
                { location: { $regex: q, $options: "i" } },
                { title: { $regex: q, $options: "i" } } // Optional: title-based search
            ]
        };
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
})
    .send();


    const listingData = req.body.listing;
    if (req.file) {
        listingData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    newListing.geometry = response.body.features[0].geometry;

    let savedListing=  await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload,w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (req.file) {
        if (listing.image?.filename && listing.image.filename !== "custom") {
            await cloudinary.uploader.destroy(listing.image.filename);
        }

        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const deleteCloudImage = listing.image?.filename && listing.image.filename !== "custom"
        ? cloudinary.uploader.destroy(listing.image.filename)
        : Promise.resolve();

    await Promise.all([
        deleteCloudImage,
        Listing.findByIdAndDelete(id)
    ]);

    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
