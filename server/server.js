const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig"); // Подключаем конфигурацию Swagger

const authRoutes = require("./routes/auth");
const attractionRoutes = require("./routes/attractions");
const routeRoutes = require("./routes/routes");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/auth", authRoutes);
app.use("/attractions", attractionRoutes);
app.use("/routes", routeRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
