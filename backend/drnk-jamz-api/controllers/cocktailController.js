/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
// const User = require('../models/users');
const Cocktail = require('../models/cocktail');

// // add require login middleware
// const requireLogin = require('../middleware/requireLogin');

// // helper function to randomize array from Stack Overflow
// /**
//  * Randomize array element order in-place.
//  * Using Durstenfeld shuffle algorithm.
//  */
// const shuffleArray = (array) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     const temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//   }
// };

// // INDEX ROUTE for debugging/admin purposes
// router.get('/', async (req, res) => {
//   try {
//     const allCocktails = await Cocktail.find({}).sort('name');
//     res.render('cocktails/index.ejs', {
//       cocktails: allCocktails,
//     });
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

// // NEW ROUTE
// router.get('/new', async (req, res) => {
//   try {
//     const today = new Date().toISOString().substr(0, 10);
//     res.render('cocktails/new.ejs', {
//       todaysDate: today,
//     });
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

// // SHOW ROUTE
// router.get('/:id', async (req, res) => {
//   try {
//     const thisCocktail = await Cocktail.findById(req.params.id);
//     if (thisCocktail) {
//       res.render('cocktails/show.ejs', {
//         cocktail: thisCocktail,
//       });
//     } else {
//       req.session.message = 'There is no cocktail data for this id';
//       console.log(req.session.message);
//       res.send(req.session.message);
//     }
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

// // CREATE ROUTE
// router.post('/', async (req, res) => {
//   try {
//     // create new cocktail
//     const newCocktail = await Cocktail.create(req.body);
//     await newCocktail.save();
//     console.log(newCocktail, 'after creation!!!');
//     res.redirect('/cocktails');
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

// // EDIT ROUTE
// router.get('/:id/edit', async (req, res) => {
//   try {
//     const myCocktail = await Cocktail.findById(req.params.id);
//     if (myCocktail) {
//       // get the cocktails upload date and convert for display on edit page.
//       const datePickerFormat = myCocktail.date.toISOString().substr(0, 10);
//       res.render('cocktails/edit.ejs', {
//         cocktail: myCocktail,
//         datePickerFormat,
//       });
//     } else {
//       req.session.message = 'There is no cocktail data for this id';
//       console.log(req.session.message);
//       res.send(req.session.message);
//     }
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

// // UPDATE ROUTE
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedCocktail = await Cocktail.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     await updatedCocktail.save();
//     res.redirect(`/cocktails/${req.params.id}`);
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

// // DELETE ROUTE
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedCocktail = await Cocktail.findByIdAndDelete(req.params.id);
//     console.log(deletedCocktail);
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

module.exports = router;
