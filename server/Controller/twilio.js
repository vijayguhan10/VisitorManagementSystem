const twilio = require('twilio');

const accountSid = 'ACf8ce98cd49578deb2063d0be5931f505';
const authToken = '2d1202efc845396b3efb00fb27206d98';

const client = twilio(accountSid, authToken);

exports.sendmessage = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const message = await client.messages.create({
      body: `🔐 Secure Code: ${otp}\nUse this OTP to complete your registration.\nNever share this code with anyone.`,
      from: '+18624292969',  // Twilio number
      to: '+918220563218'    // Hardcoded for now
    });

    res.status(200).send(`Message sent successfully. SID: ${message.sid}`);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Failed to send message: ${error.message}`);
  }
};
