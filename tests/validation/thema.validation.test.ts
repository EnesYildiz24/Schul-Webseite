import app from "../../src/app";
import { createGebiet } from "../../src/services/GebietService";
import { createProf } from "../../src/services/ProfService";
import "restmatcher"; // Stelle neue Jest-Matcher zur Verfügung
import supertest from "supertest";
import { createThema } from "../../src/services/ThemaService";
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";
beforeAll(async () => {
  const verwalter = await createProf({
    name: "Admin",
    campusID: "admin",
    password: "xyzXYZ123!§xxx",
    admin: true,
  });
  await performAuthentication("admin", "xyzXYZ123!§xxx");

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });
});

test("POST, fehlende CampusID", async () => {
  // act:
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

  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/thema").send({
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuername:profRes.name,
    betreuer: profRes.id,
    gebiet: gebRes.id,
  });

  // assert:
  // Prüfe Response
  expect(response).toHaveValidationErrorsExactly({
    status: "400",
    body: "titel",
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

  const themaRes = await createThema({
    titel: "hey",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: profRes.id!,
    betreuerName: profRes.name,
    gebiet: gebRes.id!,
  })

  const thema = await createThema({
    titel: "hey",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: profRes.id!,
    betreuerName: profRes.name,
    gebiet: gebRes.id!,
  })

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/${profRes.id}`).send({
    id: thema.id,
    titel: "",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: profRes.id!,
    betreuerName: "hey",
    gebiet: gebRes.id!,
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
  const response = await testee.delete(`/api/thema/keineMongoID`).send();

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
  const gebRes = await createGebiet({
    name: "Web 3",
    beschreibung: "AP",
    public: false,
    closed: false,
    verwalter: profRes.id!,
    verwalterName: profRes.name,
    anzahlThemen: 0,
  });

  const thema = await createThema({
    titel: "hey",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: profRes.id!,
    betreuerName: profRes.name,
    gebiet: gebRes.id!,
  })

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/thema").send({
    id: thema.id,
    titel: "",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: profRes.id!,
    betreuerName: "hey",
    gebiet: gebRes.id!,
  });

  // Prüfe Datenbank
  expect(response.statusCode).toBe(400);
  expect(response.body.errors[0].location).toBe("body");
  expect(response.body.errors[0].path).toBe("titel");
});

test("POST, einfacher NegativTest closed thema true", async () => {
  // arrange:
  // nichts zu tun
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
    closed: true,
    verwalter: profRes.id!,
    verwalterName: profRes.name,
    anzahlThemen: 0,
  });

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/thema").send({
    titel: "hey",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: profRes.id!,
    betreuerName: "hey",
    gebiet: gebRes.id!,
  });

  // Prüfe Datenbank
  expect(response.statusCode).toBe(404);
});

