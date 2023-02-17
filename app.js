const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const passport = require('passport');
const httpStatus = require('http-status');

const config = require('./src/config/config.js');
const routes = require('./src/routes/v1');   // UnComment after adding Routes
const morgan = require('./src/config/morgan.js');
const { authLimiter } = require('./src/middlewares/rateLimiter.js');


const ApiError = require('./src/utils/apiError.js');
const path = require("path");
const app = express();
const multer = require('multer');


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



const PUBLIC_DIR = path.resolve(__dirname, "./public");

//Configuration for Multer for pdf
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PUBLIC_DIR + '/uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image or video files are allowed'));
    }
  }
}).fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]);



// // v1 api routes
app.use('/api/v1', upload, routes);

app.get('/api/healthcheck', function (req, res) {
  let data = {
    response: 'ok'
  };
  res.status(200).send(data);
});


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// enable cors
app.options('*', cors());


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
};


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});


module.exports = app;
