const HTTPStatus = require('http-status');

async function getOrganization(req, res, next) {
  try {
    const { db } = req;
    const org = 'Black Banana';

    const result = await db.query(`SELECT DISTINCT organization_id AS org_name, id, relationship_type FROM organizations_relationship WHERE linked_organization_id="${org}" ORDER BY relationship_type ASC`);

    console.log('RESULT', result);

    return res.json(result);
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}

async function traverse(db, parent) {
  try {
    // Insert current object
    await db.query('INSERT INTO organization SET name=?', parent.org_name);
    
    const { daughters } = parent;

    // Traverse daughters
    if (daughters) {
      daughters.forEach(async (daughter) => {
        // Set sister relationships
        const sisters = daughters.filter(sister => sister.org_name !== daughter.org_name);
        sisters.forEach(async (sister) => {
          await db.query(`INSERT INTO organizations_relationship (organization_id, linked_organization_id, relationship_type) VALUES ("${daughter.org_name}", "${sister.org_name}", "sister")`);
        });

        // Set parent and daughter relationship
        await db.query(`INSERT INTO organizations_relationship (organization_id, linked_organization_id, relationship_type) VALUES ("${parent.org_name}", "${daughter.org_name}", "parent")`);
        await db.query(`INSERT INTO organizations_relationship (organization_id, linked_organization_id, relationship_type) VALUES ("${daughter.org_name}", "${parent.org_name}", "daughter")`);

        await traverse(db, daughter);
      });
    }

    await db.commit();
    return true;
  } catch (e) {
    console.log('ERROR', e);
    await db.rollback();
  }
}

async function createOrganization(req, res, next) {
  try {
    const { db } = req;
    await db.query('SET foreign_key_checks = 0');
    await db.query('TRUNCATE TABLE organizations_relationship');
    await db.query('TRUNCATE TABLE organization');
    await db.query('SET foreign_key_checks = 1');

    const request = {
      org_name: 'Paradise Island',
      daughters: [
        {
          org_name: 'Banana tree',
          daughters: [
            {
              org_name: 'Yellow Banana',
            },
            {
              org_name: 'Brown Banana',
            },
            {
              org_name: 'Black Banana',
            },
          ],
        },
        {
          org_name: 'Big banana tree',
          daughters: [
            {
              org_name: 'Yellow Banana',
            },
            {
              org_name: 'Brown Banana',
            },
            {
              org_name: 'Green Banana',
            },
            {
              org_name: 'Black Banana',
              daughters: [
                {
                  org_name: 'Phoneutria Spider',
                },
              ],
            },
          ],
        },
      ],
    };

    await traverse(db, request);

    return res.status(HTTPStatus.OK).json(request);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

module.exports = {
  getOrganization,
  createOrganization,
};
