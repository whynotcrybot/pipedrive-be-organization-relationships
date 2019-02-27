const HTTPStatus = require('http-status');
const traverseAndSave = require('../libs/traverseAndSave');
const generateAndSave = require('../libs/generateAndSave');

async function getOrganization(req, res, next) {
  try {
    const { db, query } = req;


    const result = await db.query(`
      (
        SELECT DISTINCT organization_name AS org_name, 'parent' AS relationship_type
        FROM organizations_relationship
        WHERE parent_organization_name="${query.org}"
      )
      UNION
      (
        SELECT DISTINCT parent_organization_name AS org_name, 'daughter' AS relationship_type
        FROM organizations_relationship
        WHERE organization_name="${query.org}"
      )
      UNION
      (
        SELECT DISTINCT parent_organization_name AS org_name, 'sister' as relationship_type
        FROM organizations_relationship
        WHERE parent_organization_name!='${query.org}' AND organization_name IN (
          SELECT organization_name
          FROM organizations_relationship
          WHERE parent_organization_name='${query.org}'
        )
      )
      ORDER BY org_name
    `);

    return res.json(result);
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}

async function createOrganization(req, res, next) {
  try {
    const { db, body } = req;

    await traverseAndSave(db, body);

    const response = {
      success: true,
    };

    return res.status(HTTPStatus.OK).json(response);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

async function flushOrganizations(req, res, next) {
  try {
    const { db } = req;

    await db.query('SET foreign_key_checks = 0');
    await db.query('TRUNCATE TABLE organizations_relationship');
    await db.query('TRUNCATE TABLE organization');
    await db.query('SET foreign_key_checks = 1');

    return res.sendStatus(HTTPStatus.OK);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

module.exports = {
  getOrganization,
  createOrganization,
  flushOrganizations,
};
