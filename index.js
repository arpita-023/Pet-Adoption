// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("./User"); // Ensure the path is correct

dotenv.config();

const app = express();
const port = process.env.PORT || 8002;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "Pet",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  if (!username || !email || !password || !phoneNumber) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});
// Login Endpoint
app.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).send("Username/Email and password are required");
  }

  try {
    // Check if the user exists
    const existingUser = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!existingUser) {
      return res.status(400).send("User does not exist");
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    res.status(200).send("Login successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
