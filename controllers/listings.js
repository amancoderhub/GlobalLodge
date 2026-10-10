const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const LISTING_PAGE_SIZE = 8;
const LISTING_SORTS = {
    newest: { _id: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildListingQuery = ({ q, category }) => {
    const filter = {};
    const searchTerm = q?.trim();

    if (searchTerm) {
        const searchPattern = new RegExp(escapeRegex(searchTerm), "i");
        filter.$or = [
            { location: searchPattern },
            { title: searchPattern },
        ];
    }

    if (category) {
        filter.category = category;
    }

    return filter;
};

const createFilterQuery = ({ q, category, sort }) => {
    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (sort && sort !== "newest") params.set("sort", sort);

    return params.toString();
};

module.exports.index = async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const category = typeof req.query.category === "string" ? req.query.category : "";
    const sort = Object.hasOwn(LISTING_SORTS, req.query.sort) ? req.query.sort : "newest";
    const requestedPage = Number.parseInt(req.query.page, 10);
    const filter = buildListingQuery({ q, category });
    const totalListings = await Listing.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalListings / LISTING_PAGE_SIZE), 1);
    const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
        ? Math.min(requestedPage, totalPages)
        : 1;
    const filterQuery = createFilterQuery({ q, category, sort });
    const categoryQueries = {};

    for (const listingCategory of ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Islands"]) {
        categoryQueries[listingCategory] = createFilterQuery({ q, category: listingCategory, sort });
    }

    const allListings = await Listing.find(filter)
        .sort(LISTING_SORTS[sort])
        .skip((currentPage - 1) * LISTING_PAGE_SIZE)
        .limit(LISTING_PAGE_SIZE);
    const favoriteListingIds = new Set((req.user?.favorites || []).map((id) => id.toString()));
    const listingsWithFavoriteState = allListings.map((listing) => ({
        listing,
        isFavorite: favoriteListingIds.has(listing._id.toString()),
    }));

    res.render("listings/index.ejs", {
        listingsWithFavoriteState,
        q,
        category,
        sort,
        filterQuery,
        categoryQueries,
        currentUrl: req.originalUrl,
        pagination: {
            currentPage,
            totalPages,
            totalListings,
            hasPreviousPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
        },
    });
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

    res.render("listings/show.ejs", {
        listing,
        today: new Date().toISOString().slice(0, 10),
    });
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

    let savedListing = await newListing.save();
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

    let originalImageUrl = "/images/default.jpg";
    if (listing.image && listing.image.url) {
        originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    // Re-geocode if location is changed or missing geometry
    if (req.body.listing.location && (req.body.listing.location !== listing.location || !listing.geometry)) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        if (response.body.features.length) {
            listing.geometry = response.body.features[0].geometry;
        }
    }

    // Update other fields
    if (req.body.listing) {
        Object.assign(listing, req.body.listing);
    }

    if (req.file) {
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
