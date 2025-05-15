const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
//mongoodb setup 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true }));

app.get("/", (req, res) =>{
    res.send("HI, I am root");
})
//index routes 
app.get("/listings", async (req, res)=> {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});
// Show Routes 
app.get("/listings/:id",async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})




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

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});