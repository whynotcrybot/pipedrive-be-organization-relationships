/* eslint-disable no-await-in-loop */

const getName = require('sillyname');
const getRandomInt = require('./getRandomInt');

async function generateAndSave(db, requestedAmount) {
  console.time('generateAndSave');
  try {
    let amount = requestedAmount - 1;
    let maxDaughters = 0;
    let maxDaughtersParent = null;

    const queue = [[getName(), null]];

    await db.beginTransaction();

    // eslint-disable-next-line
    for (const [organization, parent] of queue) {
      // Insert current organization
      await db.query('INSERT IGNORE INTO organization SET name=?', organization);

      // Set parent relationship
      if (parent) {
        await db.query(`
          INSERT INTO organizations_relationship (organization_name, parent_organization_name)
          VALUES ('${parent}', '${organization}')
        `);
      }

      // Generate random amount of daughters
      if (amount > 0) {
        const daughtersToGenerate = getRandomInt(0, Math.ceil(amount / 8));
        const daughters = new Array(daughtersToGenerate)
          .fill()
          .map(() => [getName(), organization]);

        amount -= daughtersToGenerate;

        if (daughtersToGenerate > maxDaughters) {
          maxDaughters = daughtersToGenerate;
          maxDaughtersParent = organization;
        }

        daughters.forEach(daughter => queue.push(daughter));
      }
    }

    await db.commit();

    console.log('Parent with max daughters:', maxDaughtersParent);
    console.log('Max daughters:', maxDaughters);
  } catch (e) {
    console.log(e)
    await db.rollback();

    return false;
  }

  console.timeEnd('generateAndSave');
  return true;
}

module.exports = generateAndSave;
