const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  clinicAddress: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);