const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users");
const app = express();
const port = 3000;

require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  //Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Checking if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered." });
  }

  // Creating a new user
  const newUser = new User({
    name,
    email,
    password,
  });

  //save to database
  try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    //return the user object back
    res
      .status(201)
      .json({ message: "User registered successfully!", savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
