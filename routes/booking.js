const express = require("express");
const router = express.Router();

const { isLoggedIn, validateBooking } = require("../middleware");
const wrapAsync = require("../utils/wrapAsyc");
const bookingController = require("../controllers/bookings");

router
.get(
    "/bookings",
    isLoggedIn, 
    wrapAsync(bookingController.showMyBookings));
router
.post(
    "/listings/:id/bookings", 
    isLoggedIn, 
    validateBooking, wrapAsync(bookingController.createBooking));
router
.patch(
    "/bookings/:id/cancel", 
    isLoggedIn, 
    wrapAsync(bookingController.cancelBooking));

module.exports = router;
