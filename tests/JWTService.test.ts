import { JsonWebTokenError, sign } from "jsonwebtoken";
import { ProfResource } from "../src/Resources";
import {
  verifyJWT,
  verifyPasswordAndCreateJWT,
} from "../src/services/JWTService";
import { createProf } from "../src/services/ProfService";

beforeAll(() => {
  process.env.JWT_SECRET = "secret";
  process.env.JWT_TTL = "300";
});

test("JWTService postitivTest", async () => {
  const token = await verifyPasswordAndCreateJWT("123456", "gültig");
  expect(token).not.toBeDefined();

  const newProf: ProfResource = {
    campusID: "123456",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "gültig",
  };
  const createdProf1 = await createProf(newProf);

  const token2 = await verifyPasswordAndCreateJWT("123456", "gültig");
  expect(token2).toBeDefined();
});

test("JWTService negativTest", async () => {
  const token = await verifyPasswordAndCreateJWT("123456", "gültig");
  expect(token).not.toBeDefined();
});

test("JWTService Test ohne JWT_TTL: Fehler wird erwartet", async () => {
  process.env.JWT_SECRET = "goofly";
  delete process.env.JWT_TTL;

  await expect(verifyPasswordAndCreateJWT("123456", "gültig")).rejects.toThrow(
    "JWT_SECRET oder JWT_TTL icht gegeben"
  );
});

test("JWTService Test undefined: Fehler wird erwartet", () => {
  expect(() => verifyJWT(undefined)).toThrow(JsonWebTokenError);
  expect(() => verifyJWT(undefined)).toThrow("JWT ist nicht definiert");
});

test("JWTService Test erfundene JWT_TTL: Fehler wird erwartet", () => {
  expect(() => verifyJWT("undefined")).toThrow(JsonWebTokenError);
  expect(() => verifyJWT("undefined")).toThrow(
    "JWT-Validierung fehlgeschlagen"
  );
});

test("JWTService Test Positivtest", () => {
  const secret = process.env.JWT_SECRET!;
  const payload = {
    sub: "12345",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 300,
  };
  const validToken = sign(payload, secret, { algorithm: "HS256" });

  const result = verifyJWT(validToken);

  expect(result).toEqual({
    id: payload.sub,
    role: payload.role,
    exp: payload.exp,
  });
});

test("Fehler Benutzer-ID fehlt", () => {
  const secret = process.env.JWT_SECRET!;
  const payload = { role: "admin", exp: Math.floor(Date.now() / 1000) + 60 };
  const invalidToken = sign(payload, secret, { algorithm: "HS256" });

  expect(() => verifyJWT(invalidToken)).toThrow(JsonWebTokenError);
  expect(() => verifyJWT(invalidToken)).toThrow("JWT-Validierung fehlgeschlage");
});

test("Fehler JWT_SECRET fehlt", () => {
  delete process.env.JWT_SECRET;

  expect(() => verifyJWT("some_token")).toThrow(JsonWebTokenError);
  expect(() => verifyJWT("some_token")).toThrow("JWT_SECRET oder JWT_TTL icht gegeben");
});

