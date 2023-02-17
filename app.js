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
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PUBLIC_DIR + 'public/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `pdf/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// Multer Filter
const multerFilterPdf = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};


//Configuration for Multer for video
const Videostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PUBLIC_DIR + 'public/uploads')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `video/admin-${file.fieldname}-${Date.now()}.${ext}`);
  }
});


//Configuration for Multer for image
const imageStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `image/admin-${file.fieldname}-${Date.now()}.${ext}`)
  }
});

const multerFilterImage = function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(new Error('Only images are allowed'));
  }
  callback(null, true)
};


const videoUpload = multer({ storage: Videostorage });
const imageUpload = multer({ storage: imageStorage, fileFilter: multerFilterImage, limits: { fileSize: 1024 * 1024 } });
const pdfUpload = multer({ storage: pdfStorage, fileFilter: multerFilterPdf });


// // v1 api routes
// app.use('/api/v1/video', videoUpload.single('myVideo'), routes);
app.use('/api/v1', imageUpload.single('myImage'), routes);
// app.use('/api/v1/pdf', pdfUpload.single('myPdf'), routes);

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
