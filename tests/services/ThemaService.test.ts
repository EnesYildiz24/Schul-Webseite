import { Types } from "mongoose";
import {
  GebietResource,
  ProfResource,
  ThemaResource,
} from "../../src/Resources";
import { createGebiet } from "../../src/services/GebietService";
import { createProf, deleteProf } from "../../src/services/ProfService";
import {
  createThema,
  deleteThema,
  getAlleThemen,
  getThema,
  updateThema,
} from "../../src/services/ThemaService";

let gebiet: GebietResource;

test("get all Themen", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
    verwalterName: "klinksi",
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const newThema1: ThemaResource = {
    titel: "Mongosee",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema1 = await createThema(newThema1);

  const arrThemen = await getAlleThemen(createdGebiet1.id!);
  expect(arrThemen).toBeDefined();
  expect(arrThemen.length).toBe(2);
  expect(arrThemen[0].betreuerName).toBe("klinski");
});

test("get all Themen miss id", async () => {
  try {
    await getAlleThemen(undefined!);
    throw new Error("themen gefunden aber sollte nicht sein");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("get all Themen wrong id", async () => {
  try {
    await getAlleThemen("123456789012345678901234");
    throw new Error("themen gefunden aber sollte nicht sein");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("get all Themen", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const arrThemen = await getThema(createdThema.id!);
  expect(arrThemen).toBeDefined();
});

test("get all Themen gebiet closed", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
    closed: true,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  try {
    await createThema(newThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("get all Themen gebiet closed", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
    closed: false,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: undefined!,
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  try {
    await createThema(newThema);
    throw new Error("should throw a error");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("get all Themen with wrong gebiet", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: "123456789012345678901234",
  };
  try {
    await createThema(newThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("get all Themen without right betreuer", async () => {
  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: "123456789012345678901234",
    gebiet: "123456789012345678901234",
  };
  try {
    await createThema(newThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("get all Themen with no gebiedID", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: undefined!,
  };

  try {
    await createThema(newThema);
    throw new Error("find gebiet but shouldnt");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("test one with no id", async () => {
  try {
    await getThema(undefined!);
    throw new Error("should not be here");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("delete one test one with no id", async () => {
  try {
    await deleteThema(undefined!);
    throw new Error("should not be here");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("created test fail", async () => {
  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: undefined!,
    gebiet: undefined!,
  };
  try {
    const createdThema = await createThema(newThema);
    throw new Error("should not be here");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("update all Themen", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const updatedThema: ThemaResource = {
    id: createdThema.id,
    titel: "Mongosee",
    beschreibung: "blabla",
    abschluss: "msc",
    status: "reserviert",
    betreuer: createdProf.id!,
    gebiet: "123456789012345678901234",
  };
  const updated1Theme = await updateThema(updatedThema);
  expect(updated1Theme.titel).toBe("Mongosee");
  expect(updated1Theme.beschreibung).toBe("blabla");
  expect(updated1Theme.abschluss).toBe("msc");
  expect(updated1Theme.betreuer).toBe(createdProf.id);
  expect(updated1Theme.gebiet).toBe(createdGebiet1.id);
});

test("update all Themen", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const updatedThema: ThemaResource = {
    id: createdThema.id,
    titel: "Mongosee",
    beschreibung: "blabla",
    abschluss: "msc",
    status: "reserviert",
    betreuer: "123456789012345678901234",
    gebiet: "123456789012345678901234",
  };
  try {
    await updateThema(updatedThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("update all Themen", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const updatedThema: ThemaResource = {
    id: createdThema.id,
    titel: "Mongosee",
    beschreibung: "blabla",
    abschluss: "msc",
    status: "reserviert",
    betreuer: createdProf.id!,
    gebiet: "123456789012345678901234",
    betreuerName: createdProf.name,
  };
  const updated1Theme = await updateThema(updatedThema);

  const updatedThema2: ThemaResource = {
    id: createdThema.id,
    titel: "Mongosee",
    beschreibung: "blabla",
    abschluss: "msc",
    status: "reserviert",
    betreuer: createdProf.id!,
    gebiet: "123456789012345678901234",
    betreuerName: "jünter",
  };
  const updated2Theme = await updateThema(updatedThema2);

  expect(updated2Theme.titel).toBe("Mongosee");
  expect(updated2Theme.beschreibung).toBe("blabla");
  expect(updated2Theme.abschluss).toBe("msc");
  expect(updated2Theme.betreuer).toBe(createdProf.id);
  expect(updated2Theme.gebiet).toBe(createdGebiet1.id);
  expect(updated2Theme.betreuerName).toBe(createdProf.name);
  expect(updated2Theme.id).toBeDefined()
});

test("update all Themen ohne id betreuer", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const updatedThema: ThemaResource = {
    titel: "Mongosee",
    beschreibung: "blabla",
    abschluss: "msc",
    status: "reserviert",
    betreuer: "123456789012345678901234",
    gebiet: "123456789012345678901234",
  };
  try {
    await updateThema(updatedThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("update all Themen with double theme", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!, // Gebiet ist identisch
  };

  // Erstes Thema erstellen
  const createdThema = await createThema(newThema);

  // Versuch, ein doppeltes Thema mit genau denselben Werten zu erstellen
  const duplicateThema: ThemaResource = {
    titel: "Mongose", 
    beschreibung: "blabla", 
    abschluss: "msc",
    status: "reserviert",
    betreuer: createdProf.id!, // Gleicher Betreuer
    gebiet: createdGebiet1.id!, // Gleiches Gebiet
  };

  try {
    const createdThema2 = await createThema(duplicateThema);
    throw new Error("Duplicate Thema was created but should not have been!");
  } catch (err) {
    // Jetzt sollte ein Fehler geworfen werden
    expect(err).toBeTruthy();
  }
});



test("update all Themen ohne id betreuer", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };

  const createdThema1 = await createThema(newThema);

  deleteProf(createdProf.id!);

  const updatedThema: ThemaResource = {
    id: createdThema1.id!,
    titel: "Mongosee",
    beschreibung: "blabla",
    abschluss: "msc",
    status: "reserviert",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };

  try {
    await updateThema(updatedThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("Update Thema id not found", async () => {
  const updatedThema: ThemaResource = {
    id: "123456789012345678901234",
    titel: "Nicht vorhandenes Thema",
    beschreibung: "Dies sollte einen Fehler werfen",
    abschluss: "bsc",
    status: "offen",
    betreuer: "123456789012345678901234",
    gebiet: "123456789012345678901234",
  };

  try {
    await updateThema(updatedThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("erfunde id deleteTheme", async () => {
  const randomID = "123456789012345678901234";
  try {
    await deleteThema(randomID);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("update all Themen should save if nicht gültig", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const updatedThema: ThemaResource = {
    id: createdThema.id!,
    titel: "Mongose",
    beschreibung: "blabla",
    abschluss: "sss"!,
    status: "bla",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const updatedTheme2 = await updateThema(updatedThema);
  expect(updatedTheme2.abschluss).toBe("bsc");
  expect(updatedTheme2.status).toBe("offen");
});

test("update all Themen should save if nicht gültig", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);

  const newThema: ThemaResource = {
    titel: "Mongose",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema = await createThema(newThema);

  const updatedThema: ThemaResource = {
    id: createdThema.id!,
    titel: "Mongose",
    beschreibung: "blabla",
    abschluss: "sss"!,
    status: "bla",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  try {
    await updateThema(updatedThema);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});
