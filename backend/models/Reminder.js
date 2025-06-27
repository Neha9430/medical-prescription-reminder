// backend/models/reminder.model.js

import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  reminderTime: {
    type: String, // HH:mm format
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  taken: {
    type: Boolean,
    default: false
  }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;
