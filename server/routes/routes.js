const express = require("express");
const pool = require("../db");
const authenticateJWT = require("../middleware/authMiddleware");

const router = express.Router();

// Получение маршрутов с достопримечательностями
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT r.id, r.name, r.attraction_ids
            FROM routes r
        `);
    console.log("Полученные маршруты:", result.rows); // Логируем результат
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении маршрутов:", error);
    res.status(500).send("Ошибка при получении маршрутов");
  }
});

// Создание маршрута
router.post("/", authenticateJWT, async (req, res) => {
  const { name, attraction_ids } = req.body;

  console.log("Полученные данные для создания маршрута:", req.body); // Логируем входящие данные

  if (!name || !Array.isArray(attraction_ids)) {
    return res
      .status(400)
      .send("Неверные данные: name и attraction_ids обязательны");
  }

  try {
    const routeResult = await pool.query(
      "INSERT INTO routes (name, attraction_ids) VALUES ($1, $2) RETURNING id",
      [name, attraction_ids]
    );
    const routeId = routeResult.rows[0].id;
    res.status(201).json({ message: "Маршрут создан", routeId });
  } catch (error) {
    console.error("Ошибка при создании маршрута:", error);
    res.status(400).send("Ошибка при создании маршрута");
  }
});

// Обновление маршрута
router.put("/:id", authenticateJWT, async (req, res) => {
  const routeId = req.params.id;
  const { name, attraction_ids } = req.body;

  if (!name || !Array.isArray(attraction_ids)) {
    return res
      .status(400)
      .send("Неверные данные: name и attraction_ids обязательны");
  }

  try {
    await pool.query(
      "UPDATE routes SET name = $1, attraction_ids = $2 WHERE id = $3",
      [name, attraction_ids, routeId]
    );
    res.json({ message: "Маршрут обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении маршрута:", error);
    res.status(400).send("Ошибка при обновлении маршрута");
  }
});

module.exports = router;
