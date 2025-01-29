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
// Modify your login route in server.js
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const getUserQuery =
    "SELECT id, name, email, password, role, profile_picture, is_suspended, suspension_reason FROM users WHERE email = ?";

  db.query(getUserQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Check if user is suspended
    if (user.is_suspended) {
      return res.status(403).json({
        error: "Account suspended",
        reason: user.suspension_reason,
      });
    }

    // Continue with normal login...
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_picture: user.profile_picture,
    };

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
    province,
    university,
    facebook,
    instagram,
    line_id,
    phone,
    dorm_name,
    vehicle,
    self_introduction,
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
    lgbt,
    province,
    university,
    facebook,
    instagram,
    line_id,
    phone,
    dorm_name,
    vehicle,
    self_introduction
  );

  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      // User exists, insert data into the `findmate` table
      const userId = result[0].id;
      const insertPersonalInfoQuery = `
        INSERT INTO personality_infomation (
          user_id, firstname, lastname, nickname, age, maritalstatus, 
          gender, lgbt, province, university, facebook, instagram, 
          line_id, phone, dorm_name, vehicle, self_introduction
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
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
          province,
          university,
          facebook,
          instagram,
          line_id,
          phone,
          dorm_name,
          vehicle,
          self_introduction,
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
    SELECT pt.*, pi.*, u.profile_picture
    FROM personality_traits pt
    JOIN personality_infomation pi ON pt.user_id = pi.user_id
    JOIN users u ON pt.user_id = u.id
    WHERE u.role = 'user' && u.is_suspended = 0
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
        type_ambivert: 2,
        type_extrovert: 3,
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

// Like/Unlike Route
app.post("/like", async (req, res) => {
  const { user_id, liked_user_id, action } = req.body;

  try {
    if (action === "unlike") {
      // Remove like
      const unlikeQuery =
        "DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?";
      await new Promise((resolve, reject) => {
        db.query(unlikeQuery, [user_id, liked_user_id], (err) => {
          if (err) reject(err);
          resolve();
        });
      });

      // Remove match if exists
      const removeMatchQuery = `
        DELETE FROM matches 
        WHERE (user1_id = ? AND user2_id = ?) 
        OR (user1_id = ? AND user2_id = ?)
      `;
      await new Promise((resolve, reject) => {
        db.query(
          removeMatchQuery,
          [user_id, liked_user_id, liked_user_id, user_id],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      return res
        .status(200)
        .json({ message: "Like and match removed successfully!" });
    } else {
      // Add like
      const likeQuery =
        "INSERT INTO likes (user_id, liked_user_id) VALUES (?, ?)";
      await new Promise((resolve, reject) => {
        db.query(likeQuery, [user_id, liked_user_id], (err) => {
          if (err) reject(err);
          resolve();
        });
      });

      // Check for mutual like
      const checkMutualLikeQuery =
        "SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?";
      const mutualLike = await new Promise((resolve, reject) => {
        db.query(
          checkMutualLikeQuery,
          [liked_user_id, user_id],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (mutualLike.length > 0) {
        // Create match
        const createMatchQuery =
          "INSERT INTO matches (user1_id, user2_id) VALUES (?, ?)";
        await new Promise((resolve, reject) => {
          db.query(createMatchQuery, [user_id, liked_user_id], (err) => {
            if (err) reject(err);
            resolve();
          });
        });
        return res.status(200).json({ message: "Match created successfully!" });
      }

      return res.status(200).json({ message: "Like added successfully!" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Database error: " + err.message });
  }
});

// Get Liked Users Route
app.get("/liked", (req, res) => {
  const { user_id } = req.query;

  const likedUsersQuery = `
    SELECT u.id, u.name, u.profile_picture, pi.*, pt.*
    FROM likes l
    JOIN users u ON l.liked_user_id = u.id
    LEFT JOIN personality_infomation pi ON u.id = pi.user_id
    LEFT JOIN personality_traits pt ON u.id = pt.user_id
    WHERE l.user_id = ?
  `;

  db.query(likedUsersQuery, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});

// Get Matches Route
app.get("/matches", (req, res) => {
  const { user_id } = req.query;

  const matchesQuery = `
    SELECT u.id, u.name, u.profile_picture, pi.*, pt.*
    FROM matches m
    JOIN users u ON (m.user1_id = u.id OR m.user2_id = u.id)
    LEFT JOIN personality_infomation pi ON u.id = pi.user_id
    LEFT JOIN personality_traits pt ON u.id = pt.user_id
    WHERE (m.user1_id = ? OR m.user2_id = ?) AND u.id != ?
  `;

  db.query(matchesQuery, [user_id, user_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
});

// Check Like Status Route
app.get("/check-like", (req, res) => {
  const { user_id, target_user_id } = req.query;

  const checkLikeQuery =
    "SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?";
  db.query(checkLikeQuery, [user_id, target_user_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json({ isLiked: result.length > 0 });
  });
});

// Get user's personal information
app.get("/personalinfo/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM personality_infomation WHERE user_id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User information not found" });
    }
    res.status(200).json(result[0]);
  });
});

// Get user's personality traits
app.get("/personalitytraits/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM personality_traits WHERE user_id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Personality traits not found" });
    }
    res.status(200).json(result[0]);
  });
});

// Update user's personal information
app.put("/personalinfo/:userId", (req, res) => {
  const userId = req.params.userId;
  const {
    firstname,
    lastname,
    nickname,
    age,
    maritalstatus,
    gender,
    lgbt,
    province,
    university,
    facebook,
    instagram,
    line_id,
    phone,
    dorm_name,
    vehicle,
    self_introduction,
  } = req.body;

  const query = `
    UPDATE personality_infomation 
    SET firstname = ?, lastname = ?, nickname = ?, age = ?, 
        maritalstatus = ?, gender = ?, lgbt = ?, province = ?, 
        university = ?, facebook = ?, instagram = ?, line_id = ?, 
        phone = ?, dorm_name = ?, vehicle = ?, self_introduction = ?
    WHERE user_id = ?
  `;

  db.query(
    query,
    [
      firstname,
      lastname,
      nickname,
      age,
      maritalstatus,
      gender,
      lgbt,
      province,
      university,
      facebook,
      instagram,
      line_id,
      phone,
      dorm_name,
      vehicle,
      self_introduction,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Error updating personal information" });
      }
      res
        .status(200)
        .json({ message: "Personal information updated successfully" });
    }
  );
});

// Update user's personality traits
app.put("/personalitytraits/:userId", (req, res) => {
  const userId = req.params.userId;
  const {
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

  const query = `
    UPDATE personality_traits 
    SET type = ?, sleep = ?, wake = ?, clean = ?, 
        air_conditioner = ?, drink = ?, smoke = ?, 
        money = ?, expense = ?, pet = ?, cook = ?, 
        loud = ?, friend = ?, religion = ?, period = ?
    WHERE user_id = ?
  `;

  const values = [
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
    userId,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "Error updating personality traits" });
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      // If no existing record, insert a new one
      const insertQuery = `
        INSERT INTO personality_traits 
        (user_id, type, sleep, wake, clean, air_conditioner, drink, 
         smoke, money, expense, pet, cook, loud, friend, religion, period)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [userId, ...values.slice(0, -1)],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Database error during insert:", insertErr);
            return res
              .status(500)
              .json({ error: "Error creating personality traits" });
          }
          res
            .status(201)
            .json({ message: "Personality traits created successfully" });
        }
      );
    } else {
      res
        .status(200)
        .json({ message: "Personality traits updated successfully" });
    }
  });
});

