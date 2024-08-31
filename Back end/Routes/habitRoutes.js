// routes/habitRoutes.js

const express = require("express");
const router = express.Router();
const habitController = require("../Controllers/habitController");
const auth= require("../Middleware/auth");

// // حماية المسارات باستخدام JWT
// router.use(auth);

// مسارات العادات
router.post('/habits', auth , habitController.addHabit);
router.put('/habits/:habitId/progress', auth , habitController.trackHabitProgress);
router.put('/habits/:habitId',  auth ,habitController.editHabit);
router.delete('/habits/:habitId', auth , habitController.deleteHabit);
router.get('/habits', auth , habitController.getHabits);

module.exports = router;
