const fs = require("fs");
const path = require("path");
const User = require("../models/User");

/**
 * @desc    Update user profile (name, avatar, resume, company details)
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, companyName, companyDescription, companyLogo, resume } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
   if (req.file) {
  user.resume = `/uploads/${req.file.filename}`;
}


    // Employer can update company info
    if (user.role === "employer") {
      user.companyName = companyName || user.companyName;
      user.companyDescription = companyDescription || user.companyDescription;
      user.companyLogo = companyLogo || user.companyLogo;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      companyLogo: user.companyLogo,
      resume: user.resume || '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Delete resume file (jobseeker only)
 * @route   DELETE /api/users/resume
 * @access  Private
 */
exports.deleteResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    // Extract filename from URL
    const fileName = resumeUrl?.split("/").pop();

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "jobseeker") {
      return res
        .status(403)
        .json({ message: "Only jobseekers can delete resume" });
    }

    // Build full file path
    const filePath = path.join(__dirname, "../uploads", fileName);

    // Delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Clear resume field
    user.resume = "";
    await user.save();

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Get user public profile
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};