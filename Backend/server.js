const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "findmate",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3001", // React app URL
    credentials: true,
  })
);
app.use(
  session({
    secret: "#FM2024",
    resave: false,
    saveUninitialized: false,
  })
);

// Register Route
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertUserQuery =
      "INSERT INTO users (name, email, password,role) VALUES (?, ?, ?, ?)";
    db.query(
      insertUserQuery,
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error inserting user" });
        console.log(result);
        res.status(200).json({
          id: result.insertId,
          email: checkEmailQuery,
          message: "User registered successfully!",
        });
      }
    );
    console.log(name, email, hashedPassword, role);
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const getUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(getUserQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid password" });
    }
    req.session.user = { id: user.id, name: user.name, email: user.email };
    res.status(200).json({ user: req.session.user });
  });
});

// Add Personal Information Route
app.post("/personalinfo", (req, res) => {
  const {
    user_id,
    email,
    firstname,
    lastname,
    nickname,
    age,
    maritalstatus,
    gender,
    lgbt,
  } = req.body;

  // Check if the user exists in the `users` table
  const checkEmailQuery = "SELECT id FROM users WHERE email = ?";

  console.log(
    email,
    user_id,
    firstname,
    lastname,
    nickname,
    age,
    maritalstatus,
    gender,
    lgbt
  );

  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      // User exists, insert data into the `findmate` table
      const userId = result[0].id;
      const insertPersonalInfoQuery =
        "INSERT INTO personalinfomation (user_id, firstname, lastname, nickname, age, maritalstatus, gender, lgbt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        insertPersonalInfoQuery,
        [
          user_id,
          firstname,
          lastname,
          nickname,
          age,
          maritalstatus,
          gender,
          lgbt,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Error inserting user information" });
          }
          return res
            .status(200)
            .json({ message: "User information updated successfully!" });
        }
      );
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  });
});

// Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Protected Route (example)
app.get("/home", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  res.status(200).json({ user: req.session.user });
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
