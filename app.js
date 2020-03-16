'use strict';

const express = require("express");
const app = express();

const mongodb = require("./mongodb/mongodb.connect");
const todoRoutes = require("./routes/todo.routes");

mongodb.connect();

app.use(express.json());

app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

module.exports = app;