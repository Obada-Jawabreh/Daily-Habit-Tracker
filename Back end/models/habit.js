// models/habit.js

const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  frequency: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  progress: [
    {
      date: { type: Date },
      completed: { type: Boolean }
    }
  ]
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
