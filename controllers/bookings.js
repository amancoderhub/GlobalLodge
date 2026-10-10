const Booking = require("../models/booking");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

const ACTIVE_BOOKING_STATUSES = ["pending", "confirmed"];
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const toUtcDate = (dateValue) => {
    if (
        typeof dateValue !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
        return new Date(NaN);
    }

    const date = new Date(`${dateValue}T00:00:00.000Z`);

    if (
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== dateValue
    ) {
        return new Date(NaN);
    }

    return date;
};

const getToday = () => {
    const now = new Date();

    return new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        )
    );
};

module.exports.createBooking = async (req, res) => {
    const { id: listingId } = req.params;
    const { checkIn, checkOut, guests } = req.body.booking || {};

    const checkInDate = toUtcDate(checkIn);
    const checkOutDate = toUtcDate(checkOut);

    const listing = await Listing.findById(listingId);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    if (listing.owner.equals(req.user._id)) {
        req.flash("error", "You cannot book your own listing.");
        return res.redirect(`/listings/${listingId}`);
    }

    if (
        !Number.isFinite(checkInDate.getTime()) ||
        !Number.isFinite(checkOutDate.getTime()) ||
        checkInDate >= checkOutDate
    ) {
        req.flash("error", "Please select valid booking dates.");
        return res.redirect(`/listings/${listingId}`);
    }

    if (checkInDate < getToday()) {
        req.flash("error", "Check-in must be today or later.");
        return res.redirect(`/listings/${listingId}`);
    }

    if (!Number.isInteger(guests) || guests < 1) {
        req.flash("error", "Please enter a valid number of guests.");
        return res.redirect(`/listings/${listingId}`);
    }

    const conflictingBooking = await Booking.exists({
        listing: listingId,
        status: { $in: ACTIVE_BOOKING_STATUSES },
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate },
    });

    if (conflictingBooking) {
        req.flash(
            "error",
            "Those dates are no longer available. Please choose different dates."
        );
        return res.redirect(`/listings/${listingId}`);
    }

    const totalNights = Math.round(
        (checkOutDate - checkInDate) / DAY_IN_MILLISECONDS
    );

    await Booking.create({
        listing: listingId,
        guest: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        nightlyRate: listing.price,
        totalNights,
        totalPrice: listing.price * totalNights,
    });

    req.flash("success", "Your booking request has been submitted.");
    res.redirect("/bookings");
};

module.exports.showMyBookings = async (req, res) => {
    const bookings = await Booking.find({
        guest: req.user._id,
    })
        .populate("listing")
        .sort({ checkIn: -1 });

    const today = getToday();

    const bookingCards = bookings.map((booking) => ({
        booking,
        canCancel:
            ACTIVE_BOOKING_STATUSES.includes(booking.status) &&
            booking.checkIn > today,
    }));

    res.render("bookings/index.ejs", { bookingCards });
};

module.exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findOne({
        _id: req.params.id,
        guest: req.user._id,
    });

    if (!booking) {
        throw new ExpressError(404, "Booking not found");
    }

    if (
        !ACTIVE_BOOKING_STATUSES.includes(booking.status) ||
        booking.checkIn <= getToday()
    ) {
        req.flash("error", "This booking can no longer be cancelled.");
        return res.redirect("/bookings");
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash(
        "success",
        "Booking cancelled. Those dates are available again."
    );

    res.redirect("/bookings");
};
