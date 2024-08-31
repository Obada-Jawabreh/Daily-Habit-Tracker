// controllers/habitController.js

const Habit = require("../models/habit");
const User = require("../models/user");

// إضافة عادة جديدة
exports.addHabit = async (req, res) => {
    try {
      const userId = req.user; 
      console.log(userId);
     
      const habit = new Habit({ ...req.body, userId });
      const savedHabit = await habit.save();
      await User.findByIdAndUpdate(userId, { $push: { habits: savedHabit._id } });
      res.status(201).json(savedHabit);
    } catch (error) {
      console.error('Error adding habit:', error);
      res.status(500).json({ message: "Failed to add habit", error });
    }
  };
  
  
  // تحديث تقدم العادة
  exports.trackHabitProgress = async (req, res) => {
    try {
      const { habitId } = req.params;
      const { date, completed } = req.body;
  
      const habit = await Habit.findOne({ _id: habitId, userId: req.user });
  
      if (!habit) {
        return res.status(404).json({ message: "Habit not found or access denied" });
      }
  
      // تحويل التاريخ إلى نفس الشكل الذي يتم تخزينه به في قاعدة البيانات
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const progressEntry = habit.progress.find(entry => entry.date.toISOString().split('T')[0] === formattedDate);
  
      if (progressEntry) {
        progressEntry.completed = completed;
      } else {
        habit.progress.push({ date: new Date(date), completed });
      }
  
      await habit.save();
      res.json(habit);
    } catch (error) {
      console.error('Error updating progress:', error.message);
      res.status(500).json({ message: "Failed to update progress", error: error.message });
    }
  };
  
  // تعديل العادة
  exports.editHabit = async (req, res) => {
    try {
      const { habitId } = req.params;
  
      const updatedHabit = await Habit.findOneAndUpdate(
        { _id: habitId, userId: req.user }, 
        req.body,
        { new: true }
      );
  
      if (!updatedHabit) {
        return res.status(404).json({ message: "Habit not found or access denied" });
      }
  
      res.json(updatedHabit);
    } catch (error) {
      console.error('Error editing habit:', error.message);
      res.status(500).json({ message: "Failed to edit habit", error: error.message });
    }
  };
  
  
  // حذف العادة
  exports.deleteHabit = async (req, res) => {
    try {
      const { habitId } = req.params;
  
      const deletedHabit = await Habit.findOneAndDelete({ _id: habitId, userId: req.user }); 

      if (!deletedHabit) {
        return res.status(404).json({ message: "Habit not found or access denied" });
      }
  
      await User.findByIdAndUpdate(req.user, { $pull: { habits: habitId } });
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting habit:', error.message);
      res.status(500).json({ message: "Failed to delete habit", error: error.message });
    }
  };
  
  
  // الحصول على العادات مع الفلاتر
  exports.getHabits = async (req, res) => {
    try {
      const userId = req.user;
      const filters = req.query;
  
      const query = { userId }; 
      if (filters.category) query.category = filters.category;
      if (filters.tags) query.tags = { $in: filters.tags };
      if (filters.frequency) query.frequency = filters.frequency;
  
      const habits = await Habit.find(query);
      res.json(habits);
    } catch (error) {
      console.error('Error fetching habits:', error.message);
      res.status(500).json({ message: "Failed to fetch habits", error: error.message });
    }
  };
  