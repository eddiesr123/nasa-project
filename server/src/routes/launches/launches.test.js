const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    await request(app)
      .get("/launches")
      .expect("Content-type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  const formDataMinusDate = {
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    target: "Kepler-442 b",
  };
  const launchDate = "December 27, 2030";
  const requestBody = { ...formDataMinusDate, launchDate };
  const requestWithInvalidDate = {
    ...formDataMinusDate,
    launchDate: "invalid date",
  };
  const requestDate = new Date(launchDate).toISOString();

  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .set("Accept", "application/json")
      .send(requestBody)
      .expect("Content-type", /json/)
      .expect(201);

    const responseDate = response.body.launchDate;
    const responseBody = response.body;

    expect(responseDate).toBe(requestDate);
    expect(responseBody).toMatchObject(formDataMinusDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .set("Accept", "application/json")
      .send(formDataMinusDate)
      .expect("Content-type", /json/)
      .expect(400);

    const responseBody = response.body;

    expect(responseBody).toStrictEqual({
      error: "Missing required launch properties",
    });
  });

  test("It should catch invalid date", async () => {
    const response = await request(app)
      .post("/launches")
      .set("Accept", "application/json")
      .send(requestWithInvalidDate)
      .expect("Content-type", /json/)
      .expect(400);

    const responseBody = response.body;

    expect(responseBody).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});

describe("Test DELETE /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .delete("/launches/100")
      .expect("Content-type", /json/)
      .expect(200);

    const responseBody = response.body;

    expect(responseBody).toMatchObject({
      flightNumber: 100,
      upcoming: false,
      success: false,
    });
  });

  test("It should respond with 404 Not Found", async () => {
    const response = await request(app)
      .delete("/launches/232")
      .expect("Content-type", /json/)
      .expect(404);

    const responseBody = response.body;

    expect(responseBody).toStrictEqual({ error: "Launch not found" });
  });
});
