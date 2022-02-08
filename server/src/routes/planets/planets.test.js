const request = require("supertest");
const app = require("../../app");

const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Test GET /v1/planets", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  test("It should respond with 200 success", async () => {
    await request(app)
      .get("/v1/planets")
      .expect("Content-type", /json/)
      .expect(200);
  });
});
