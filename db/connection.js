const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

const config =
  ENV === "test"
    ? {
        database: "nc_news_test",
      }
    : {
        database: "nc_news",
      };

const db = new Pool(config);

module.exports = db;
