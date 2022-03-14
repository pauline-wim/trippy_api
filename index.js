const express = require("express");
const app = express();
const PORT = 8000;
// routers
const hotelsRouter = require("./routers/hotels");

// Middlewares
app.use(express.json());
app.use("/hotels", hotelsRouter);

// Error
app.get("*", (_req, res) => {
  res.status(404).send("Error 404 - Not found");
});

app.listen(PORT, () => {
  console.log("Listening on PORT", PORT);
});
