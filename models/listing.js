const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const Booking = require("./booking.js");

const imageSchema = new Schema({
    url: String,
    filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
    if (!this.url || !this.url.includes("res.cloudinary.com")) {
        return this.url;
    }

    return this.url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,c_fill,g_auto,w_700,h_450/"
    );
});

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        image: imageSchema,
        price: Number,
        location: String,
        country: String,

        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        category: {
            type: String,
            enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Islands"]
        }
    },
    // { toJSON: { virtuals: true } }
);

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Promise.all([
            Review.deleteMany({ _id: { $in: listing.reviews } }),
            Booking.deleteMany({ listing: listing._id }),
        ]);
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
