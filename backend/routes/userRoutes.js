const express = require("express");
const multer = require("multer");

const {
  updateProfile,
  deleteResume,
  getPublicProfile,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

// Resume upload happens here
router.put("/profile", protect, upload.single("resume"), updateProfile);

router.post("/resume", protect, deleteResume);

router.get("/:id", getPublicProfile);

module.exports = router;
