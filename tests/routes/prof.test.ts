import app from "../../src/app";
import { ProfResource } from "../../src/Resources";
import { createProf, getAlleProfs } from "../../src/services/ProfService";
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

test("POST, einfacher Positivtest", async () => {
  // arrange:
  // nichts zu tun

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/prof").send({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  // assert:
  // Prüfe Response
  
  expect(response.status).toBe(201);
  expect(response.body.name).toBe("Mein Prof");
  expect(response.body.campusID).toBe("MP");
  expect(response.body.admin).toBe(false);
  expect(response.body.password).toBeUndefined();
  expect(response.body.id).toBeDefined();
  // Prüfe Datenbank
  const profs = await getAlleProfs();
  expect(profs.some((p) => p.id === response.body.id)).toBe(true);
});

test("POST, einfacher (Negativtest) positiv", async () => {
  // arrange:
  // nichts zu tun

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/prof").send({
    name: "pilgrim",
    password: "abcABC123!§",
    campusID: "MP",
    admin: false,
    hey: false,
    h1ey: false,
    h111ey: false,
    h11ey: false,
  });
  expect(response.status).toBe(201); //unerwartet aber matchedData ignoriert die weiteren ohne felder
});

test("POST, einfacher NegativTest", async () => {
  // arrange:
  // nichts zu tun

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.post("/api/prof").send();

  // assert:
  // Prüfe Response
  expect(response.status).toBe(400);

  // Prüfe Datenbank
  const profs = await getAlleProfs();
  expect(profs.some((p) => p.id === response.body.id)).toBe(false);
});

test("GET /ALL, einfacher Positivtest", async () => {
  // arrange:
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: true,
    titel: "dmw"
  });

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.get(`/api/prof/alle`).send();

  // assert:
  // Prüfe Response
  expect(response.status).toBe(200);

  // Prüfe Datenbank
  const profs = await getAlleProfs();
  // Prüfe Datenbank
  expect(profs.some((p) => p.id === profRes.id)).toBe(true);
});

test("PUT, einfacher Positivtest", async () => {
  // arrange:
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    titel: "web2",
    password: "abcABC123!§",
    admin: false,
  });

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/${profRes.id}`).send({
    id: profRes.id,
    name: "Anderer Prof",
    campusID: "AP",
    titel: "web3",
    admin: false,
  });

  // assert:
  // Prüfe Response
  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Anderer Prof");
  expect(response.body.campusID).toBe("AP");
  expect(response.body.admin).toBe(false);
  expect(response.body.password).toBeUndefined();
  expect(response.body.id).toBe(profRes.id);
  // Prüfe Datenbank
  const profs = await getAlleProfs();
  // Prüfe Datenbank
  expect(
    profs.some((p) => p.id === response.body.id && p.name === "Anderer Prof")
  ).toBe(true);
});


test("PUT, einfacher Negativtest erfundene id", async () => {
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    titel: "web2",
    password: "abcABC123!§",
    admin: false,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/${"123456789012345678901234"}`).send({
    id: "123456789012345678901234",
    name: "Anderer Prof",
    campusID: "AP",
    titel: "web3",
    admin: true,
  });

  expect(response.status).toBe(404);
});

test("PUT, einfacher NegativTest eingaben unvollständig", async () => {
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/${profRes.id}`).send({
    id: profRes.id,
    name: "Anderer Prof",
    admin: false,
  });

  expect(response.status).toBe(400);
});

test("PUT, einfacher NegativTest not same id", async () => {
  // arrange:
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/${profRes.id}`).send({
    id: "123456789012345678901234",
    name: "Anderer Prof",
    campusID: "AP",
    admin: false,
  });

  expect(response.status).toBe(400);
});

test("PUT, einfacher Negativertest alle", async () => {
  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/alle`).send({
    id: "alle",
    name: "Anderer Prof",
    campusID: "AP",
    admin: false,
  });

  expect(response.status).toBe(400);
});

test("DELETE, einfacher Positivtest", async () => {
  // arrange:
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  // act:
  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/prof/${profRes.id}`).send();

  // assert:
  // Prüfe Response
  expect(response.status).toBe(204);
  // Prüfe Datenbank
  expect((await getAlleProfs()).every((p) => p.id !== profRes.id)).toBe(true);
});

test("DELETE, einfacher NegativTest alle", async () => {
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/prof/alle`).send();

  expect(response.status).toBe(400);
});

test("DELETE, einfacher Positivtest", async () => {
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  const testee = supertestWithAuth(app);
  const response = await testee
    .delete(`/api/prof/${"123456789012345678901234"}`)
    .send();

  expect(response.status).toBe(404);
});

