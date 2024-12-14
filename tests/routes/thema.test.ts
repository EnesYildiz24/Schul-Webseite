import app from "../../src/app";
import { createProf } from "../../src/services/ProfService";
import { createGebiet } from "../../src/services/GebietService";
import {
  createThema,
  getAlleThemen,
  getThema,
  updateThema,
} from "../../src/services/ThemaService";
import supertest from "supertest";
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
test("GET / einfacher Positivtest thema", async () => {
  // Arrange
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  // Act
  const testee = supertestWithAuth(app);
  const response = await testee.get(`/api/thema/${thema.id}`).send();

  // Assert
  expect(response.status).toBe(200);
  expect(response.body.titel).toBe("routes");
  expect(response.body.beschreibung).toBe("aufgabe 4");
  expect(response.body.abschluss).toBe("bsc");
  expect(response.body.status).toBe("offen");
  expect(response.body.id).toBeDefined();
});

test("GET / einfacher  Negativ test erfundene id thema", async () => {
  const testee = supertestWithAuth(app);
  const response = await testee
    .get(`/api/thema/${"123456789011111111111111"}`)
    .send();

  // Assert
  expect(response.status).toBe(500);
});

test("GET / einfacher Negativ test undefined thema", async () => {
  const testee = supertestWithAuth(app);
  const response = await testee.get(`/api/thema/${undefined}`).send();

  expect(response.status).toBe(400);
});

test("POST, einfacher Positivtest thema", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/thema").send({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  // assert:
  // Prüfe Response
  expect(response.status).toBe(201);
  expect(response.body.titel).toBe("routes");
  expect(response.body.beschreibung).toBe("aufgabe 4");
  expect(response.body.abschluss).toBe("bsc");
  expect(response.body.status).toBe("offen");
  expect(response.body.id).toBeDefined();
  expect(response.body.password).toBeUndefined();
  // Prüfe Datenbank
  const themen = await getAlleThemen(gebiet.id!);
  expect(themen.some((p) => p.id === response.body.id)).toBe(true);
});

test("POST, einfacher Positivtest thema", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/thema").send({
    titel: undefined,
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  expect(response.status).toBe(400);
});

test("POST, einfacher NegativTest kein thema", async () => {
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/thema").send({});
  expect(response.status).toBe(400);
});

test("PUT, einfacher Positivtest thema", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/thema/${thema.id}`).send({
    id: thema.id,
    titel: "REACT",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: verwalter.id!,
    betreuerName: verwalter.name,
    gebiet: gebiet.id!,
  });

  expect(response.status).toBe(200);
  expect(response.body.titel).toBe("REACT");
  expect(response.body.beschreibung).toBe("aufgabe 5");
  expect(response.body.abschluss).toBe("msc");
  expect(response.body.status).toBe("reserviert");
  expect(response.body.password).toBeUndefined();
  expect(response.body.id).toBe(thema.id);

  const themen = await getAlleThemen(gebiet.id!);
  expect(
    themen.some((p) => p.id === response.body.id && p.titel === "REACT")
  ).toBe(true);
});

test("PUT / alle, einfacher NegativTest thema", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/thema/alle`).send({
    id: "alle",
    titel: "REACT",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  expect(response.status).toBe(400);
});


test("PUT / alle, einfacher NegativTest thema", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/thema/${"111111111111111111111111"}`).send({
    id: "111111111111111111111111",
    titel: "REACT",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: verwalter.id!,
    betreuerName: verwalter.name,
    gebiet: gebiet.id!,
  });

  expect(response.status).toBe(404);
});

test("PUT / einfacher NegativTest kein update inhalt thema", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/thema/${thema.id}`).send({});

  expect(response.status).toBe(400);
});

test("PUT , einfacher NegativTest thema undvollständige änderung", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/thema/${thema.id}`).send({
    id: thema.id,
    titel: "",
    beschreibung: "aufgabe 5",
    abschluss: "msc",
    status: "reserviert",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });

  expect(response.status).toBe(400);
});

test("DELETE, einfacher Positivtest thema", async () => {
  //Arrange
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });
  //Act
  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/thema/${thema.id}`).send();

  //Assert
  expect(response.status).toBe(204);
  expect(
    (await getAlleThemen(gebiet.id!)).every((p) => p.id !== thema.id)
  ).toBe(true);
});

test("DELETE/alle, einfacher NegativTest thema", async () => {
  //Arrange
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  const thema = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  });
  //Act
  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/thema/alle`).send();

  //Assert
  expect(response.status).toBe(400);
});

test("DELETE, einfacher NegativTest undefined id thema", async () => {
  //Act
  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/thema/${undefined}`).send();

  //Assert
  expect(response.status).toBe(400);
});

test("DELETE, einfacher NegativTest erfundene id thema", async () => {
  //Act
  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/thema/${"123456789012345678901234"}`).send();

  //Assert
  expect(response.status).toBe(404);
});

