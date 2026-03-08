const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsyc.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


// Reviews
//Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Dlete Review Route 
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.dstroyReview)
);

//Update Review Route
router.put(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    validateReview,
    wrapAsync(reviewController.updateReview)
);

module.exports = router;