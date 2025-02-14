import app from "../../src/app";
import { createProf } from "../../src/services/ProfService";
import "restmatcher"; // Stelle neue Jest-Matcher zur Verfügung
import supertest from "supertest";
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";

beforeAll(async () => {
  await createProf({
    name: "Admin",
    campusID: "admin",
    password: "xyzXYZ123!§xxx",
    admin: true,
  });
  await performAuthentication("admin", "xyzXYZ123!§xxx");
});

test("POST, fehlende CampusID", async () => {
  // arrange:
  // nichts zu tun

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/prof").send({
    name: "Mein Prof",
    password: "abcABC123!§",
    admin: false,
  });

  // assert:
  // Prüfe Response
  expect(response).toHaveValidationErrorsExactly({
    status: "400",
    body: "campusID",
  });
});

test("PUT, Konsistenz ID in Parameter und Body", async () => {
  // arrange:
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });
  const andererProfRes = await createProf({
    name: "Anderer Prof",
    campusID: "AP",
    password: "abcABC123!§",
    admin: false,
  });

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/${profRes.id}`).send({
    id: andererProfRes.id, // andere ID als in Parameter
    name: "Mein Prof Änderung",
    campusID: "MP",
    admin: false,
  });

  // assert:
  // Prüfe Response
  expect(response).toHaveValidationErrorsExactly({
    status: "400",
    body: "id",
    params: "id", // Fehler in Parameter und(!) Body
  });
});

test("DELETE, keine MongoID", async () => {
  // arrange:
  // nichts zu tun

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/prof/keineMongoID`).send();

  // assert:
  // Prüfe Response
  expect(response).toHaveValidationErrorsExactly({
    status: "400",
    params: "id",
  });
});

test("POST, einfacher Positivtest", async () => {
  // arrange:
  // nichts zu tun

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/prof").send({
    name: "Mein Prof",
    campusID: "MP",
    password: "!§",
    admin: false,
  });

  // Prüfe Datenbank
  expect(response.statusCode).toBe(400);
  expect(response.body.errors[0].location).toBe("body");
  expect(response.body.errors[0].path).toBe("password");
});

// Weitere Tests können selbst geschrieben werden.
