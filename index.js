const express = require("express");
const app = express();
const PORT = 8000;
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
// routers
const hotelsRouter = require("./routers/hotels");
const restaurantsRouter = require("./routers/restaurants");

// Middlewares
app.use(express.json());
app.use("/hotels", hotelsRouter);
app.use("/restaurants", restaurantsRouter);

// Error
app.get("*", (_req, res) => {
  res.status(404).send("Error 404 - Not found");
});

app.listen(PORT, () => {
  console.log("Listening on PORT", PORT);
});
