/* eslint-disable no-await-in-loop */
const HTTPStatus = require('http-status');

async function getOrganization(req, res, next) {
  try {
    const { db, query } = req;

    const result = await db.query(`SELECT DISTINCT organization_id AS org_name, relationship_type FROM organizations_relationship WHERE linked_organization_id="${query.org}" ORDER BY relationship_type ASC`);

    return res.json(result);
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}

async function traverse(db, data) {
  try {
    const queue = [data];

    await db.beginTransaction();

    // eslint-disable-next-line
    for (const organization of queue) {
      // Insert current object
      await db.query('INSERT IGNORE INTO organization SET name=?', organization.org_name);

      // Traverse daughters
      if (organization.daughters) {
        const { daughters } = organization;
        const promises = [];

        daughters.forEach((daughter) => {
          // Set sister relationships
          const sisters = daughters.filter(sister => sister.org_name !== daughter.org_name);
          sisters.forEach((sister) => {
            promises.push(db.query(`INSERT INTO organizations_relationship (organization_id, linked_organization_id, relationship_type) VALUES ("${daughter.org_name}", "${sister.org_name}", "sister")`));
          });

          // Set parent and daughter relationship
          promises.push(db.query(`INSERT INTO organizations_relationship (organization_id, linked_organization_id, relationship_type) VALUES ("${organization.org_name}", "${daughter.org_name}", "parent")`));
          promises.push(db.query(`INSERT INTO organizations_relationship (organization_id, linked_organization_id, relationship_type) VALUES ("${daughter.org_name}", "${organization.org_name}", "daughter")`));

          // Traverse daughter
          queue.push(daughter);
        });

        await Promise.all(promises);
      }
    }

    await db.commit();
  } catch (e) {
    await db.rollback();

    return false;
  }

  return true;
}

async function createOrganization(req, res, next) {
  try {
    const { db, body } = req;

    await traverse(db, body);

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
