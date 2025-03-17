require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("Пул подключений к базе данных успешно создан");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/register", async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [userEmail]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [userName, userEmail, hashedPassword]
    );

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Ошибка при регистрации пользователя:", err);
    res.status(500).json({ error: "Ошибка при регистрации пользователя" });
  }
});

app.post("/login", async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [userEmail]
    );

    if (existingUser.length === 0) {
      return res.status(400).json({ error: "Пользователь не зарегистрирован" });
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword,
      existingUser[0].password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Неверный пароль" });
    }

    const token = jwt.sign(
      {
        userId: existingUser[0].id,
        userName: existingUser[0].username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Авторизация прошла успешно",
      token: token,
      userId: existingUser[0].id,
    });
  } catch (err) {
    console.error("Ошибка при авторизации пользователя: ", err);
    res
      .status(500)
      .json({ error: "Ошибка при авторизации пользователя: " + err.message });
  }
});

app.post("/profile/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Токен не предоставлен" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    if (!req.file) {
      return res.status(400).json({ error: "Файл не был загружен" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    await db.query("UPDATE users SET avatar = ? WHERE id = ?", [
      avatarUrl,
      userId,
    ]);

    res
      .status(200)
      .json({ message: "Аватар успешно загружен", avatarUrl: avatarUrl });
  } catch (err) {
    console.error("Ошибка при загрузке аватара: ", err);
    res
      .status(500)
      .json({ error: "Ошибка при загрузке аватара: " + err.message });
  }
});

app.get("/api/user/avatar/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [result] = await db.query("SELECT avatar FROM users WHERE id = ?", [
      userId,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const avatarUrl = result[0].avatar;
    res.status(200).json({ avatarUrl: avatarUrl });
  } catch (err) {
    console.error("Error fetching avatar:", err);
    res.status(500).json({ error: "Error fetching avatar: " + err.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
