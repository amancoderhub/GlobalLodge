const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
//mongoodb setup 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc.js");
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("HI, I am root");
})
//index routes 
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Routes 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings", wrapAsync(async (req, res, next) => {
    const listingData = req.body.listing;
    if (typeof listingData.image === "string") {
        listingData.image = {
            url: listingData.image,
            filename: "custom", // or leave blank if not needed
        };
    }
    const newListing = new Listing(listingData);
    await newListing.save();
    res.redirect("/listings");
}));


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route 
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.listing;
    if (typeof updatedData.image === "string") {
        updatedData.image = {
            url: updatedData.image,
            filename: "custom"
        };
    }
    await Listing.findByIdAndUpdate(id, updatedData);
    res.redirect(`/listings/${id}`);
}));


//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Test 
// app.get("/testListing", async (req, res)=> {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         descreption: "By the beach",
//         price: 120,
//         location: "Calnguate, Goa",
//         country: "India",
//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
// });


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message="Something went wrong !" } = err;
    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});