require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL;
const AWS_KEY = "lkgjg34589ut3480tu34jijtj3490-tyu349-ti349-9j034t6-igk";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (error) => {
  console.error(error);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}

startServer();
