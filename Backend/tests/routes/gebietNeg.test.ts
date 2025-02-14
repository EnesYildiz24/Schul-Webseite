import app from "../../src/app";
import { createProf } from "../../src/services/ProfService";
import {
  createGebiet,
  getAlleGebiete,
  getGebiet,
} from "../../src/services/GebietService";
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

  await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    verwalter: verwalter.id!,
    public: false,
  });
});

test("GET /:id negativtest", async () => {
  const verwalter = await createProf({
    name: "Admin",
    campusID: "as",
    password: "xyzXYZ123!§xxx",
    admin: true,
  });
  const nonVerwalter = await createProf({
    name: "Admin",
    campusID: "ass",
    password: "xyzXYZ123!§sxxx",
    admin: true,
  });

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    verwalter: verwalter.id!,
    public: false,
  });

  await performAuthentication("ass", "xyzXYZ123!§sxxx");
  const testee = supertestWithAuth(app);
  const response = await testee.get(`/api/gebiet/${gebiet.id}`).send();

  expect(response.status).toBe(403);
});

test("POST, negativtest", async () => {
    const verwalter1 = await createProf({
      name: "Admin",
      campusID: "as",
      admin: true,
      password: "xyzXYZ123!§sxx",
    });
  
    const nichtVerwalter = await createProf({
      name: "Admin",
      campusID: "ass",
      admin: false,
      password: "xyzXYZ123!§sxxx",
    });
  
    await performAuthentication("ass", "xyzXYZ123!§sxxx");
  
    const testee = supertestWithAuth(app);
    const response = await testee.post("/api/gebiet").send({
      name: "Web 2",
      beschreibung: "lel",
      public: true,
      closed: false,
      verwalter: verwalter1.id,
    });
  
    expect(response.status).toBe(403);
  });
  
  test("DELETE, Zugriff verweigert, wenn Benutzer nicht der Verwalter ist", async () => {
    const verwalter = await createProf({
      name: "Admin",
      campusID: "as",
      admin: true,
      password: "xyzXYZ123!§sxx",
    });
  
    const nichtVerwalter = await createProf({
        name: "Admin",
        campusID: "ass",
        admin: false,
        password: "xyzXYZ123!§sxxx",
    });
  
    const gebiet = await createGebiet({
      name: "Web 2",
      beschreibung: "dsd.",
      verwalter: verwalter.id!,
      public: true,
    });
  
    await performAuthentication("ass", "xyzXYZ123!§sxxx");
  
    const testee = supertestWithAuth(app);
    const response = await testee.delete(`/api/gebiet/${gebiet.id}`).send();
  
    expect(response.status).toBe(403);
  });
  