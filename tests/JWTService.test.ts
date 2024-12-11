import { ProfResource } from "../src/Resources";
import { verifyPasswordAndCreateJWT } from "../src/services/JWTService";
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

    await expect(
      verifyPasswordAndCreateJWT("123456", "gültig")
    ).rejects.toThrow("JWT_SECRET oder JWT_TTL icht gegeben");
  });