const express = require("express");
const router = express.Router();

//Posts
//Index 
router.get("/", (req, res) => {
    res.send("GET for post");
})

//show
router.get("/:id", (req, res) => {
    res.send("GET for post id");
})

//POST 
router.post("/", (req, res) => {
    res.send("POST for post");
})

//DELETE
router.delete("/:id", (req, res) => {
    res.send("DELETE for post id");
})

module.exports = router;