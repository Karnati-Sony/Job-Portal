const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { employerOnly } = require("../middlewares/authMiddleware");
const {
  getEmployerAnalytics,
} = require("../controllers/analyticsController");

router.get(
  "/overview",
  protect,
  employerOnly,
  getEmployerAnalytics
);

module.exports = router;
