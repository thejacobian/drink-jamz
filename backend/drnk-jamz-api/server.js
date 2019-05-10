// require express packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const morgan = require('morgan');
const MongoDBStore = require('connect-mongodb-session')(session);

// require mongo db connection
require('./db/db');

// define mongo db store
const store = new MongoDBStore({
  uri: process.env.REACT_APP_LOCAL_MONGODB_URI,
  collection: 'mySessions'
});

// set up middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('short'));

// set up cors
app.use(cors({
  origin: process.env.REACT_APP_LOCAL_FRONTEND_ADDRESS,
  credentials: true,
  optionsSuccessStatus: 200
}))

// set up express-session
app.use(session({
  saveUninitialized: true,
  secret: process.env.REACT_APP_SECRET,
  resave: false,
  store: store,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
}))

// debugging userId from session in console ***REMOVE FOR PROD***
app.use((req, res, next)=>{
  console.log(`Incoming request from UserId: ${req.session.userId}`)
  next();
})

// // require the controllers
// const userController = require('./controllers/userController');
// const cocktailController = require('./controllers/cocktailController');
// const authController  = require('./controllers/authController');

// // use the controllers
// app.use('/api/v1/cocktails', cocktailController);
// app.use('/auth', authController);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});
