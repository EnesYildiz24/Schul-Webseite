import { IProf, Prof, IProfMethods } from "../../src/model/ProfModel";
import {
  createProf,
  updateProf,
  deleteProf,
  getAlleProfs,
} from "../../src/services/ProfService";
import { ProfResource } from "../../src/Resources";
import { Gebiet } from "../../src/model/GebietModel";

let prof: ProfResource;

test("new Professor without passwort als rückgabe", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };

  const createdProf1 = await createProf(newProf);

  expect(createdProf1.campusID).toBeDefined();
  expect(createdProf1.name).toBe(newProf.name);
  expect((createdProf1 as any).password).not.toBeDefined();
});

test("new Professor campus id must be unique", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };

  const newProf1: ProfResource = {
    campusID: "1234",
    name: "pilgrim",
    admin: false,
    titel: "schüler",
    password: "11111",
  };
  const createdProf1 = await createProf(newProf1);

  expect(createdProf1.campusID).toBeDefined();
  expect(createdProf1.campusID).toBe(newProf.campusID);
  expect(createdProf1.name).toBe(newProf1.name);
  try {
    await createProf(newProf1);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("new Professor created failed, password misses", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
  };
  try {
    await createProf(newProf);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("UpdateOne ProfService", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const updateProf1 = {
    id: createdProf1.id, //id erforderlich beim updaten
    campusID: "1234",
    name: "pilgrim",
    admin: false,
    titel: "professor, dr",
    password: "newpassword",
  };

  const updatedProf = await updateProf(updateProf1);

  expect(updatedProf.name).toBe("pilgrim");
  expect(updatedProf.admin).toBe(false);
  expect(updatedProf.titel).toBe("professor, dr");
  expect(updatedProf.campusID).toBe("1234");
});

test("UpdateOne ProfService admin false", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const updateProf1 = {
    id: createdProf1.id,
    campusID: "1234",
    name: "pilgrim",
    admin: false,
    titel: "professor, dr",
    password: "newpassword",
  };

  const updatedProf = await updateProf(updateProf1);

  expect(updatedProf.admin).toBeFalsy();
});

test("porf id not found updateOne ProfService", async () => {
  const updateProf1: ProfResource = {
    campusID: "1234",
    name: "pilgrim",
    admin: false,
    titel: "professor, dr",
  };
  try {
    await updateProf(updateProf1);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("prof not found ProfService", async () => {
  const updateProf1: ProfResource = {
    campusID: "1234",
    name: "pilgrim",
    admin: false,
    titel: "professor, dr",
    password: "1234",
  };

  const createdProf1 = await createProf(updateProf1);

  await deleteProf(createdProf1.id!);

  const updateAgain = {
    id: createdProf1.id,
    campusID: "1234",
    name: "bla",
    admin: true,
    titel: "blabla",
    password: "blablabla",
  };

  try {
    await updateProf(updateAgain);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("deleteOne Profservice", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };

  const createdProf1 = await createProf(newProf);

  if (!createdProf1.id) {
    throw new Error("Prof has no ID");
  }
  await deleteProf(createdProf1.id);

  const deletedProf = await Prof.findById(createdProf1.id).exec();
  expect(deletedProf).toBeNull();
});

test("get all professors", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };

  const createdProf1 = await createProf(newProf);

  const newProf2: ProfResource = {
    campusID: "1235",
    name: "pilgrim",
    admin: true,
    titel: "professor, dr",
    password: "2222",
  };

  const createdProf2 = await createProf(newProf2);

  const arrProfs = await getAlleProfs();
  expect(arrProfs).toBeDefined();
  expect(arrProfs.length).toBe(2);
});

test("porf id not found updateOne ProfService", async () => {
  const emptyID = "";
  try {
    await deleteProf(emptyID);
    throw new Error("no error Throw is exist");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("non existens id updateOne ProfService", async () => {
  const randomID = "123456789012345678901234"; //muss 24 sein
  try {
    await deleteProf(randomID);
    throw new Error("no error Throw id exist in db");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("deleteOne Profservice", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const myProfCreated = new Gebiet({
    name: "Web2",
    beschreibung: "bla mark 2",
    public: false,
    closed: false,
    createdAt: new Date(100),
    verwalter: createdProf1.id,
  });
  await myProfCreated.save();

  if (!createdProf1.id) {
    throw new Error("Prof has no ID");
  }
  const beforeGebiete = await Gebiet.find({
    verwalter: createdProf1.id,
  }).exec();
  expect(beforeGebiete.length).toBe(1);
  await deleteProf(createdProf1.id);
  const deletedProf = await Prof.findById(createdProf1.id).exec();
  expect(deletedProf).toBeNull();
  const afterGebiet = await Gebiet.findById(myProfCreated.id).exec();
  expect(afterGebiet).toBeNull();
});
