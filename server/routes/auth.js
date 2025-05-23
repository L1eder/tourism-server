const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(400).send("Ошибка регистрации");
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
      "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch {
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
