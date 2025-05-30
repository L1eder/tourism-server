const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tourism API",
      version: "1.0.0",
      description: "API для управления туризмом",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./routes/*.js"], // Относительный путь от swaggerConfig.js к папке routes
};

const specs = swaggerJsDoc(options);
module.exports = specs;
