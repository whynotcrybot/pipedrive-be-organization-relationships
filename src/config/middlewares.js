const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const isTestEnv = process.env.NODE_ENV === 'test';

module.exports = (app) => {
  if (!isTestEnv) {
    app.use(logger('dev'));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
};
