const mongoose = require('mongoose');

const companionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },
});

const visitorGroupSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  primaryVisitor: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    purpose: { type: String, required: true },
    photo: { type: String, required: true }, 
  },
  companions: [companionSchema],
  inTime: { type: Date, default: Date.now },
  outTime: { type: Date, default: null },
});

module.exports = mongoose.model('VisitorGroup', visitorGroupSchema);
