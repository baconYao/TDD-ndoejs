'use strict';

const express = require("express");
const app = express();

const mongodb = require("./mongodb/mongodb.connect");
const todoRoutes = require("./routes/todo.routes");

mongodb.connect();

app.use(express.json());

app.use("/todos", todoRoutes);

module.exports = app;