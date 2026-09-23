const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API Livraria",
    description:
      "Documentação automática da API Livraria utilizando Swagger Autogen",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Documentação do Swagger gerada com sucesso!");
});
