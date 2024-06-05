const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    universityName: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
    },
    studyingYear: {
      type: Number,
      required: [true, "Studying year is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d+$/, "Please enter a valid phone number"],
    },
    membershipId: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    volunteeringHours: {
      type: Number,
      default: 0,
    },
    applicationStatus: {
      type: String,
      enum: ["Submitted", "Pending Review", "Approved", "Rejected"],
      default: "Submitted",
    },
    trackingCode: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Trigger notification to admins upon user registration
UserSchema.post('save', async function (doc) {
  if (doc.isNew) {
    try {
      const admins = await this.model('User').find({ role: 'admin' });
      const message = `New user registered: ${doc.username}`;
      for (const admin of admins) {
        const notification = new Notification({ userId: admin._id, message });
        await notification.save();
      }
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  }
});


module.exports = mongoose.model("User", UserSchema);
