import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import env from "dotenv";
import sgMail from "@sendgrid/mail";

// Load environment variables from .env file
env.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This line let us use .body method
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // To parse JSON bodies

// Declare static file public
app.use(express.static("public"));

// Generate a random OTP
const generateRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
app.post("/send-otp", (req, res) => {
  const email = req.body.email;
  const otp = generateRandomOTP();

  const msg = {
    to: email,
    from: 'mrdeadstark@gmail.com', // Change to your verified sender
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
    html: `<strong>Your OTP code is ${otp}</strong>`,
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Email sent');
      res.status(200).send({ success: true, otp });
    })
    .catch((error) => {
      console.error('Error sending email:', error); // Log the error details
      res.status(500).send({ success: false, error: error.message });
    });
});

// Get requests
app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.get("/signin", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/dashboard", (req, res) => {
  res.render("<h1> Success </h1>");
});

// Listening port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});