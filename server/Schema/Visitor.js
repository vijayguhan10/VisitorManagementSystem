const mongoose = require('mongoose');

const companionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  photo: { type: String, required: false },
});

const visitorGroupSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  primaryVisitor: {
    visitorName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    reason: { type: String, required: true },
    photoUrl: { type: String, required: true },
  },
  companions: {
    type: [companionSchema],
    required: false, 
    default: [],
  },
  inTime: { type: Date, default: Date.now },
  outTime: { type: Date, default: null },
});

module.exports = mongoose.model('VisitorGroup', visitorGroupSchema);
