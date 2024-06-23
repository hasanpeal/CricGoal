import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import env from "dotenv";
import sgMail from "@sendgrid/mail";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import flash from "connect-flash";

// Load environment variables from .env file
env.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const saltRounds = 10;
// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This line let us use .body method
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To parse JSON bodies

// Declare static file public
app.use(express.static("public"));
// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash()); // Use flash middleware here

app.use(passport.initialize());

app.use(passport.session());

// Database connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

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
    from: "mrdeadstark@gmail.com", // Change to your verified sender
    subject: "Your CricScore OTP Code is here",
    text: `Your OTP code is ${otp}`,
    html: `<strong>Your OTP code is ${otp}</strong>`,
  };

  sgMail
    .send(msg)
    .then(async () => {
      console.log("Email sent");
      res.status(200).send({ success: true, otp });
    })
    .catch((error) => {
      console.error("Error sending email:", error); // Log the error details
      res.status(500).send({ success: false, error: error.message });
    });
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM auth WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      res.redirect("/signin");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password");
        } else {
          const result = await db.query(
            "INSERT INTO auth (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
            req.login(user, (err) => {
            console.log("Success");
            res.redirect("/dashboard");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/dashboard",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);


// Get requests
app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.get("/signin", (req, res) => {
  res.render("login.ejs", {message: req.flash('error')});
});

app.post("/signin", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/signin",
  failureFlash: true
}))

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard.ejs");
});

passport.use("local", new Strategy(async function verify(username, password, cb) {
  try{
    const result = await db.query("SELECT * FROM auth WHERE email = $1", [username]);
    if(result.rows.length > 0){
      const user = result.rows[0];
      const hashedPass = user.password;
      bcrypt.compare(password, hashedPass, (err, valid) => {
        if(err) {
          console.log("Error comparing password");
          return cb(err);
        } else {
          if(valid){
            return cb(null, user);
          } else {
            return cb(null, false, { message: "Incorrect password" });
          }
        }
      });
    } else {
      return cb(null, false, { message: "Incorrect email" });
    }
  } catch(err) {
    console.log(err);
  }
}))

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/dashboard",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Listening port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
