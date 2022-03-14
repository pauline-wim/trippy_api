const express = require("express");
const router = express.Router();
const Joi = require("Joi");

const hotels = [];

// Joi Schema
const hotel = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  address: Joi.string().required(),
  city: Joi.string().alphanum(),
  country: Joi.string().alphanum().required(),
  stars: Joi.number().min(1).max(5).required(),
  hasSpa: Joi.boolean()
    .truthy("yes", "Y")
    .falsy("no", "N")
    .sensitive()
    .required(),
  hasPool: Joi.boolean()
    .truthy("yes", "Y")
    .falsy("no", "N")
    .sensitive()
    .required(),
  priceCategory: Joi.number().min(1).max(3).required(),
});

// Middlewares
const validRes = (req, res, next) => {
  const newHotel = req.body;
  const validRes = hotel.validate(newHotel);

  if (validRes.error) {
    return res.status(400).json({
      message: "Error 400",
      description: validRes.error.details[0].message,
    });
  }

  next();
};

// Get list of hotels
router.get("/", (_req, res) => {
  if (hotels.length > 0) {
    res.json(hotels);
  } else {
    res.send("The list of hotels is empty.");
  }
});

// Add a hotel to the list of hotels
router.post("/", validRes, (req, res) => {
  console.log("Request received");

  hotels.push({ id: hotels.length + 1, ...req.body });

  res.status(201).json({
    message: "New hotel added",
    hotel: { id: hotels.length, name: req.body.name },
  });
});

module.exports = router;
