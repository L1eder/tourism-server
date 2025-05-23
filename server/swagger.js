const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Attractions API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // укажите путь к вашим роутам, где будут комментарии для Swagger
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
