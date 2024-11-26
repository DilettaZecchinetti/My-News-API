const express = require("express");
const app = express();

const { getEndpoints } = require("./db/controllers/api.controller.js");
const { getTopics } = require("./db/controllers/topics.controller.js");

const {
  getArticleById,
} = require("./db/controllers/articlesbyid.controller.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, msg = "Internal Server Error" } = err;

  res.status(status).send({ msg });
});

module.exports = app;
