import app from "../../src/app";
import { createProf } from "../../src/services/ProfService";
import {
  createGebiet,
  getAlleGebiete,
  getGebiet,
} from "../../src/services/GebietService";
import supertest from "supertest";
import { createThema } from "../../src/services/ThemaService";

test("GET /ALL, einfacher Positivtest gebiet", async () => {
  // arrange:
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  const testee = supertest(app);
  const response = await testee.get(`/api/gebiet/alle`).send();
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  const gebiete = await getAlleGebiete();
  expect(gebiete.some((p) => p.id === gebRes.id)).toBe(true);
});

test("POST, einfacher Positivtest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });
  // act:
  const testee = supertest(app);
  const response = await testee.post("/api/gebiet").send({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id,
  });

  // assert:
  // Prüfe Response
  expect(response.status).toBe(201);
  expect(response.body.name).toBe("Web 2");
  expect(response.body.beschreibung).toBe("MP");
  expect(response.body.public).toBe(true);
  expect(response.body.closed).toBe(false);
  expect(response.body.password).toBeUndefined();
  expect(response.body.id).toBeDefined();
  // Prüfe Datenbank
  const gebiete = await getAlleGebiete();
  expect(gebiete.some((p) => p.id === response.body.id)).toBe(true);
});

test("POST, einfacher Positivtest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });
  const testee = supertest(app);
  const response = await testee.post("/api/gebiet").send({});

  expect(response.status).toBe(400);
});

test("GET, einfacher Positivtest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });
  // act:
  const testee = supertest(app);
  const response = await testee.get(`/api/gebiet/${gebRes.id}`).send();
  // assert:
  // Prüfe Response
  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Web 2");
  expect(response.body.beschreibung).toBe("MP");
  expect(response.body.public).toBe(true);
  expect(response.body.closed).toBe(false);
  expect(response.body.password).toBeUndefined();
  expect(response.body.id).toBeDefined();
  // Prüfe Datenbank
  const gebiete = await getGebiet(gebRes.id!);
  expect(gebiete).toBeDefined();
});

test("GET themen, einfacher Negativtest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });
  // act:
  const testee = supertest(app);
  const response = await testee.get(`/api/gebiet/${gebRes.id}/themen`).send();
  // assert:
  // Prüfe Response
  expect(response.status).toBe(404);
});

test("GET themen, einfacher Negativtest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });
  // act:
  const testee = supertest(app);
  const response = await testee
    .get(`/api/gebiet/${"123456789012345678901234"}/themen`)
    .send();
  // assert:
  // Prüfe Response
  expect(response.status).toBe(404);
});

test("GET themen, einfacher validation Negativtest gebiet ", async () => {
  const testee = supertest(app);
  const response = await testee.get(`/api/gebiet/${undefined}/themen`).send();
  expect(response.status).toBe(400);
});

test("GET themen, einfacher PositvTest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });

  const themen = await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebRes.id!,
  });
  // act:
  const testee = supertest(app);
  const response = await testee.get(`/api/gebiet/${gebRes.id}/themen`).send();
  // assert:
  // Prüfe Response
  expect(response.status).toBe(200);

  expect(response.body[0].id).toBeDefined();
  // Prüfe Datenbank
  const gebiete = await getGebiet(gebRes.id!);
  expect(gebiete).toBeDefined();
});

test("GET themen, einfacher PositvTest gebiet leerer array kein fehler", async () => {
  const testee = supertest(app);
  const response = await testee.get(`/api/gebiet/alle`).send();

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
});

test("GET, einfacher NegativTest gebiet not defined", async () => {
  const testee = supertest(app);
  const response = await testee.get(`/api/gebiet/${undefined}`).send();

  expect(response.status).toBe(400);
});

