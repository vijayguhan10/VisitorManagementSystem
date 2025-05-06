const VisitorGroup = require('../Schema/Visitor');
const { v4: uuidv4 } = require('uuid');

exports.registerVisitor = async (req, res) => {
  try {
    const { primaryVisitor, companions } = req.body;
    const groupId = uuidv4();

    const group = await VisitorGroup.create({
      groupId,
      primaryVisitor,
      companions,
    });

    res.status(201).json({ message: 'Visitor registered', groupId, group });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markExit = async (req, res) => {
  try {
    const { groupId } = req.body;
    const updated = await VisitorGroup.findOneAndUpdate(
      { groupId, outTime: null },
      { outTime: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Group not found or already exited' });

    res.json({ message: 'Visitor(s) marked out', updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await VisitorGroup.find().sort({ inTime: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
