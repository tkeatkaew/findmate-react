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

// MySQL Connection Pool instead of single connection
const pool = mysql.createPool({
  host: "mysql.railway.internal",
  user: "root",
  password: "hAGSisGocpxGJpFQzPDLxdyZxOlaJGsG",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your application needs
  queueLimit: 0,
});

// Convert callbacks to promises for easier async/await usage
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
  connection.release(); // Release connection when done with test
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://findmate-react.vercel.app", // Added https://
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
    from: '"Find Mate" <findmate.official@gmail.com>',
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
    const [emailCheckResult] = await promisePool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

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

// Verify OTP endpoint
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
      const [result] = await promisePool.query(
        "INSERT INTO users (name, email, password, role, email_verified) VALUES (?, ?, ?, ?, true)",
        [userData.name, userData.email, userData.hashedPassword, userData.role]
      );

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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await promisePool.query(
      "SELECT id, name, email, password, role, profile_picture, is_suspended, suspension_reason FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add Personal Information Route
app.post("/personalinfo", async (req, res) => {
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

  try {
    // First check if user exists in the users table
    const [userResult] = await promisePool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (userResult.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if user already has personal info in the personality_infomation table
    const [existingInfo] = await promisePool.query(
      "SELECT id FROM personality_infomation WHERE user_id = ?",
      [user_id]
    );

    if (existingInfo.length > 0) {
      // User already has info, so UPDATE
      const updateQuery = `
        UPDATE personality_infomation 
        SET firstname = ?, lastname = ?, nickname = ?, age = ?, 
            maritalstatus = ?, gender = ?, lgbt = ?, province = ?, 
            university = ?, facebook = ?, instagram = ?, line_id = ?, 
            phone = ?, dorm_name = ?, vehicle = ?, self_introduction = ?, monthly_dorm_fee = ?
        WHERE user_id = ?
      `;

      await promisePool.query(updateQuery, [
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
        user_id,
      ]);

      return res
        .status(200)
        .json({ message: "User information updated successfully!" });
    } else {
      // No existing info, so INSERT
      const insertQuery = `
        INSERT INTO personality_infomation (
          user_id, firstname, lastname, nickname, age, maritalstatus, 
          gender, lgbt, province, university, facebook, instagram, 
          line_id, phone, dorm_name, vehicle, self_introduction, monthly_dorm_fee
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await promisePool.query(insertQuery, [
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
      ]);

      return res
        .status(201)
        .json({ message: "User information created successfully!" });
    }
  } catch (err) {
    console.error("Error in personal info:", err);
    return res.status(500).json({ error: "Error processing user information" });
  }
});

// Add Personal personalitytraits Route
app.post("/personalitytraits", async (req, res) => {
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

  try {
    // Check if user already has personality traits
    const [existingTraits] = await promisePool.query(
      "SELECT id FROM personality_traits WHERE user_id = ?",
      [user_id]
    );

    if (existingTraits.length > 0) {
      // User already has traits, so UPDATE
      const updateQuery = `
        UPDATE personality_traits 
        SET type = ?, sleep = ?, wake = ?, clean = ?, 
            air_conditioner = ?, drink = ?, smoke = ?, 
            money = ?, expense = ?, pet = ?, cook = ?, 
            loud = ?, friend = ?, religion = ?, period = ?
        WHERE user_id = ?
      `;

      await promisePool.query(updateQuery, [
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
        user_id,
      ]);

      res
        .status(200)
        .json({ message: "Personality traits updated successfully!" });
    } else {
      // No existing traits, so INSERT
      const insertQuery = `
        INSERT INTO personality_traits (
          user_id, type, sleep, wake, clean, air_conditioner, drink, 
          smoke, money, expense, pet, cook, loud, friend, religion, period
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await promisePool.query(insertQuery, [
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
      ]);

      res
        .status(201)
        .json({ message: "Personality traits created successfully!" });
    }
  } catch (err) {
    console.error("Error saving personality traits:", err);
    res.status(500).json({ error: "Error processing personality traits" });
  }
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

// KNN Route
app.post("/knn", async (req, res) => {
  const { user_id } = req.body;

  try {
    const [results] = await promisePool.query(`
      SELECT pt.*, pi.*, u.profile_picture
      FROM personality_traits pt
      JOIN personality_infomation pi ON pt.user_id = pi.user_id
      JOIN users u ON pt.user_id = u.id
      WHERE u.role = 'user' AND u.is_suspended = 0
    `);

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
  } catch (err) {
    console.error("Error in KNN algorithm:", err);
    res.status(500).json({ error: "Database error" });
  }
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

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Like/Unlike Route
app.post("/like", async (req, res) => {
  const { user_id, liked_user_id, action } = req.body;

  try {
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();

      if (action === "unlike") {
        // Remove like
        await connection.query(
          "DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?",
          [user_id, liked_user_id]
        );

        // Remove match if exists
        await connection.query(
          `DELETE FROM matches 
          WHERE (user1_id = ? AND user2_id = ?) 
          OR (user1_id = ? AND user2_id = ?)`,
          [user_id, liked_user_id, liked_user_id, user_id]
        );

        await connection.commit();
        return res
          .status(200)
          .json({ message: "Like and match removed successfully!" });
      } else {
        // Add like
        await connection.query(
          "INSERT INTO likes (user_id, liked_user_id) VALUES (?, ?)",
          [user_id, liked_user_id]
        );

        // Check for mutual like
        const [mutualLike] = await connection.query(
          "SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?",
          [liked_user_id, user_id]
        );

        if (mutualLike.length > 0) {
          // Create match
          await connection.query(
            "INSERT INTO matches (user1_id, user2_id) VALUES (?, ?)",
            [user_id, liked_user_id]
          );

          // Get both users' email addresses
          const [users] = await connection.query(
            "SELECT id, email, name FROM users WHERE id IN (?, ?)",
            [user_id, liked_user_id]
          );

          await connection.commit();

          // Send match notification emails to both users
          for (const user of users) {
            const otherUser = users.find((u) => u.id !== user.id);
            const mailOptions = {
              from: '"Find Mate" <findmate.official@gmail.com>',
              to: user.email,
              subject: "You have a new match!",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                  <h2 style="color: #27272a; text-align: center;">Congratulations! You have a new match on Find Mate!</h2>
                  <p style="font-size: 16px; line-height: 1.5; color: #333;">คุณจับคู่กับ ${otherUser.name} สำเร็จแล้ว! 🎉</p>
                  <p style="font-size: 16px; line-height: 1.5; color: #333;">คุณสามารถดูข้อมูลการติดต่อของรูมเมทได้แล้วในแอปพลิเคชัน</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://findmate-react.vercel.app/matched" 
                       style="background-color: #27272a; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: bold;
                              display: inline-block;">
                      ดูข้อมูลการจับคู่
                    </a>
                  </div>
                  <p style="font-size: 16px; line-height: 1.5; color: #333;">หวังว่าคุณจะได้รูมเมทที่ถูกใจ</p>
                  <p style="font-size: 16px; line-height: 1.5; color: #333;">ขอบคุณที่ใช้บริการ Find Mate</p>
                  <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                    <p>หากคุณไม่สามารถคลิกปุ่มด้านบน กรุณาคัดลอกลิงก์นี้ไปยังเบราว์เซอร์ของคุณ:</p>
                    <p>https://findmate-react.vercel.app/matched</p>
                  </div>
                </div>
              `,
            };

            try {
              await transporter.sendMail(mailOptions);
            } catch (err) {
              console.error("Error sending match notification email:", err);
              // Continue even if email fails
            }
          }

          return res
            .status(200)
            .json({ message: "Match created successfully!" });
        }

        await connection.commit();
        return res.status(200).json({ message: "Like added successfully!" });
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Database error: " + err.message });
  }
});

// Get Liked Users Route
app.get("/liked", async (req, res) => {
  const { user_id } = req.query;

  try {
    const [results] = await promisePool.query(
      `SELECT u.id, u.name, u.profile_picture, pi.*, pt.*
      FROM likes l
      JOIN users u ON l.liked_user_id = u.id
      LEFT JOIN personality_infomation pi ON u.id = pi.user_id
      LEFT JOIN personality_traits pt ON u.id = pt.user_id
      WHERE l.user_id = ?`,
      [user_id]
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("Error getting liked users:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Matches Route
app.get("/matches", async (req, res) => {
  const { user_id } = req.query;

  try {
    const [results] = await promisePool.query(
      `SELECT u.id, u.name, u.profile_picture, pi.*, pt.*
      FROM matches m
      JOIN users u ON (m.user1_id = u.id OR m.user2_id = u.id)
      LEFT JOIN personality_infomation pi ON u.id = pi.user_id
      LEFT JOIN personality_traits pt ON u.id = pt.user_id
      WHERE (m.user1_id = ? OR m.user2_id = ?) AND u.id != ?`,
      [user_id, user_id, user_id]
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("Error getting matches:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Check Like Status Route
app.get("/check-like", async (req, res) => {
  const { user_id, target_user_id } = req.query;

  try {
    const [result] = await promisePool.query(
      "SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?",
      [user_id, target_user_id]
    );

    res.status(200).json({ isLiked: result.length > 0 });
  } catch (err) {
    console.error("Error checking like status:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get user's personal information
app.get("/personalinfo/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [result] = await promisePool.query(
      "SELECT * FROM personality_infomation WHERE user_id = ?",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "User information not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get user's personality traits
app.get("/personalitytraits/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [result] = await promisePool.query(
      "SELECT * FROM personality_traits WHERE user_id = ?",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Personality traits not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update user's personal information
app.put("/personalinfo/:userId", async (req, res) => {
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
    monthly_dorm_fee,
  } = req.body;

  try {
    await promisePool.query(
      `UPDATE personality_infomation 
      SET firstname = ?, lastname = ?, nickname = ?, age = ?, 
          maritalstatus = ?, gender = ?, lgbt = ?, province = ?, 
          university = ?, facebook = ?, instagram = ?, line_id = ?, 
          phone = ?, dorm_name = ?, vehicle = ?, self_introduction = ?, monthly_dorm_fee = ?
      WHERE user_id = ?`,
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
      ]
    );

    res
      .status(200)
      .json({ message: "Personal information updated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Error updating personal information" });
  }
});

// Update user's personality traits
app.put("/personalitytraits/:userId", async (req, res) => {
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

  try {
    const [result] = await promisePool.query(
      `UPDATE personality_traits 
      SET type = ?, sleep = ?, wake = ?, clean = ?, 
          air_conditioner = ?, drink = ?, smoke = ?, 
          money = ?, expense = ?, pet = ?, cook = ?, 
          loud = ?, friend = ?, religion = ?, period = ?
      WHERE user_id = ?`,
      [
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
      ]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      // If no existing record, insert a new one
      await promisePool.query(
        `INSERT INTO personality_traits 
        (user_id, type, sleep, wake, clean, air_conditioner, drink, 
         smoke, money, expense, pet, cook, loud, friend, religion, period)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
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
        ]
      );

      res
        .status(201)
        .json({ message: "Personality traits created successfully" });
    } else {
      res
        .status(200)
        .json({ message: "Personality traits updated successfully" });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Error updating personality traits" });
  }
});

// Update user profile
app.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { name, email } = req.body;

  try {
    await promisePool.query(
      `UPDATE users 
      SET name = ?, email = ?
      WHERE id = ?`,
      [name, email, userId]
    );

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
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Error updating user profile" });
  }
});

// Verify password endpoint
app.post("/verify-password", async (req, res) => {
  const { user_id, password } = req.body;

  try {
    // Get user's stored password hash
    const [result] = await promisePool.query(
      "SELECT password FROM users WHERE id = ?",
      [user_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare provided password with stored hash
    const isValid = bcrypt.compareSync(password, result[0].password);
    res.json({ verified: isValid });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete account endpoint
app.delete("/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete from personality_traits
      await connection.query(
        "DELETE FROM personality_traits WHERE user_id = ?",
        [userId]
      );

      // Delete from personality_infomation
      await connection.query(
        "DELETE FROM personality_infomation WHERE user_id = ?",
        [userId]
      );

      // Delete from likes
      await connection.query(
        "DELETE FROM likes WHERE user_id = ? OR liked_user_id = ?",
        [userId, userId]
      );

      // Delete from matches
      await connection.query(
        "DELETE FROM matches WHERE user1_id = ? OR user2_id = ?",
        [userId, userId]
      );

      // Finally, delete the user
      await connection.query("DELETE FROM users WHERE id = ?", [userId]);

      await connection.commit();

      // Clear user session if it exists
      if (req.session.user && req.session.user.id === parseInt(userId)) {
        req.session.destroy();
      }

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
});

// Change password endpoint
app.put("/users/:userId/password", async (req, res) => {
  const userId = req.params.userId;
  const { newPassword } = req.body;

  try {
    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the password in the database
    const [result] = await promisePool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Error updating password" });
  }
});

// Admin Stats Route
app.get("/admin/stats", async (req, res) => {
  try {
    const [usersResult] = await promisePool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );

    const [matchesResult] = await promisePool.query(
      "SELECT COUNT(*) as count FROM matches"
    );

    const [reportsResult] = await promisePool.query(
      "SELECT COUNT(*) as count FROM reports"
    );

    res.json({
      totalUsers: usersResult[0].count,
      totalMatches: matchesResult[0].count,
      totalReports: reportsResult[0].count,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Reports Routes
app.post("/reports/user", async (req, res) => {
  const { reporter_id, reported_user_id, type, description } = req.body;

  try {
    await promisePool.query(
      `INSERT INTO reports (reporter_id, reported_user_id, type, description, report_type, status)
      VALUES (?, ?, ?, ?, 'user', 'pending')`,
      [reporter_id, reported_user_id, type, description]
    );

    res.status(201).json({ message: "Report created successfully" });
  } catch (err) {
    console.error("Error creating user report:", err);
    res.status(500).json({ error: "Error creating report" });
  }
});

app.get("/admin/user-reports", async (req, res) => {
  try {
    const [results] = await promisePool.query(
      `SELECT r.*, 
             u1.name as reporter_name,
             u2.name as reported_user_name
      FROM reports r
      JOIN users u1 ON r.reporter_id = u1.id
      JOIN users u2 ON r.reported_user_id = u2.id
      WHERE r.report_type = 'user'
      ORDER BY r.created_at DESC`
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching user reports:", err);
    res.status(500).json({ error: "Error fetching reports" });
  }
});

// System Reports Routes
app.post("/reports/system", upload.single("image"), async (req, res) => {
  const { user_id, type, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await promisePool.query(
      `INSERT INTO reports (reporter_id, type, description, image, report_type, status)
      VALUES (?, ?, ?, ?, 'system', 'pending')`,
      [user_id, type, description, image]
    );

    res.status(201).json({ message: "Report created successfully" });
  } catch (err) {
    console.error("Error creating system report:", err);
    res.status(500).json({ error: "Error creating report" });
  }
});

app.get("/admin/system-reports", async (req, res) => {
  try {
    const [results] = await promisePool.query(
      `SELECT r.*, u.name as reporter_name
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      WHERE r.report_type = 'system'
      ORDER BY r.created_at DESC`
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching system reports:", err);
    res.status(500).json({ error: "Error fetching reports" });
  }
});

// Suggestions Routes
app.post("/suggestions", async (req, res) => {
  const { user_id, content } = req.body;

  try {
    await promisePool.query(
      `INSERT INTO suggestions (user_id, content, status)
      VALUES (?, ?, 'pending')`,
      [user_id, content]
    );

    res.status(201).json({ message: "Suggestion created successfully" });
  } catch (err) {
    console.error("Error creating suggestion:", err);
    res.status(500).json({ error: "Error creating suggestion" });
  }
});

app.get("/admin/suggestions", async (req, res) => {
  try {
    const [results] = await promisePool.query(
      `SELECT s.*, u.name as user_name
      FROM suggestions s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC`
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ error: "Error fetching suggestions" });
  }
});

// Update Report Status
app.post("/admin/reports/:id/action", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    await promisePool.query("UPDATE reports SET status = ? WHERE id = ?", [
      action,
      id,
    ]);

    res.json({ message: "Report updated successfully" });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add user action route (suspend/unsuspend)
app.post("/admin/user-action/:userId", async (req, res) => {
  const { userId } = req.params;
  const { action, reason, report_id } = req.body;

  try {
    if (action === "suspend") {
      // Update user's suspension status
      await promisePool.query(
        "UPDATE users SET is_suspended = 1, suspension_reason = ? WHERE id = ?",
        [reason, userId]
      );

      // If this action is from a report, update report status
      if (report_id) {
        await promisePool.query(
          "UPDATE reports SET status = 'resolved' WHERE id = ?",
          [report_id]
        );
      }
    } else if (action === "unsuspend") {
      await promisePool.query(
        "UPDATE users SET is_suspended = 0, suspension_reason = NULL WHERE id = ?",
        [userId]
      );
    }

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
    await promisePool.query("DELETE FROM reports WHERE id = ?", [reportId]);

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/statistics", async (req, res) => {
  try {
    // Get total users (excluding admins)
    const [usersCount] = await promisePool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );

    // Get total successful matches
    const [matchesCount] = await promisePool.query(
      "SELECT COUNT(*) as count FROM matches"
    );

    // Get total unique universities
    const [universitiesCount] = await promisePool.query(
      "SELECT COUNT(DISTINCT university) as count FROM personality_infomation WHERE university IS NOT NULL AND university != ''"
    );

    res.json({
      totalUsers: usersCount[0].count,
      totalMatches: matchesCount[0].count,
      totalUniversities: universitiesCount[0].count,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
});

app.post("/update-profile-picture", async (req, res) => {
  const { user_id, profile_picture } = req.body;

  if (!profile_picture || !user_id) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    await promisePool.query(
      "UPDATE users SET profile_picture = ? WHERE id = ?",
      [profile_picture, user_id]
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePictureUrl: profile_picture,
    });
  } catch (error) {
    console.error("Error in profile picture update:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const [results] = await promisePool.query(
      `SELECT u.*, GROUP_CONCAT(pi.university) as universities
      FROM users u 
      LEFT JOIN personality_infomation pi ON u.id = pi.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY u.id DESC`
    );

    res.json(results);
  } catch (error) {
    console.error("Error in /admin/users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/admin/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [result] = await promisePool.query(
      "SELECT id, name, email, profile_picture, is_suspended, suspension_reason FROM users WHERE id = ?",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error in /admin/users/:userId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/admin/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await promisePool.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

app.post("/app-reviews", async (req, res) => {
  const { user_id, rating, feedback } = req.body;

  try {
    // Insert the review
    await promisePool.query(
      `INSERT INTO app_reviews (user_id, rating, feedback)
       VALUES (?, ?, ?)`,
      [user_id || null, rating, feedback || null]
    );

    // If there's valid feedback, send an email notification to the team
    if (feedback && feedback.trim().length > 0) {
      // Get user information if a user_id was provided
      let userName = "Anonymous";
      let userEmail = "anonymous@user.com";

      if (user_id) {
        const [userResults] = await promisePool.query(
          "SELECT name, email FROM users WHERE id = ?",
          [user_id]
        );

        if (userResults.length > 0) {
          userName = userResults[0].name;
          userEmail = userResults[0].email;
        }
      }

      // Send email to the team
      const mailOptions = {
        from: '"Find Mate System" <findmate.official@gmail.com>',
        to: "findmate.official@gmail.com", // Your team's email
        subject: `New App Review: ${rating} Stars`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <h2 style="color: #27272a; text-align: center;">คุณได้รับความคิดเห็นใหม่สำหรับแอป</h2>
            <p style="font-size: 16px; line-height: 1.5; color: #333;"><strong>คะแนน:</strong> ${rating} / 5</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;"><strong>จาก:</strong> ${userName} (${userEmail})</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;"><strong>ความคิดเห็น:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${feedback.replace(/\n/g, "<br>")}
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">ส่งเมื่อ: ${new Date().toLocaleString(
              "th-TH"
            )}</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);

        // Mark this review as having sent an email
        await promisePool.query(
          "UPDATE app_reviews SET email_sent = 1 WHERE user_id = ? AND created_at = (SELECT MAX(created_at) FROM app_reviews WHERE user_id = ?)",
          [user_id, user_id]
        );
      } catch (emailErr) {
        console.error("Error sending review notification email:", emailErr);
        // Continue even if email fails
      }
    }

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("Error storing app review:", err);
    res.status(500).json({ error: "Error storing review" });
  }
});

// This function will send emails to users who have been active for a while but haven't left a review
// const sendReviewRequests = async () => {
//   try {
//     // Get users who:
//     // 1. Have been active for at least 2 weeks
//     // 2. Have made a successful match
//     // 3. Haven't already submitted an app review
//     const [users] = await promisePool.query(
//       `SELECT u.id, u.name, u.email
//        FROM users u
//        JOIN matches m ON (u.id = m.user1_id OR u.id = m.user2_id)
//        WHERE u.id NOT IN (SELECT user_id FROM app_reviews WHERE user_id IS NOT NULL)
//        AND DATEDIFF(NOW(), u.created_at) >= 14
//        GROUP BY u.id`
//     );

//     for (const user of users) {
//       // Check if this user has been sent a review request in the last 30 days
//       // You'd need to add a "review_requests" table for this

//       // Send email asking for a review
//       const mailOptions = {
//         from: '"Find Mate" <findmate.official@gmail.com>',
//         to: user.email,
//         subject: "ช่วยให้คะแนนแอปพลิเคชัน Find Mate",
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
//             <h2 style="color: #27272a; text-align: center;">คุณคิดอย่างไรเกี่ยวกับแอปพลิเคชัน Find Mate?</h2>
//             <p style="font-size: 16px; line-height: 1.5; color: #333;">สวัสดี ${user.name}!</p>
//             <p style="font-size: 16px; line-height: 1.5; color: #333;">เราหวังว่าคุณจะชอบใช้งานแอปพลิเคชัน Find Mate ในการหาและจับคู่กับรูมเมทที่เหมาะสมกับคุณ</p>
//             <p style="font-size: 16px; line-height: 1.5; color: #333;">ความคิดเห็นของคุณสำคัญมากสำหรับเราในการปรับปรุงแอปพลิเคชันให้ดียิ่งขึ้น โปรดสละเวลาสักครู่เพื่อให้คะแนนและความคิดเห็น</p>

//             <div style="text-align: center; margin: 30px 0;">
//               <a href="https://findmate-react.vercel.app/matched"
//                  style="background-color: #27272a;
//                         color: white;
//                         padding: 12px 24px;
//                         text-decoration: none;
//                         border-radius: 8px;
//                         font-weight: bold;
//                         display: inline-block;">
//                 ให้คะแนน Find Mate
//               </a>
//             </div>

//             <p style="font-size: 16px; line-height: 1.5; color: #333;">ขอบคุณสำหรับการสนับสนุน!</p>
//             <p style="font-size: 16px; line-height: 1.5; color: #333;">ทีมงาน Find Mate</p>
//           </div>
//         `,
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Review request email sent to ${user.email}`);

//         // Record that we sent a review request
//         // await promisePool.query(
//         //   "INSERT INTO review_requests (user_id, sent_at) VALUES (?, NOW())",
//         //   [user.id]
//         // );
//       } catch (emailErr) {
//         console.error(
//           `Error sending review request email to ${user.email}:`,
//           emailErr
//         );
//       }
//     }
//   } catch (err) {
//     console.error("Error in sendReviewRequests:", err);
//   }
// };

// Schedule the function to run once a week (every Sunday at midnight)
// const cron = require("node-cron");
// cron.schedule("* * * * *", sendReviewRequests); //every 1 min
// cron.schedule("0 0 * * 0", sendReviewRequests);

// 4. Admin route to get all app reviews
app.get("/admin/app-reviews", async (req, res) => {
  try {
    const [reviews] = await promisePool.query(
      `SELECT ar.*, u.name, u.email 
       FROM app_reviews ar
       LEFT JOIN users u ON ar.user_id = u.id
       ORDER BY ar.created_at DESC`
    );

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching app reviews:", err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
