const express = require('express');
const router = express.Router();
const {
  registerVisitor,
  markExit,
  getAllVisitors,
} = require('../Controller/visitor');

router.post('/register', registerVisitor);
router.post('/exit', markExit);
router.get('/', getAllVisitors);

module.exports = router;
