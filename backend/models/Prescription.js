import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  timing: String,
  reminderTime: String,
});

const prescriptionSchema = new mongoose.Schema({
  patientName: String,
  doctorName: String,
  date: String,
  bp: String,
  spo2: String,
  contact: String,
  labName: String,
  medicines: [medicineSchema],

  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
