const express = require("express");
const router = express.Router();
const Joi = require("Joi");

const hotels = [
  // {
  //   id: 1,
  //   name: "Imperial Hotel",
  //   address: "84 av des Champs-Élysées",
  //   city: "Paris",
  //   country: "France",
  //   stars: 5,
  //   hasSpa: true,
  //   hasPool: true,
  //   priceCategory: 3,
  // },
  // {
  //   id: 2,
  //   name: "The Queen",
  //   address: "3 Darwin Street",
  //   city: "London",
  //   country: "England",
  //   stars: 4,
  //   hasSpa: true,
  //   hasPool: false,
  //   priceCategory: 3,
  // },
  // {
  //   id: 3,
  //   name: "Kiwi land",
  //   address: "4587 George St.",
  //   city: "Auckland",
  //   country: "New-Zealand",
  //   stars: 3,
  //   hasSpa: false,
  //   hasPool: true,
  //   priceCategory: 2,
  // },
];

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

// MIDDLEWARES

// Check Schema
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

// Find hotel by ID
const findHotel = (req, res, next) => {
  const hotel = hotels.find((hotel) => {
    return hotel.id.toString().toLowerCase() === req.params.id.toLowerCase();
  });
  req.hotel = hotel;

  if (!hotel) {
    res.status(404).json({
      message: "Error 404",
      description: "This hotel cannot be found in the database.",
    });
  }

  next();
};

// Find highest ID in array
const maxID = (req, _res, next) => {
  const ids = hotels.map((hotel) => {
    return hotel.id;
  });

  const max = Math.max(...ids);
  req.max = max;

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
router.post("/", validRes, maxID, (req, res) => {
  console.log("Request received");

  hotels.push({ id: req.max + 1, ...req.body });

  res.status(201).json({
    message: "New hotel added",
    hotel: { id: req.max + 1, name: req.body.name },
  });
});

// Get hotel by ID
router.get("/:id", findHotel, (req, res) => {
  res.json(req.hotel);
});

// Modify name of hotel
router.patch("/:id", findHotel, (req, res) => {
  res.json({
    message: "Updated hotel name",
    "old name": req.hotel.name,
    "new name": req.body.name,
  });
  req.hotel.name = req.body.name;
  console.log(`Modified name of hotel ${req.params.id} to ${req.body.name}`);
});

// // Delete a hotel of the list
// router.delete("/:id", findHotel, (req, res) => {
//   hotels = hotels.filter((hotel) => {
//     return hotel !== req.hotel;
//   });

//   res.json({
//     message: "Hotel deleted",
//     id: req.hotel.name,
//     "hotel name": req.hotel.name,
//     "updated list": hotels,
//   });
//   console.log(`${req.hotel.name} has been deleted from database`);
// });

// // Delete a hotel of the list
// router.delete("/:id", findHotel, (req, res) => {
//   const index = hotels.indexOf(req.hotel);

//   delete hotels[index];

//   res.json({
//     message: "Hotel deleted",
//     id: req.hotel.name,
//     "hotel name": req.hotel.name,
//     "updated list": hotels,
//   });
//   console.log(`${req.hotel.name} has been deleted from database`);
// });

// Delete a hotel of the list
router.delete("/:id", findHotel, (req, res) => {
  const index = hotels.indexOf(req.hotel);

  hotels.splice(index, 1);

  res.json({
    message: "Hotel deleted",
    id: req.hotel.id,
    "hotel name": req.hotel.name,
    "updated list": hotels,
  });
  console.log(`${req.hotel.name} has been deleted from database`);
});

module.exports = router;
