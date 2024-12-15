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
    admin: false,
  });
  await performAuthentication("admin", "xyzXYZ123!§xxx");
});

test("GET /ALL, Zugriff verweigert für nicht-Administratoren", async () => {
  // arrange:
  const profRes = await createProf({
    name: "pilgrim",
    password: "abcABC123!§",
    campusID: "MP",
    admin: false,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.get("/api/prof/alle").send();

  // assert:
  expect(response.status).toBe(403);
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
  });
  expect(response.status).toBe(403);
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

  expect(response.status).toBe(403);
});

test("PUT, einfacher NegativTest", async () => {
  const profRes = await createProf({
    name: "Mein Prof",
    campusID: "MP",
    titel: "web2",
    password: "abcABC123!§",
    admin: false,
  });

  const testee = supertestWithAuth(app);
  const response = await testee.put(`/api/prof/${profRes.id}`).send({
    id: profRes.id,
    name: "Anderer Prof",
    campusID: "AP",
    titel: "web3",
    admin: false,
  });
  expect(response.status).toBe(403);
});

test("DELETE", async () => {
    const adminProf = await createProf({
      name: "pilgrim",
      campusID: "123445",
      password: "abc12345",
      admin: true,
    });
  
    await performAuthentication("123445", "abc12345");
  
    const testee = supertestWithAuth(app);
    const response = await testee.delete(`/api/prof/${adminProf.id}`).send();
  
    expect(response.status).toBe(403); 
  });
  
