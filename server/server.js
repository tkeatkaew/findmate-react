const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

const knn = require("ml-knn");

const nodemailer = require("nodemailer");

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "findmatev3",
});

// const db = mysql.createConnection({
//   host: "mysql.railway.internal",
//   user: "root",
//   password: "hAGSisGocpxGJpFQzPDLxdyZxOlaJGsG",
//   database: "railway",
// });

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

//Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "findmate.official@gmail.com", // Your Gmail address
    pass: "buky yekv rhsp pyta", // Your Gmail app password
  },
});

// Store registration data and OTPs temporarily (in production, use Redis)
const pendingRegistrations = new Map();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOTP(email, otp) {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your Find Mate Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>ยืนยันตัวตนสำหรับ Find Mate</h2>
        <p>รหัส OTP ของคุณคือ:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #4a90e2;">${otp}</h1>
        <p>รหัสนี้จะหมดอายุในอีก 5 นาที</p>
        <p>หากคุณไม่ได้ทำการลงทะเบียน กรุณาละเว้นข้อความนี้</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if email exists
    const emailCheckResult = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    if (emailCheckResult.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate OTP and store registration data
    const otp = generateOTP();
    const registrationId = Date.now().toString(); // Simple unique ID
    const hashedPassword = bcrypt.hashSync(password, 10);

    pendingRegistrations.set(registrationId, {
      userData: {
        name,
        email,
        hashedPassword,
        role,
      },
      otp: {
        code: otp,
        timestamp: Date.now(),
        attempts: 0,
      },
    });

    // Send OTP
    await sendOTP(email, otp);

    // Return registration ID instead of user ID
    res.status(200).json({
      registration_id: registrationId,
      message: "Registration initiated. Please verify your email.",
    });

    // Clean up old pending registrations after 10 minutes
    setTimeout(() => {
      pendingRegistrations.delete(registrationId);
    }, 10 * 60 * 1000);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Error during registration" });
  }
});

// Add OTP verification endpoint
// In server.js - Update the /verify-otp endpoint

app.post("/verify-otp", async (req, res) => {
  const { registration_id, otp } = req.body;
  const registrationData = pendingRegistrations.get(registration_id);

  if (!registrationData) {
    return res
      .status(400)
      .json({ error: "Registration expired. Please register again." });
  }

  const { userData, otp: otpData } = registrationData;

  // Check if OTP is expired (5 minutes)
  if (Date.now() - otpData.timestamp > 5 * 60 * 1000) {
    pendingRegistrations.delete(registration_id);
    return res
      .status(400)
      .json({ error: "OTP expired. Please register again." });
  }

  // Check attempts
  if (otpData.attempts >= 3) {
    pendingRegistrations.delete(registration_id);
    return res
      .status(400)
      .json({ error: "Too many attempts. Please register again." });
  }

  // Verify OTP
  if (otpData.code === otp) {
    try {
      // Insert verified user into database
      const result = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO users (name, email, password, role, email_verified) VALUES (?, ?, ?, ?, true)",
          [
            userData.name,
            userData.email,
            userData.hashedPassword,
            userData.role,
          ],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      // Clean up pending registration
      pendingRegistrations.delete(registration_id);

      // Return full user data
      return res.json({
        verified: true,
        user_id: result.insertId,
        user: {
          id: result.insertId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        },
      });
    } catch (err) {
      console.error("Error creating user:", err);
      return res.status(500).json({ error: "Error creating user account" });
    }
  }

  // Invalid OTP
  otpData.attempts += 1;
  return res.status(400).json({ error: "Invalid OTP" });
});

