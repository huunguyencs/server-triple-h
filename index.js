require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');

const cookieParser = require('cookie-parser');
const appResponse = require('./utils/appResponse');

// middleware
const app = express();
app.use(express.json());
// accept cors
app.use(cors());
app.use(cookieParser());
app.use(appResponse);
// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
//   standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false // Disable the `X-RateLimit-*` headers
// });
// app.use(limiter);

//Socket
const http = require('http').createServer(app);
// Port
const PORT = process.env.PORT;

// Mongo
const MONGO_URL = process.env.MONGO_URL;

// Router
app.use('/post', require('./Routers/post.router'));
app.use('/user', require('./Routers/user.router'));
app.use('/comment', require('./Routers/comment.router'));
app.use('/tour', require('./Routers/tour.router'));
app.use('/location', require('./Routers/location.router'));
app.use('/province', require('./Routers/province.router'));
app.use('/service', require('./Routers/service.router'));
app.use('/event', require('./Routers/event.router'));
app.use('/notify', require('./Routers/notify.router'));
app.use('/message', require('./Routers/message.router'));
app.use('/volunteer', require('./Routers/volunteer.router'));
app.use('/report', require('./Routers/report.router'));
app.use('/help', require('./Routers/help.router'));
app.use('/event_contribute',require('./Routers/eventContribute.router'))
app.use('/location_contribute',require('./Routers/locationContribute.router'))

//connect MongoDB
mongoose
  .connect(MONGO_URL, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch(err => {
    console.log(err);
  });

http.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});

module.exports = app;
