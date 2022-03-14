const express = require("express");
const router = express.Router();
const Joi = require("Joi");

const restaurants = [
  //   {
  //     id: 1,
  //     name: "Les trois Mousquetaires",
  //     address: "22 av des Champs-Élysées",
  //     city: "Paris",
  //     country: "France",
  //     stars: 4,
  //     cuisine: "french",
  //     priceCategory: 3,
  //   },
];

// Joi Schema
const restaurantSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  address: Joi.string().required(),
  city: Joi.string().alphanum(),
  country: Joi.string().alphanum().required(),
  stars: Joi.number().min(1).max(5).required(),
  cuisine: Joi.string().alphanum().required(),
  priceCategory: Joi.number().min(1).max(3).required(),
});

// MIDDLEWARES

// Check Schema
const validRes = (req, res, next) => {
  const validRes = restaurantSchema.validate(req.body);

  if (validRes.error) {
    return res.status(400).json({
      message: "Error 400",
      description: validRes.error.details[0].message,
    });
  }

  next();
};

// Find restaurant by ID
const findRestaurant = (req, res, next) => {
  const restaurant = restaurants.find((resto) => {
    return resto.id.toString().toLowerCase() === req.params.id.toLowerCase();
  });
  req.restaurant = restaurant;

  if (!restaurant) {
    res.status(404).json({
      message: "Error 404",
      description: "This restaurant cannot be found in the database.",
    });
  }

  next();
};

// Get list of restaurants
router.get("/", (_req, res) => {
  if (restaurants.length > 0) {
    res.json(restaurants);
  } else {
    res.send("The list of restaurants is empty.");
  }
});

// Get restaurant by ID
router.get("/:id", findRestaurant, (req, res) => {
  res.json(req.restaurant);
});

// Add a restaurant to the list of restaurants
router.post("/", validRes, (req, res) => {
  console.log("Request received");

  restaurants.push({ id: restaurants.length + 1, ...req.body });

  res.status(201).json({
    message: "Restaurant added",
    hotel: { id: restaurants.length, name: req.body.name },
  });
});

// Modify restaurant name
router.patch("/:id", findRestaurant, (req, res) => {
  res.json({
    message: "Updated restaurant name",
    "old name": req.restaurant.name,
    "new name": req.body.name,
  });
  req.restaurant.name = req.body.name;
  console.log(
    `Modified name of restaurant ${req.params.id} to ${req.body.name}`
  );
});

// TODO: Ajouter la possibilité d’effacer un restaurant (DELETE /restaurants/:id)

module.exports = router;
