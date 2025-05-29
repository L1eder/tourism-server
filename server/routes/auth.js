const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { jwtSecret } = require("../config"); // Импортируем секретный ключ

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Имя пользователя и пароль обязательны" });
  }

  try {
    const userExists = await pool.query(
      "SELECT 1 FROM users WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким именем уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).send("Неверные учетные данные");
    }
    const user = userResult.rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).send("Неверные учетные данные");
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret, // Используем секретный ключ из конфигурации
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch {
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
