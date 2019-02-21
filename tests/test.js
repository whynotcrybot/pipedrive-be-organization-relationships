const request = require('supertest');
const app = require('../src/app')

describe('Organization Route', () => {
  beforeAll(async () => {
    await request(app).delete('/organization');
  });

  test('should create organizations and relationships from data', async (done) => {
    const data = {
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

    const response = await request(app)
      .post('/organization')
      .send(data);

    expect(response.statusCode).toBe(200);

    done();
  });


  test('should retrieve relationships for specific organization', async (done) => {
    const data = {
      org: 'Black Banana',
    };

    const expected = [
      {
        org_name: 'Banana tree',
        relationship_type: 'parent',
      },
      {
        org_name: 'Big banana tree',
        relationship_type: 'parent',
      },
      {
        org_name: 'Phoneutria Spider',
        relationship_type: 'daughter',
      },
      {
        org_name: 'Brown Banana',
        relationship_type: 'sister',
      },
      {
        org_name: 'Green Banana',
        relationship_type: 'sister',
      },
      {
        org_name: 'Yellow Banana',
        relationship_type: 'sister',
      },
    ];

    const response = await request(app)
      .get('/organization')
      .query(data);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    done();
  });
});
