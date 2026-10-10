const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pasportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        favorites: [{
            type: Schema.Types.ObjectId,
            ref: "Listing",
        }]
})

userSchema.plugin(pasportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
