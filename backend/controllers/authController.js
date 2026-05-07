const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

// @desc Register new user
exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
      companyName,
      companyDescription,
    } = req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,

      // JOBSEEKER AVATAR
      avatar: req.files?.avatar
        ? `/uploads/${req.files.avatar[0].filename}`
        : "",

      // EMPLOYER COMPANY DATA
      companyName,

      companyDescription,

      companyLogo: req.files?.companyLogo
        ? `/uploads/${req.files.companyLogo[0].filename}`
        : "",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,

      avatar: user.avatar || "",

      companyName:
        user.companyName || "",

      companyDescription:
        user.companyDescription || "",

      companyLogo:
        user.companyLogo || "",

      token: generateToken(user._id),
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

// @desc Login user
exports.login = async (req, res) => {
        try {
  console.log("LOGIN BODY:", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email});
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
 
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
    avatar: user.avatar || '',
    companyName: user.companyName || '',
    companyDescription: user.companyDescription || '',
    companyLogo: user.companyLogo || '',
    resume: user.resume || '',
  });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Get logged-in user
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// @desc Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, avatar, resume } = req.body;

    console.log("UPDATE_PROFILE req.body:", req.body);
    console.log("BEFORE SAVE user.resume:", user.resume);

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;
    if (req.file) {
  user.resume = `/uploads/${req.file.filename}`;
}
    const updatedUser = await user.save();

    console.log("AFTER SAVE updatedUser.resume:", updatedUser.resume);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      resume: updatedUser.resume,
    });
  } catch (err) {
    console.error("UPDATE_PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};