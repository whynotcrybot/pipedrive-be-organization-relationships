/* eslint-disable no-console */

const express = require('express');

const addMiddlewares = require('./config/middlewares');
const addDatabase = require('./config/database');
const { PORT } = require('./config/config');
const routes = require('./routes');

const app = express();

addMiddlewares(app);
addDatabase(app);

app.use('/', routes);

console.log(' PORT', PORT)
if (!module.parent) {
  app.listen(PORT, (err) => {
    if (err) console.error('Error occured', err);
    else {
      console.log(
        `
          Listening on port: ${PORT}
          Environment: ${process.env.NODE_ENV}
        `,
      );
    }
  });
}

module.exports = app;