// Update user profile
app.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const { name, email } = req.body;

  const query = `
    UPDATE users 
    SET name = ?, email = ?
    WHERE id = ?
  `;

  db.query(query, [name, email, userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error updating user profile" });
    }

    // Update the user information in the session if it exists
    if (req.session.user && req.session.user.id === parseInt(userId)) {
      req.session.user = {
        ...req.session.user,
        name,
        email,
      };
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        id: userId,
        name,
        email,
      },
    });
  });
});

// Verify password endpoint
app.post("/verify-password", (req, res) => {
  const { user_id, password } = req.body;

  // Get user's stored password hash
  const query = "SELECT password FROM users WHERE id = ?";
  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare provided password with stored hash
    const isValid = bcrypt.compareSync(password, result[0].password);
    res.json({ verified: isValid });
  });
});

// Delete account endpoint
app.delete("/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Delete from personality_traits
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM personality_traits WHERE user_id = ?",
        [userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    // Delete from personality_infomation
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM personality_infomation WHERE user_id = ?",
        [userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    // Delete from likes
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM likes WHERE user_id = ? OR liked_user_id = ?",
        [userId, userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    // Delete from matches
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM matches WHERE user1_id = ? OR user2_id = ?",
        [userId, userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    // Finally, delete the user
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Clear user session if it exists
    if (req.session.user && req.session.user.id === parseInt(userId)) {
      req.session.destroy();
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    // Rollback on error
    await new Promise((resolve) => {
      db.rollback(() => resolve());
    });
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
});

// Change password endpoint
app.put("/users/:userId/password", (req, res) => {
  const userId = req.params.userId;
  const { newPassword } = req.body;

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // Update the password in the database
  const query = "UPDATE users SET password = ? WHERE id = ?";

  db.query(query, [hashedPassword, userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error updating password" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  });
});

// Add these new routes to server.js

// Admin Stats Route
app.get("/admin/stats", async (req, res) => {
  try {
    const [usersResult, matchesResult, reportsResult] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(
          "SELECT COUNT(*) as count FROM users WHERE role = 'user'",
          (err, result) => {
            if (err) reject(err);
            resolve(result[0].count);
          }
        );
      }),
      new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM matches", (err, result) => {
          if (err) reject(err);
          resolve(result[0].count);
        });
      }),
      new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as count FROM reports", (err, result) => {
          if (err) reject(err);
          resolve(result[0].count);
        });
      }),
    ]);

    res.json({
      totalUsers: usersResult,
      totalMatches: matchesResult,
      totalReports: reportsResult,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Reports Routes
app.post("/reports/user", async (req, res) => {
  const { reporter_id, reported_user_id, type, description } = req.body;

  const query = `
    INSERT INTO reports (reporter_id, reported_user_id, type, description, report_type, status)
    VALUES (?, ?, ?, ?, 'user', 'pending')
  `;

  db.query(
    query,
    [reporter_id, reported_user_id, type, description],
    (err, result) => {
      if (err) {
        console.error("Error creating user report:", err);
        return res.status(500).json({ error: "Error creating report" });
      }
      res.status(201).json({ message: "Report created successfully" });
    }
  );
});

app.get("/admin/user-reports", (req, res) => {
  const query = `
    SELECT r.*, 
           u1.name as reporter_name,
           u2.name as reported_user_name
    FROM reports r
    JOIN users u1 ON r.reporter_id = u1.id
    JOIN users u2 ON r.reported_user_id = u2.id
    WHERE r.report_type = 'user'
    ORDER BY r.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching user reports:", err);
      return res.status(500).json({ error: "Error fetching reports" });
    }
    res.json(results);
  });
});

// System Reports Routes
app.post("/reports/system", upload.single("image"), async (req, res) => {
  const { user_id, type, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO reports (reporter_id, type, description, image, report_type, status)
    VALUES (?, ?, ?, ?, 'system', 'pending')
  `;

  db.query(query, [user_id, type, description, image], (err, result) => {
    if (err) {
      console.error("Error creating system report:", err);
      return res.status(500).json({ error: "Error creating report" });
    }
    res.status(201).json({ message: "Report created successfully" });
  });
});

app.get("/admin/system-reports", (req, res) => {
  const query = `
    SELECT r.*, u.name as reporter_name
    FROM reports r
    JOIN users u ON r.reporter_id = u.id
    WHERE r.report_type = 'system'
    ORDER BY r.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching system reports:", err);
      return res.status(500).json({ error: "Error fetching reports" });
    }
    res.json(results);
  });
});

// Suggestions Routes
app.post("/suggestions", async (req, res) => {
  const { user_id, content } = req.body;

  const query = `
    INSERT INTO suggestions (user_id, content, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(query, [user_id, content], (err, result) => {
    if (err) {
      console.error("Error creating suggestion:", err);
      return res.status(500).json({ error: "Error creating suggestion" });
    }
    res.status(201).json({ message: "Suggestion created successfully" });
  });
});

app.get("/admin/suggestions", (req, res) => {
  const query = `
    SELECT s.*, u.name as user_name
    FROM suggestions s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching suggestions:", err);
      return res.status(500).json({ error: "Error fetching suggestions" });
    }
    res.json(results);
  });
});

// Update Report Status
app.post("/admin/reports/:id/action", (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const query = "UPDATE reports SET status = ? WHERE id = ?";

  db.query(query, [action, id], (err, result) => {
    if (err) {
      console.error("Error updating report status:", err);
      return res.status(500).json({ error: "Error updating report" });
    }
    res.json({ message: "Report updated successfully" });
  });
});

// Add user action route (suspend/unsuspend)
app.post("/admin/user-action/:userId", async (req, res) => {
  const { userId } = req.params;
  const { action, reason, report_id } = req.body;

  try {
    if (action === "suspend") {
      // Update user's suspension status
      await new Promise((resolve, reject) => {
        db.query(
          "UPDATE users SET is_suspended = 1, suspension_reason = ? WHERE id = ?",
          [reason, userId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    } else if (action === "unsuspend") {
      // Remove user's suspension
      await new Promise((resolve, reject) => {
        db.query(
          "UPDATE users SET is_suspended = 0, suspension_reason = NULL WHERE id = ?",
          [userId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    }

    // Update report status
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE reports SET status = ? WHERE id = ?",
        [action === "suspend" ? "resolved" : "pending", report_id],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    res.json({ message: "User action completed successfully" });
  } catch (error) {
    console.error("Error performing user action:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add delete report route
app.delete("/admin/reports/:reportId", async (req, res) => {
  const { reportId } = req.params;

  try {
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM reports WHERE id = ?", [reportId], (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
