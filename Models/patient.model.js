const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VitalSignsSchema = new Schema({
  dateTime: {
    type: Date,
    required: true,
  },
  vitalSigns: {
    bloodPressure: String,
    respiratoryRate: Number,
    bloodOxygenLevel: Number,
    heartBeatRate: Number,
  },
});
const PatientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  records: [VitalSignsSchema],
});

const Patient = mongoose.model('patient', PatientSchema);
module.exports = Patient;
