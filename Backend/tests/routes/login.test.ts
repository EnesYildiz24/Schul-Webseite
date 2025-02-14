import { parseCookies } from "restmatcher";
import supertest from "supertest";
import app from "../../src/app";
import { createProf } from "../../src/services/ProfService";
import { sign } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "test_secret";
const COOKIE_NAME = "access_token";

test(`/api/login POST, Positivtest`, async () => {
  // arrange:
  await createProf({
    name: "Admin",
    campusID: "admin",
    password: "xyzXYZ123!§xxx",
    admin: true,
  });

  // act:
  const testee = supertest(app);
  const loginData = { campusID: "admin", password: "xyzXYZ123!§xxx" };
  const response = parseCookies(
    await testee.post(`/api/login`).send(loginData)
  );

  // assert:
  expect(response).statusCode("2*");
  // added by parseCookies, similar to express middleware cookieParser
  expect(response).toHaveProperty("cookies"); // added by parseCookies
  expect(response.cookies).toHaveProperty("access_token"); // the cookie with the JWT
  const token = response.cookies.access_token;
  expect(token).toBeDefined();
});

test(`/api/login POST, NegativTest 401`, async () => {
    await createProf({
      name: "pic",
      campusID: "pic",
      password: "xyzXYZ123!§xxx",
      admin: true,
    });
  
    const testee = supertest(app);
    const loginData = { campusID: "admin", password: "xyzXYZ123!§xxx" };
    const response = parseCookies(
      await testee.post(`/api/login`).send(loginData)
    );
      expect(response).statusCode(401);
    expect(response).toHaveProperty("cookies"); // added by parseCookies
  });
  
  test("/api/login POST, NegativTest 400", async () => {
    const response = await supertest(app)
      .post("/api/login")
      .send({ password: "abcXYZ123!" });
    expect(response.status).toBe(400);     
  });



test("GET/ Kein Cookie gesetzt", async () => {
  const response = await supertest(app).get("/api/login");
  expect(response.status).toBe(200);
  expect(response.body).toBe(false);
});

test("GET/ Gültiger Cookie", async () => {
  const payload = {
    sub: "123",
    role: "a",
    exp: Math.floor(Date.now() / 1000) + 300,
  };
  const token = sign(payload, SECRET);
  const response = await supertest(app)
    .get("/api/login")
    .set("Cookie", `${COOKIE_NAME}=${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    id: payload.sub,
    role: payload.role,
    exp: payload.exp,
  });
});

test("GET/ Ungültiger Cookie, Rückgabe false, Cookie gelöscht", async () => {
  const crackToken = "crackToken";
  const response = await supertest(app)
    .get("/api/login")
    .set("Cookie", `${COOKIE_NAME}=${crackToken}`);
  expect(response.status).toBe(200);
  expect(response.body).toBe(false);
});

test("DELETE/ Gültiger Cookie gelöscht", async () => {
    const payload = {
      sub: "123",
      role: "a",
      exp: Math.floor(Date.now() / 1000) + 300,
    };
    const token = sign(payload, SECRET);
    const response = await supertest(app)
      .delete("/api/login")
      .set("Cookie", `${COOKIE_NAME}=${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({});
  });