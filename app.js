const express  = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const passport = require('passport');
const httpStatus  = require('http-status');

const config = require('./src/config/config.js');
const routes = require('./src/routes/v1');
const morgan = require('./src/config/morgan.js');
const { authLimiter } = require('./src/middlewares/rateLimiter.js');


const ApiError = require('./src/utils/apiError.js');
const path = require("path");
const app =  express();
const multer = require('multer');
const {sequelize} = require('./src/config/db');
// console.log(sequelize)
const { Sequelize, QueryTypes } = require("sequelize");

async function getAllMENTOT() {
  let sql = `select*from mentor`;

  let result = '';
  result = await sequelize.query(
      sql, {
      type: QueryTypes.SELECT
  });
  console.log(result);
};
getAllMENTOT();


app.get('/', (req, res) => {
  res.status(200).send("Hello World !!")
})

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
};

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


// gzip compression
app.use(compression());


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// enable cors
app.options('*', cors());


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1
// limit repeated failed requests to auth endpoints

if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
};


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});


module.exports = app;
