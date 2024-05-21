const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const LoginSchema = new mongoose.Schema({
  usernameOrEmail: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

// Hash password before saving
LoginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Login", LoginSchema);
