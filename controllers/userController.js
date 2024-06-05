const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      universityName,
      studentId,
      studyingYear,
      phoneNumber,
      password,
    } = req.body;

    const errors = {};

    // Check if all required fields are present
    if (!name) {
      errors.name = "Name is required.";
    }
    if (!username) {
      errors.username = "Username is required.";
    }
    if (!email) {
      errors.email = "Email is required.";
    }
    if (!universityName) {
      errors.universityName = "University name is required.";
    }
    if (!studentId) {
      errors.studentId = "Student ID is required.";
    }
    if (!studyingYear) {
      errors.studyingYear = "Studying year is required.";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: { email: "User already exists with this email." } });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate tracking code
    const trackingCode = generateTrackingCode(10);

    const user = new User({
      name,
      username,
      email,
      universityName,
      studentId,
      studyingYear,
      phoneNumber,
      password: hashedPassword,
      trackingCode,
    });
    // Notify admin
    const admins = await User.find({ role: "admin" });
    if (admins.length === 0) {
      // Handle scenario where no admin users are found
      return res
        .status(404)
        .json({ errors: { message: "No admin users found" } });
    }

    const notification = new Notification({
      userId: admins._id, // Assuming there's only one admin for simplicity
      message: `New user registered: ${username}`,
    });
    await notification.save();

    await user.save();
    res.status(201).json({ user, trackingCode });
  } catch (error) {
    res.status(400).json({
      errors: { message: error.message || "Error registering user." },
    });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: { email: "Invalid email or password." } });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: { password: "Invalid email or password." } });
    }

    if (!user.isConfirmed) {
      return res.status(403).json({
        errors: {
          email:
            "Your registration is not confirmed yet, Will send you Confirmation through email.",
        },
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "100h" }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ errors: { message: "Internal server error." } });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update volunteering hours for a user
exports.updateVolunteeringHours = async (req, res) => {
  const { userId, hours } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.volunteeringHours += hours;
    await user.save();

    res.json({ message: "Volunteering hours updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch User Profile
exports.fetchUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Ensure valid role
    if (!["user", "admin", "superAdmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;

    await user.save();

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch User Role
exports.fetchUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ role: user.role });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const generateMembershipId = async (user) => {
  // If the user is not yet approved, return null
  if (user.applicationStatus !== "Approved") {
    return null;
  }

  let isUnique = false;
  let membershipId;

  while (!isUnique) {
    // Generate a new membership ID
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 900) + 100; // generates a random three-digit number
    membershipId = `N101${date}${randomNum}`;

    // Check if the generated membership ID already exists
    const existingUser = await User.findOne({ membershipId });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return membershipId;
};

const generateTrackingCode = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user status to "Approved"
    user.applicationStatus = "Approved";
    // Generate membership ID
    user.membershipId = generateMembershipId();

    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.trackApplication = async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const user = await User.findOne({ trackingCode });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ applicationStatus: user.applicationStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch notifications for admin
exports.fetchNotificationsForAdmin = async (req, res) => {
  try {
    const adminUser = await User.findOne({role: 'admin'});
    if (!adminUser) {
      // Handle the case where admin user is not found
      return res.status(404).json({ errors: { message: 'Admin user not found' } });
  }

  const adminUserId =  adminUser._id
    const notifications = await Notification.find({ userId: adminUserId });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update notification status
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.status = status;
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all unread notifications for admin
exports.getUnreadNotifications = async (req, res) => {
  try {
    const adminId = req.user.id; // Assuming you have authentication middleware
    const notifications = await Notification.find({
      recipient: adminId,
      status: "unread",
    }).populate("recipient");
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