test("PUT, einfacher Positivtest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
    verwalterName: verwalter.name,
    anzahlThemen: 0,
  });

  const testee = supertest(app);
  const response = await testee.put(`/api/gebiet/${gebRes.id}`).send({
    id: gebRes.id,
    name: "Web 3",
    beschreibung: "AP",
    public: false,
    closed: false,
    verwalter: verwalter.id,
    verwalterName: verwalter.name,
    anzahlThemen: 0,
  });
  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Web 3");
  expect(response.body.beschreibung).toBe("MP"); //weil update nur name, public, closed ändert
  expect(response.body.public).toBe(false);
  expect(response.body.closed).toBe(false);
  expect(response.body.password).toBeUndefined();
  expect(response.body.id).toBe(gebRes.id);

  const gebiete = await getAlleGebiete(verwalter.id);

  expect(
    gebiete.some((p) => p.id === response.body.id && p.name === "Web 3")
  ).toBe(true);
});

test("PUT /alle, einfacher NegativerTest gebiet", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const testee = supertest(app);
  const response = await testee.put(`/api/gebiet/alle`).send({
    id: "alle",
    name: "Web 3",
    beschreibung: "AP",
    public: true,
    closed: true,
    verwalter: verwalter.id,
  });

  expect(response.status).toBe(400);
});

test("PUT /alle, einfacher NegativerTest gebiet unvollständig", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const testee = supertest(app);
  const response = await testee.put(`/api/gebiet/${gebRes.id}`).send({
    id: gebRes.id,
    name: "",
    beschreibung: "AP",
    public: true,
    closed: true,
    verwalter: verwalter.id,
  });

  expect(response.status).toBe(400);
});

test("PUT, einfacher NegativTest erfundene gebietID", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const testee = supertest(app);
  const response = await testee.put(`/api/gebiet/${gebRes.id}`).send({
    id: "erfunde id",
    name: "Web 3",
    beschreibung: "AP",
    public: true,
    closed: true,
    verwalter: verwalter.id,
  });

  expect(response.status).toBe(400);
});

test("PUT, einfacher NegativTest erfundene gebietID", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
  });

  const testee = supertest(app);
  const response = await testee.put(`/api/gebiet/${"123456789012345678901234"}`).send({
    id: "123456789012345678901234",
    name: "Web 3",
    beschreibung: "AP",
    public: false,
    closed: false,
    verwalter: verwalter.id,
    verwalterName: verwalter.name,
    anzahlThemen: 0,
  });

  expect(response.status).toBe(404);
});

test("DELETE, einfacher Positivtest gebiet", async () => {
  //Arrange
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });
  //Act
  const testee = supertest(app);
  const response = await testee.delete(`/api/gebiet/${gebRes.id}`).send();

  //Assert
  expect(response.status).toBe(204);
  expect((await getAlleGebiete()).every((p) => p.id !== gebRes.id)).toBe(true);
});

test("DELETE /alle, einfacher NegativTest gebiet", async () => {
  //Arrange
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    admin: false,
    password: "abcABC123!§",
  });

  const gebRes = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    public: true,
    closed: false,
    verwalter: verwalter.id!,
  });
  //Act
  const testee = supertest(app);
  const response = await testee.delete(`/api/gebiet/alle`).send();

  //Assert
  expect(response.status).toBe(400);
});

test("DELETE, Gebiet existiert", async () => {
  const verwalter = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
  });

  const gebRes = await createGebiet({
    name: "Testgebiet",
    beschreibung: "Testbeschreibung",
    public: false,
    closed: false,
    verwalter: verwalter.id!,
    verwalterName: verwalter.name,
    anzahlThemen: 0,
  });

  const testee = supertest(app);

  const response = await testee.delete(`/api/gebiet/${gebRes.id}`);

  expect(response.status).toBe(204);

  const checkResponse = await testee.get(`/api/gebiet/${gebRes.id}`);
  expect(checkResponse.status).toBe(404);
});

test("DELETE, einfacher NegativTest gebiet no exist", async () => {
  const testee = supertest(app);
  const response = await testee
    .delete(`/api/gebiet/${"123456789012345678901234"}`)
    .send();

  //Assert
  expect(response.status).toBe(404);
});
