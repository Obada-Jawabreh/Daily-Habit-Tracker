// const express = require("express");
// const router = express.Router();

// const userController= require("./../Controllers/userController");

// router.post("/add-user",userController.addUser);
// router.get("/users", userController.getUsers);
// router.get("/users/:id", userController.getUserById);
// router.put("/users/:id", userController.updateUser);
// router.delete("/users/:id", userController.deleteUser);
// router.patch("/users/:id/soft-delete", userController.softDeleteUser);

// module.exports = router;
// // /api/users/add-user
// // /api/users/users
// // /api/users/users/:id
// // /api/users/users/:id
// // /api/users/users/:id
// // /api/users/api/users

const express = require("express");
const router = express.Router();
const userController= require("./../Controllers/userController");
const auth = require("./../Middleware/auth")

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", auth ,userController.getUser);

module.exports = router;
