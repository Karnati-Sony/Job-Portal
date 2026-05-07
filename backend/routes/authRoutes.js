const express = require("express");

const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// REGISTER
router.post(
  "/register",

  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "companyLogo",
      maxCount: 1,
    },
  ]),

  register
);

// LOGIN
router.post("/login", login);

// GET ME
router.get("/me", protect, getMe);

// UPDATE PROFILE
router.put(
  "/update-profile",
  protect,
  upload.single("resume"),
  updateProfile
);

// UPLOAD IMAGE
router.post(
  "/upload-image",
  upload.single("file"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileUrl =
      `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      imageUrl: fileUrl,
    });
  }
);

module.exports = router;