// Add resend OTP endpoint
app.post("/resend-otp", async (req, res) => {
  const { registration_id } = req.body;
  const registrationData = pendingRegistrations.get(registration_id);

  if (!registrationData) {
    return res
      .status(400)
      .json({ error: "Registration expired. Please register again." });
  }

  try {
    const newOtp = generateOTP();
    registrationData.otp = {
      code: newOtp,
      timestamp: Date.now(),
      attempts: 0,
    };

    await sendOTP(registrationData.userData.email, newOtp);
    res.json({ message: "New OTP sent successfully" });
  } catch (err) {
    console.error("Error resending OTP:", err);
    res.status(500).json({ error: "Error sending OTP" });
  }
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
    monthly_dorm_fee,
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
    self_introduction,
    monthly_dorm_fee
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
    line_id, phone, dorm_name, vehicle, self_introduction, monthly_dorm_fee
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          monthly_dorm_fee || null,
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

  const getTraitsQuery = `
    SELECT pt.*, pi.*, u.profile_picture
    FROM personality_traits pt
    JOIN personality_infomation pi ON pt.user_id = pi.user_id
    JOIN users u ON pt.user_id = u.id
    WHERE u.role = 'user' AND u.is_suspended = 0
  `;

  db.query(getTraitsQuery, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const currentUser = results.find((user) => user.user_id === user_id);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // One-hot encoding function
    const encodeTrait = (trait, categories) => {
      const index = categories.indexOf(trait);
      if (index === -1) return new Array(categories.length).fill(0);
      return categories.map((_, i) => (i === index ? 1 : 0));
    };

    // Define categories and weightings for each trait
    const traitCategories = {
      type: ["type_introvert", "type_ambivert", "type_extrovert"],
      sleep: ["sleep_before_midnight", "sleep_after_midnight"],
      wake: ["wake_morning", "wake_noon", "wake_evening"],
      clean: [
        "clean_every_day",
        "clean_every_other_day",
        "clean_once_a_week",
        "clean_dont_really",
      ],
      air_conditioner: [
        "ac_never",
        "ac_only_sleep",
        "ac_only_hot",
        "ac_all_day",
      ],
      drink: ["drink_never", "drink_spacial", "drink_weekend", "drink_always"],
      smoke: ["smoke_never", "smoke_spacial", "smoke_always"],
      money: ["money_on_time", "money_late"],
      expense: ["money_half", "money_ratio"],
      pet: ["pet_dont_have", "pet_have"],
      cook: ["cook_ok", "cook_tell_first", "cook_no"],
      loud: ["loud_low", "loud_medium", "loud_high"],
      friend: ["friend_ok", "friend_tell_first", "friend_no"],
      religion: ["religion_ok", "religion_no_affect", "religion_no"],
      period: ["period_long", "period_sometime", "period_no_need"],
    };

    const weights = {
      smoke: 2.0,
      drink: 1.8,
      sleep: 1.5,
      money: 1.5,
      expense: 1.5,
      pet: 1.2,
      religion: 1.2,
      loud: 1.2,
      friend: 1.1,
      cook: 1.0,
      clean: 0.8,
    };

    // Encode user traits and apply weights
    const encodeUserTraits = (user) => {
      return Object.keys(traitCategories).flatMap((trait) => {
        const encoded = encodeTrait(user[trait], traitCategories[trait]);
        return encoded.map((value) => value * (weights[trait] || 1)); // Apply weight
      });
    };

    const currentUserTraits = encodeUserTraits(currentUser);

    // Weighted Cosine similarity function
    const cosineSimilarity = (vectorA, vectorB) => {
      let dotProduct = 0,
        magnitudeA = 0,
        magnitudeB = 0;

      vectorA.forEach((a, i) => {
        dotProduct += a * vectorB[i];
        magnitudeA += a * a;
        magnitudeB += vectorB[i] * vectorB[i];
      });

      const similarity =
        magnitudeA && magnitudeB
          ? (dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))) * 100
          : 0;
      return parseFloat(similarity.toFixed(2));
    };

    // Compute similarity with all other users
    const neighbors = results
      .filter((user) => user.user_id !== user_id)
      .map((user) => ({
        user_id: user.user_id,
        similarity: cosineSimilarity(encodeUserTraits(user), currentUserTraits),
        traits: user,
      }))
      .sort((a, b) => b.similarity - a.similarity); // Sort by highest similarity

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
        phone = ?, dorm_name = ?, vehicle = ?, self_introduction = ?, monthly_dorm_fee = ?
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
      monthly_dorm_fee || null,
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

app.get("/statistics", async (req, res) => {
  try {
    // Get total users (excluding admins)
    const usersCount = await new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) as count FROM users WHERE role = 'user'",
        (err, result) => {
          if (err) reject(err);
          resolve(result[0].count);
        }
      );
    });

    // Get total successful matches
    const matchesCount = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) as count FROM matches", (err, result) => {
        if (err) reject(err);
        resolve(result[0].count);
      });
    });

    // Get total unique universities
    const universitiesCount = await new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(DISTINCT university) as count FROM personality_infomation WHERE university IS NOT NULL AND university != ''",
        (err, result) => {
          if (err) reject(err);
          resolve(result[0].count);
        }
      );
    });

    res.json({
      totalUsers: usersCount,
      totalMatches: matchesCount,
      totalUniversities: universitiesCount,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
});
