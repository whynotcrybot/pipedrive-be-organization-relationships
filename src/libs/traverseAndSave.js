/* eslint-disable no-await-in-loop */

async function traverseAndSave(db, data) {
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

module.exports = traverseAndSave;
