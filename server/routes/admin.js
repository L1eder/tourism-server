const express = require("express");
const pool = require("../db");
const authenticateJWT = require("../middleware/authMiddleware");

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Доступ запрещен. Требуется роль администратора." });
  }
  next();
};

router.get("/routes", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT r.id, r.name, r.attraction_ids, u.username FROM routes r JOIN users u ON r.user_id = u.id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении маршрутов:", error);
    res.status(500).json({ message: "Ошибка при получении маршрутов" });
  }
});

module.exports = router;
