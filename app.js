const express = require("express");
const app = express();

const { getEndpoints } = require("./db/controllers/api.controller.js");

app.get("/api", getEndpoints);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
