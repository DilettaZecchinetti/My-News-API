const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");

const db = require("../db/connection");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe.only("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
