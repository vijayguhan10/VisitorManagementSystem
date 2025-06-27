const twilio = require('twilio');

const accountSid = 'ACf8ce98cd49578deb2063d0be5931f505';
const authToken = 'e55b8e8869f752294d743bfdeb3f90da';

const client = twilio(accountSid, authToken);

exports.sendmessage=async(req,res)=>{
    const{phoneNumber,otp}=req.body;
    console.log("🎉🎉🎉🎉👏👏🤣🤣🤣",req.body)
    try {
        const message = await client.messages.create({
            body: `🔐 Secure Code: ${otp}\nUse this OTP to complete your registration.\nNever share this code with anyone.`,
            from: '+18624292969',
          to: '+918220563218'
        });
    
        res.status(200).send(`Message sent successfully. SID: ${message.sid}`);
      } catch (error) {
        console.log(error)
        res.status(500).send(`Failed to send message: ${error.message}`);
      }
    
}
// const nodemailer = require("nodemailer");

// exports.sendmessage = async (req, res) => {
//   const { email, otp } = req.body;
//   console.log("📧 Sending OTP to email:", email, "with OTP:", otp);

//   try {
//     // Configure the transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or use 'smtp.ethereal.email' for testing
//       auth: {
//         user: "sabarim6369@gmail.com",
//         pass: "uieq qvys aybv ldot",      // use app-specific password if 2FA enabled
//       },
//     });

//     // Email content
//     const mailOptions = {
//       from: '"VisitTrack" <your-email@gmail.com>', // sender address
//       to: email,                                   // receiver's email
//       subject: "🔐 Your OTP Code",
//       text: `Secure Code: ${otp}\nUse this OTP to complete your registration.\nNever share this code with anyone.`,
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     res.status(200).send(`Email sent successfully: ${info.response}`);
//   } catch (error) {
//     console.log("❌ Email sending failed:", error);
//     res.status(500).send(`Failed to send email: ${error.message}`);
//   }
// };
