import app from "../../src/app";
import { createProf, getAlleProfs } from "../../src/services/ProfService";
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
  // siehe beforeAll                 <-------- Dort wird der Admin-Prof angelegt und angemeldet.

  // act:
  const testee = supertestWithAuth(app); // <-------- Hier wird nun supertestWithAuth verwendet!
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

test("PUT, einfacher Positivtest", async () => {
  // arrange:
  // siehe beforeAll                 <-------- Dort wird der Admin-Prof angelegt und angemeldet.
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  // act:
  const testee = supertestWithAuth(app); // <-------- Hier wird nun supertestWithAuth verwendet!
  const response = await testee.put(`/api/prof/${profRes.id}`).send({
    id: profRes.id,
    name: "Anderer Prof",
    campusID: "AP",
    admin: false,
    titel: "bla", //TODO: titel erforderlich oder nicht????
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

test("DELETE, einfacher Positivtest", async () => {
  // arrange:
  // siehe beforeAll                 <-------- Dort wird der Admin-Prof angelegt und angemeldet.
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    password: "abcABC123!§",
    admin: false,
  });

  // act:
  const testee = supertestWithAuth(app); // <-------- Hier wird nun supertestWithAuth verwendet!
  const response = await testee.delete(`/api/prof/${profRes.id}`).send();

  // assert:
  // Prüfe Response
  expect(response.status).toBe(204);
  // Prüfe Datenbank
  expect((await getAlleProfs()).every((p) => p.id !== profRes.id)).toBe(true);
});

// Test für GET /api/prof/alle können selbst geschrieben werden.
