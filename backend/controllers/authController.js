// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmployeeModel = require("../models/Employee");

function generateUsername(name, phoneNumber) {
  const randomDigits = phoneNumber.toString().slice(-4); // Last 4 digits of the phone number
  const username = `${name.toLowerCase().replace(/\s+/g, "")}${randomDigits}`;
  return username;
}

exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, name, phoneNumber, locality } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = generateUsername(name, phoneNumber);

    const newEmployee = new EmployeeModel({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      locality,
      username,
    });

    await newEmployee.save();
    res.json({ message: "User registered successfully", username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await EmployeeModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "No record existed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "The password is incorrect" });
    }

    const token = jwt.sign(
      { username: user.username, userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true }).json({
      message: "Login successful",
      user: { username: user.username, name: user.name, id: user._id },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getUserInfo = async (req, res) => {
  try {
    const user = await EmployeeModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

