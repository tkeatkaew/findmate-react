const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

const knn = require("ml-knn");

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "findmatev3",
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
        "INSERT INTO personality_infomation (user_id, firstname, lastname, nickname, age, maritalstatus, gender, lgbt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
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

// Add Personal personalitytraits Route
app.post("/personalitytraits", (req, res) => {
  const {
    user_id,
    type,
    sleep,
    wake,
    clean,
    air_conditioner,
    drink,
    smoke,
    money,
    expense,
    pet,
    cook,
    loud,
    friend,
    religion,
    period,
  } = req.body;

  const insertTraitsQuery = `INSERT INTO personality_traits (user_id, type, sleep, wake, clean, air_conditioner, drink, smoke, money, expense, pet, cook, loud, friend, religion, period) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    insertTraitsQuery,
    [
      user_id,
      type,
      sleep,
      wake,
      clean,
      air_conditioner,
      drink,
      smoke,
      money,
      expense,
      pet,
      cook,
      loud,
      friend,
      religion,
      period,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error saving personality traits" });
      }
      res
        .status(200)
        .json({ message: "Personality traits saved successfully!" });
    }
  );
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

//KNN
app.post("/knn", (req, res) => {
  const { user_id } = req.body;

  const getAllTraitsQuery = `
    SELECT pt.*, pi.nickname, u.profile_picture
    FROM personality_traits pt
    JOIN personality_infomation pi ON pt.user_id = pi.user_id
    JOIN users u ON pt.user_id = u.id
  `;

  db.query(getAllTraitsQuery, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const currentUser = results.find((user) => user.user_id === user_id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const encodeTrait = (trait) => {
      const traitMap = {
        type_introvert: 1,
        type_extrovert: 2,
        type_ambivert: 3,
        sleep_before_midnight: 1,
        sleep_after_midnight: 2,
        wake_morning: 1,
        wake_noon: 2,
        wake_evening: 3,
        clean_every_day: 1,
        clean_every_other_day: 2,
        clean_once_a_week: 3,
        clean_dont_really: 4,
        ac_never: 1,
        ac_only_sleep: 2,
        ac_only_hot: 3,
        ac_all_day: 4,
        drink_never: 1,
        drink_spacial: 2,
        drink_weekend: 3,
        drink_always: 4,
        smoke_never: 1,
        smoke_spacial: 2,
        smoke_always: 3,
        money_on_time: 1,
        money_late: 2,
        money_half: 1,
        money_ratio: 2,
        pet_dont_have: 1,
        pet_have: 2,
        cook_ok: 1,
        cook_tell_first: 2,
        cook_no: 3,
        loud_low: 1,
        loud_medium: 2,
        loud_high: 3,
        friend_ok: 1,
        friend_tell_first: 2,
        friend_no: 3,
        religion_ok: 1,
        religion_no_affect: 2,
        religion_no: 3,
        period_long: 1,
        period_sometime: 2,
        period_no_need: 3,
      };
      return traitMap[trait] || 0;
    };

    const dataset = results.map((user) => ({
      id: user.user_id,
      traits: [
        encodeTrait(user.type),
        encodeTrait(user.sleep),
        encodeTrait(user.wake),
        encodeTrait(user.clean),
        encodeTrait(user.air_conditioner),
        encodeTrait(user.drink),
        encodeTrait(user.smoke),
        encodeTrait(user.money),
        encodeTrait(user.expense),
        encodeTrait(user.pet),
        encodeTrait(user.cook),
        encodeTrait(user.loud),
        encodeTrait(user.friend),
        encodeTrait(user.religion),
        encodeTrait(user.period),
      ],
    }));

    const currentUserTraits = [
      encodeTrait(currentUser.type),
      encodeTrait(currentUser.sleep),
      encodeTrait(currentUser.wake),
      encodeTrait(currentUser.clean),
      encodeTrait(currentUser.air_conditioner),
      encodeTrait(currentUser.drink),
      encodeTrait(currentUser.smoke),
      encodeTrait(currentUser.money),
      encodeTrait(currentUser.expense),
      encodeTrait(currentUser.pet),
      encodeTrait(currentUser.cook),
      encodeTrait(currentUser.loud),
      encodeTrait(currentUser.friend),
      encodeTrait(currentUser.religion),
      encodeTrait(currentUser.period),
    ];

    const calculateSimilarity = (targetTraits) => {
      const distance = Math.sqrt(
        targetTraits.reduce(
          (acc, trait, index) =>
            acc + Math.pow(trait - currentUserTraits[index], 2),
          0
        )
      );
      const maxDistance = Math.sqrt(
        currentUserTraits.length * Math.pow(4 - 1, 2)
      );
      return Math.round(((maxDistance - distance) / maxDistance) * 100);
    };

    const neighbors = dataset
      .filter((user) => user.id !== user_id)
      .map((user) => {
        const userTraits = results.find((u) => u.user_id === user.id);
        return {
          user_id: user.id,
          similarity: calculateSimilarity(user.traits),
          traits: userTraits,
        };
      })
      .sort((a, b) => b.similarity - a.similarity);

    res.status(200).json({ neighbors });
  });
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Add route to handle profile picture uploads
app.post(
  "/upload-profile-picture",
  upload.single("profile_picture"),
  (req, res) => {
    const { user_id } = req.body;
    const profilePictureUrl = `/uploads/${req.file.filename}`;
    const query = "UPDATE users SET profile_picture = ? WHERE id = ?";

    db.query(query, [profilePictureUrl, user_id], (err) => {
      if (err) {
        console.error("Error updating profile picture:", err);
        return res
          .status(500)
          .json({ error: "Failed to update profile picture" });
      }
      res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePictureUrl,
      });
    });
  }
);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Like Route
app.post("/like", (req, res) => {
  const { user_id, liked_user_id } = req.body;

  const likeQuery = "INSERT INTO likes (user_id, liked_user_id) VALUES (?, ?)";
  db.query(likeQuery, [user_id, liked_user_id], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const mutualLikeQuery = `
          SELECT * FROM likes
          WHERE user_id = ? AND liked_user_id = ?;
      `;
    db.query(mutualLikeQuery, [liked_user_id, user_id], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.length > 0) {
        const matchQuery = `
                  INSERT INTO matches (user1_id, user2_id)
                  VALUES (?, ?);
              `;
        db.query(matchQuery, [user_id, liked_user_id], (err) => {
          if (err) return res.status(500).json({ error: "Database error" });
          return res.status(200).json({ message: "Match created!" });
        });
      } else {
        return res.status(200).json({ message: "Like added!" });
      }
    });
  });
});

// Liked Route
app.get("/liked", (req, res) => {
  const { user_id } = req.query;

  const likedUsersQuery = `
      SELECT u.id, u.name, u.profile_picture
      FROM likes l
      JOIN users u ON l.liked_user_id = u.id
      WHERE l.user_id = ?;
  `;
  db.query(likedUsersQuery, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});

// Match Route
app.get("/matches", (req, res) => {
  const { user_id } = req.query;

  const matchesQuery = `
      SELECT u.id, u.name, u.profile_picture
      FROM matches m
      JOIN users u ON (m.user1_id = u.id OR m.user2_id = u.id)
      WHERE (m.user1_id = ? OR m.user2_id = ?) AND u.id != ?;
  `;
  db.query(matchesQuery, [user_id, user_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});
