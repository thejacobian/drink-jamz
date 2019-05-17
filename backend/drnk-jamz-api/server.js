/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */

// require express packages
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const session = require('express-session');
const morgan = require('morgan');
// const MongoDBStore = require('connect-mongodb-session')(session);

// require cocktails model
const Cocktail = require('./models/cocktail');

// populate cocktails from DB import file
const cocktailsData = require('./populateCocktails');

// require dotenv for environment variables
require('dotenv').config();

// set up cors
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_ADDRESS,
  credentials: true,
  optionsSuccessStatus: 200,
}));

// require mongo db connection
require('./db/db');

// // Utility function from Stack Overflow to see if an object is empty
// const isEmpty = (obj) => {
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) { return false; }
//   }
//   return true;
// };

// // Add the cocktails test data if the collection is empty
// cocktailsData.forEach((cocktail) => {
//   Cocktail.create({
//     name: cocktail.name,
//     directions: cocktail.directions,
//     cId: cocktail.cId,
//     genres: [cocktail.genre],
//     img: '',
//   }, (err, createdCocktail) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(createdCocktail);
//     }
//   });
// });

// // define mongo db store
// const store = new MongoDBStore({
//   uri: process.env.REACT_APP_MONGODB_URI,
//   collection: 'mySessions'
// });

// // set up middleware
app.use(morgan('short'));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// // set up express-session
// app.use(session({
//   saveUninitialized: true,
//   secret: process.env.REACT_APP_SECRET,
//   resave: false,
//   store: store,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
//   },
// }));

// // debugging userId from session in console ***REMOVE FOR PROD***
// app.use((req, res, next)=>{
//   console.log(`Incoming request from UserId: ${req.session.userId}`)
//   next();
// });

// // require the controllers
// const userController = require('./controllers/userController');
const cocktailController = require('./controllers/cocktailController');
// const authController  = require('./controllers/authController');

// // visit home/index route when db is empty to populate cocktail db
// app.get('/', async (req, res) => {
//   try {
//     // Add the cocktails test data if the collection is empty
//     const anyCocktails = Cocktail.find({});

//     if (isEmpty(anyCocktails)) {
//       populateCocktailsFunc();
//     }
//   } catch (err) {
//     res.send(err);
//   }
// });

// use the controllers
app.use('/api/v1/cocktails', cocktailController);
// app.use('/auth', authController);

app.listen(process.env.REACT_APP_MONGODB_PORT, () => {
  console.log(`Listening on port: ${process.env.REACT_APP_MONGODB_PORT}`);
});
