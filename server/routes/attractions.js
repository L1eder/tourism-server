const express = require("express");
const pool = require("../db");
const authenticateJWT = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const { district, category, maxPrice } = req.query;
  let query = "SELECT * FROM attractions WHERE 1=1";
  const params = [];

  if (district) {
    params.push(district);
    query += ` AND district = $${params.length}`;
  }
  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (maxPrice) {
    params.push(maxPrice);
    query += ` AND price <= $${params.length}`;
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch {
    res.status(500).send("Ошибка при получении достопримечательностей");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM attractions WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Достопримечательность не найдена");
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).send("Ошибка при получении достопримечательности");
  }
});

module.exports = router;
