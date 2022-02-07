require("dotenv").config();

module.exports = {
  server: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.MONGO_URL,
  },
};
