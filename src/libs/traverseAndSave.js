/* eslint-disable no-await-in-loop */

async function traverseAndSave(db, data) {
  try {
    const queue = [data];

    await db.beginTransaction();

    // eslint-disable-next-line
    for (const organization of queue) {
      // Insert current organization
      await db.query('INSERT IGNORE INTO organization SET name=?', organization.org_name);

      // Traverse daughters
      if (organization.daughters) {
        const { daughters } = organization;

        // Set parent relationships
        const promises = daughters.map((daughter) => {
          return db.query(`
            INSERT INTO organizations_relationship (organization_name, parent_organization_name)
            VALUES ("${organization.org_name}", "${daughter.org_name}")
          `);
        });

        await Promise.all(promises);

        // Traverse daughters
        // Prefer this over 'queue.push(...daughters)'
        // due to usage of spread operator is limited by stack space
        daughters.forEach(daughter => queue.push(daughter));
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
