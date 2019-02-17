const util = require('util');
const mysql = require('mysql');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require('./config');

module.exports = (app) => {
  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    insecureAuth : true,
  });

  connection.connect((err) => {
    if (err) {
      console.log('connecting error', err);
      return;
    }
    console.log('connecting success');
  });

  connection.query = util.promisify(connection.query);

  app.use((req, res, next) => {
    req.db = connection;
    next();
  });
};
