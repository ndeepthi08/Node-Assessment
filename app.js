let express = require('express');
let app = express();
let path = require('path');
let helmet = require("helmet");
let bodyParser = require('body-parser');
let errorUtil = require('./util/errorMessages.util');
let HTTP_CODES = require('./util/httpCodes.util');


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//CORS support with OPTIONS
app.use(function (req, res, next) {
  let oneof = false;
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }

  // intercept OPTIONS method
  if (oneof && req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(helmet());

app.use('/',require('./routes/searchRoute'));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.Status = 404;
  err.Info = "Route Not Found";
  next(err);
});

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
 if (err.Status == 404) {
    var errorMessage = {
      "metadata":{
        "Status_Code": parseInt(err.Status),
        "Message": err.Info
      }
    };
    res.status(404).json(errorMessage);
  }
  else{
    res.status(HTTP_CODES.NOT_FOUND)
        .send(errorUtil.buildErrorMessage(err));
  }
});

module.exports = app;
