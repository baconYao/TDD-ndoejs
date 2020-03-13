'use strict';

const express = require("express");
const app = express();

const todoRoutes = require("./routes/todo.routes");

app.use(express.json());

app.use("/todos", todoRoutes);

// app.listen('8080', () => {
//   console.log("Listening on port 8080");
// });

module.exports = app;