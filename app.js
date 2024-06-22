import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// This line let us use .body method
app.use(bodyParser.urlencoded({ extended: true }));
// Declare static file public
app.use(express.static("public"));

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

// Listening port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
