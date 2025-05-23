const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const attractionRoutes = require("./routes/attractions");
const routeRoutes = require("./routes/routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Роуты
app.use("/auth", authRoutes);
app.use("/attractions", attractionRoutes);
app.use("/routes", routeRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
