const VisitorGroup = require('../Schema/Visitor');

const generateUniqueGroupId = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let groupId;
  while (true) {
    groupId = '';
    for (let i = 0; i < 4; i++) {
      groupId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existing = await VisitorGroup.findOne({ groupId });
    if (!existing) break; 
  }

  return groupId;
};

exports.registerVisitor = async (req, res) => {
  console.log(req.body);
  try {
    const { visitorName, phoneNumber, reason, address, photoUrl, companions } = req.body;
    const groupId = await generateUniqueGroupId();

    const group = await VisitorGroup.create({
      groupId,
      primaryVisitor: {
        visitorName,
        phoneNumber,
        reason,
        address,
        photoUrl,
      },
      companions,
    });

    console.log("Visitor registered ✅");

    res.status(201).json({ message: 'Visitor registered', groupId, group });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.markExit = async (req, res) => {
  console.log(req.body)
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
