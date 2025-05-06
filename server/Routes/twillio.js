const express = require('express');
const router = express.Router();
const {
    sendmessage
}=require("../Controller/twilio")
router.post("/sendmessage",sendmessage);
module.exports = router;