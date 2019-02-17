const HTTPStatus = require('http-status');

async function getOrganization(req, res, next) {
  try {
    const result = {
      result: 'result',
    };

    return res.json(result);
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}

async function createOrganization(req, res, next) {
  try {
    const result = {
      result: 'result',
    };

    return res.json(result);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

module.exports = {
  getOrganization,
  createOrganization,
};
