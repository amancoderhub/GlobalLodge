const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsyc");
const favoriteController = require("../controllers/favorites");

router
.get(
    "/favorites",
    isLoggedIn,
    wrapAsync(favoriteController.showFavorites));
router
.post(
    "/listings/:id/favorite", 
    isLoggedIn, wrapAsync(favoriteController.toggleFavorite));

module.exports = router;
