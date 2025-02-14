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

  const gebiet = await createGebiet({
    name: "Web 2",
    beschreibung: "MP",
    verwalter: verwalter.id!,
    public: false,
  });

  await createThema({
    titel: "routes",
    beschreibung: "aufgabe 4",
    abschluss: "bsc",
    status: "offen",
    betreuer: verwalter.id!,
    gebiet: gebiet.id!,
  })
});

test("GET / einfacher Negativtest thema", async () => {
    // Arrange
    const verwalter = await createProf({
      name: "Mein Prof",
      campusID: "MP",
      password: "abcABC123!§",
      admin: true,
    });

    const verwalter1 = await createProf({
        name: "Mein Prof",
        campusID: "MPs",
        password: "abcABC123!§s",
        admin: false,
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
  
  await performAuthentication("MPs", "abcABC123!§s");

  const testee = supertestWithAuth(app);
  const response = await testee.get(`/api/thema/${thema.id}`).send();

  expect(response.status).toBe(403);
  });
  

test("Delete / einfacher Negativtest thema", async () => {
    // Arrange
    const verwalter = await createProf({
      name: "Mein Prof",
      campusID: "MP",
      password: "abcABC123!§",
      admin: true,
    });

    const verwalter1 = await createProf({
        name: "Mein Prof",
        campusID: "MPs",
        password: "abcABC123!§s",
        admin: false,
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
  
  await performAuthentication("MPs", "abcABC123!§s");

  const testee = supertestWithAuth(app);
  const response = await testee.delete(`/api/thema/${thema.id}`).send();

  expect(response.status).toBe(403);
  });
  