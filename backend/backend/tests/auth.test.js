const request = require("supertest");
const app = require("../src/app");

describe("Auth Routes", () => {

  it("Debe fallar login con credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "fake@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(401);
  });

});