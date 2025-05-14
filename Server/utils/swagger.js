import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instagram Clone API",
      version: "1.0.0",
      description: "API documentation for the Instagram Clone project",
    },
    servers: [
      {
        url: "http://localhost:8800/api/v1",
        description: "Development server",
      },
    ],
  },
 apis: ["./controllers/*.js", "./routes/*.js"], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger UI route
   app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: "/swagger-dark.css", // Link to the custom CSS file
  })
);

  // JSON documentation route
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;