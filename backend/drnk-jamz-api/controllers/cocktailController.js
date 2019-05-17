/* eslint-disable no-await-in-loop */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
// const User = require('../models/users');
const Cocktail = require('../models/cocktail');

// // add require login middleware
// const requireLogin = require('../middleware/requireLogin');

// Utility function from Stack Overflow to see if an object is empty
const isEmpty = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) { return false; }
  }
  return true;
};

// INDEX ROUTE for debugging/admin purposes
router.get('/', async (req, res) => {
  try {
    const cocktails = await Cocktail.find().sort();
    res.json({
      data: cocktails,
      status: 200,
    });
  } catch (err) {
    res.json({
      status: 500,
      data: err,
    });
  }
});

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

// CREATE ROUTE
router.post('/', async (req, res) => {
  try {
    console.log(req.body);

    // handle genres for new cocktail
    const temp = req.body.genres;
    req.body.genres = [];
    req.body.genres.push(temp);

    const newCocktail = await Cocktail.create(req.body);
    res.json({
      status: 200,
      data: newCocktail,
    });
  } catch (err) {
    res.json({
      status: 500,
      data: err,
    });
  }
});

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

// UPDATE ROUTE
router.put('/', async (req, res) => {
  try {
    // handle genres for new cocktail
    const temp = req.body.genres;
    req.body.genres = [];
    req.body.genres.push(temp);

    console.log(req.body);

    const updatedCocktail = await Cocktail.findByIdAndUpdate(req.body._id, req.body, { new: true });
    await updatedCocktail.save();
    res.json({
      status: 200,
      data: updatedCocktail,
    });
  } catch (err) {
    res.json({
      status: 500,
      data: err,
    });
  }
});

// DELETE ROUTE
router.delete('/:id', async (req, res) => {
  try {
    const deletedCocktail = await Cocktail.findByIdAndDelete(req.params.id);
    console.log(deletedCocktail);

    res.json({
      status: 200,
      data: deletedCocktail,
    });
  } catch (err) {
    res.json({
      status: 500,
      data: err,
    });
  }
});

// SEARCH route
router.post('/search', async (req, res) => {
  try {
    let currMatchingCocktails = [];
    let allMatchingCocktails = [];

    const artistGenres = req.body.genres;

    for (let i = 0; i < artistGenres.length; i++) {
      // const genreLowerCase = genre.toLocaleLowerCase();
      const genreLowerCase = artistGenres[i].toLocaleLowerCase();
      // search for exact genre matching cocktails first
      currMatchingCocktails = await Cocktail.find({ genres: genreLowerCase });
      // if empty search for wildcard exact genres
      if (isEmpty(currMatchingCocktails)) {
        currMatchingCocktails = await Cocktail.find({ genres: { $regex: genreLowerCase } });
      }

      // search for sub-genre matching cocktails split on space and dash
      if (isEmpty(currMatchingCocktails)) {
        const subGenres = genreLowerCase.split(/-| /);
        for (let x = 0; x < subGenres.length; x++) {
          if (subGenres[x] !== 'and') {
            currMatchingCocktails = [...currMatchingCocktails, ...await Cocktail.find({ genres: { $regex: subGenres[x] } })];
          }
        }
      }
      allMatchingCocktails = [...allMatchingCocktails, ...currMatchingCocktails];
    }

    let matchingCocktail;
    let randomCocktailIndex;
    // just return any matching cocktail if none found by genre
    if (isEmpty(allMatchingCocktails)) {
      // random mongoDB item from collection found on stack overflow
      const count = await Cocktail.count({});
      randomCocktailIndex = Math.floor(Math.random() * count);
      matchingCocktail = await Cocktail.findOne().skip(randomCocktailIndex).exec();
      console.log('No matching cocktails so returning a random one!');
    } else { // return one of the cocktails that is matching the genres
      randomCocktailIndex = Math.floor(Math.random() * allMatchingCocktails.length);
      matchingCocktail = allMatchingCocktails[randomCocktailIndex];
      console.log(`Returning a random matching cocktail: ${matchingCocktail}`);
    }

    res.json({
      data: matchingCocktail,
      status: 200,
    });
  } catch (err) {
    res.json({
      status: 500,
      data: err,
    });
  }
});

module.exports = router;
