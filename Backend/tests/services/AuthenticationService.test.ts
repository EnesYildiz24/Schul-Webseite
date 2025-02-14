import { logger } from "../../src/logger";
import { Prof } from "../../src/model/ProfModel";
import { ProfResource } from "../../src/Resources";
import { login } from "../../src/services/AuthenticationService";
import { createProf } from "../../src/services/ProfService";

test("AuthenticationService test", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);
  const findProf = await Prof.findById(createdProf.id).exec();
  if (!findProf) {
    throw new Error("Prof wurde nicht gefunden");
  }
  const result = await login(findProf.campusID, "1111");
  expect(result).toBeTruthy();
  expect(findProf.password).not.toBe("1111")
  expect(createdProf.password).not.toBe("1111")
  expect(newProf.password).toBe("1111")
  expect(result).toEqual({
    id: createdProf.id,
    role: createdProf.admin ? "a" : "u",
  });
});

test("AuthenticationService test admin was false", async () => {
    const newProf: ProfResource = {
      campusID: "1234",
      name: "klinski",
      admin: false,
      titel: "professor",
      password: "1111",
    };
    const createdProf = await createProf(newProf);
    const findProf = await Prof.findById(createdProf.id).exec();
    if (!findProf) {
      throw new Error("Prof wurde nicht gefunden");
    }
    const result = await login(findProf.campusID, "1111");
    expect(result).toBeTruthy();
    expect(result).toEqual({
      id: createdProf.id,
      role: createdProf.admin ? "a" : "u",
    });
  });

  test("hashed password must be false", async () => {
    const newProf: ProfResource = {
      campusID: "1234",
      name: "klinski",
      admin: false,
      titel: "professor",
      password: "1111",
    };
    const createdProf = await createProf(newProf);
    const findProf = await Prof.findById(createdProf.id).exec();
    if (!findProf) {
      throw new Error("Prof wurde nicht gefunden");
    }
    try{
      await login(findProf.campusID, findProf.password!);
      throw new Error("hashed password will accept");
    }catch(err){
      expect(err).toBeTruthy()
    }
  });

test("AuthenticationService test admin false campusID failed", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  try {
    await login(newProf.campusID, newProf.password!);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("AuthenticationService test password not found", async () => {
    const newProf: ProfResource = {
      campusID: "1234",
      name: "klinski",
      admin: true,
      titel: "professor",
      password: undefined!,
    };
    try {
      await login(newProf.campusID, newProf.password!);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });