// const User = require("../models/user");

// exports.addUser = async (req, res) => {
//   const { first_name, last_name, email, age, is_active } = req.body;

//   try {
//     const newUser = new User({
//       first_name,
//       last_name,
//       email,
//       age,
//       is_active
//     });

//     await newUser.save();
//     res.status(201).send("User added successfully!");
//   } catch (error) {
//     res.status(500).send("Error adding user: " + error.message);
//   }
// };

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).send("Error fetching users: " + error.message);
//   }
// };

// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).send("Error fetching user: " + error.message);
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).send("Error updating user: " + error.message);
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User deleted successfully");
//   } catch (error) {
//     res.status(500).send("Error deleting user: " + error.message);
//   }
// };

// exports.softDeleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User soft deleted successfully");
//   } catch (error) {
//     res.status(500).send("Error soft deleting user: " + error.message);
//   }
// };

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./../models/user");
require("dotenv").config();

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // استخدم true في الإنتاج
      sameSite: "Lax", // هذا ضروري إذا كنت تعمل مع CORS
    });
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "User logged in successfully!" });
  } catch (error) {
    res.status(500).send("Error logging in user: " + error.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user;
    console.log("User ID from request:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error); // سجل الأخطاء لمساعدتك في تتبع المشكلات
    res.status(500).send("Error fetching user: " + error.message);
  }
};
