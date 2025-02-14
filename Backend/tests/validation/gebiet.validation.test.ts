import app from "../../src/app";
import { createGebiet } from "../../src/services/GebietService";
import "restmatcher"; // Stelle neue Jest-Matcher zur Verfügung
import supertest from "supertest";
import { createProf } from "../../src/services/ProfService";
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";

beforeAll(async () => {
  const verwalter = await createProf({
    name: "Admin",
    campusID: "admin",
    password: "xyzXYZ123!§xxx",
    admin: true,
  });
  await performAuthentication("admin", "xyzXYZ123!§xxx");

  await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });
});

test("POST, fehlende name", async () => {
  // act:
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/gebiet").send({
    beschreibung: "AP",
    public: false,
    closed: false,
    verwalter: profRes.id,
  });

  // assert:
  // Prüfe Response
  expect(response.status).toBe(400);
  expect(response).toHaveValidationErrorsExactly({
    status: "400",
    body: "name",
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
  const gebRes = await createGebiet({
    name: "Web 3",
    beschreibung: "AP",
    public: false,
    closed: false,
    verwalter: profRes.id!,
    verwalterName: profRes.name,
    anzahlThemen: 0,
  });

  const anderergebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "APP",
    public: false,
    closed: false,
    verwalter: profRes.id!,
    verwalterName: profRes.name,
    anzahlThemen: 0,
  });

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/gebiet/${gebRes.id}`).send({
    id: anderergebRes.id, // andere ID als in Parameter
    name: "Web 2",
    beschreibung: "APP",
    public: false,
    closed: false,
    verwalter: profRes.id!,
    verwalterName: profRes.name,
    anzahlThemen: 0,
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
  const response = await testee.delete(`/api/gebiet/keineMongoID`).send();

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

  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });
  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/gebiet").send({
    name: "",
    beschreibung: "APP",
    public: false,
    closed: false,
    verwalter: profRes.id!,
    verwalterName: profRes.name,
    anzahlThemen: 0,
  });

  // Prüfe Datenbank
  expect(response.statusCode).toBe(400);
  expect(response.body.errors[0].location).toBe("body");
  expect(response.body.errors[0].path).toBe("name");
});
