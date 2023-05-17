const nodemailer = require("nodemailer");
const { login } = require("../controllers/users");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/.env" });

const sender = process.env.EMAIL_NAME;
const password = process.env.EMAIL_PASSWORD;
exports.confrimEmail = async (name, recieverEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: sender,
      pass: password,
    },
    host: "smtp.gmail.com",
  });

  console.log(transporter);
  const mailOptions = {
    from: sender,
    to: recieverEmail,
    subject: "Confirm Your Email Address for AASTU-GDSC Inventory API",
    text: `Dear ${name}, \n
           Thank you for signing up for the AASTU-GDSC Inventory API!\n
           We are excited to have you join our community and
           can't wait to see what you will create with our API.
           To complete your registration, we need to confirm your email address.\nPlease click on the link below to verify your email address:\n
           http://localhost:3001/api/users/confrimed
           `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(sender, password);
      console.log(`Emial Sent`);
    }
  });
};
