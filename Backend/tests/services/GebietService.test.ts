import {
  getAlleGebiete,
  createGebiet,
  getGebiet,
  updateGebiet,
  deleteGebiet,
} from "../../src/services/GebietService";
import { createProf } from "../../src/services/ProfService";
import { GebietResource, ProfResource, ThemaResource } from "../../src/Resources";
import { Gebiet } from "../../src/model/GebietModel";
import { Thema } from "../../src/model/ThemaModel";
import { createThema } from "../../src/services/ThemaService";
import { Prof } from "../../src/model/ProfModel";

let gebiet: GebietResource;

test("get all professors", async () => {
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
    verwalterName: "klinski",
  };

  const createdGebiet1 = await createGebiet(newGebiet1);
  const newGebiet2: GebietResource = {
    name: "pilgrim",
    public: false,
    beschreibung: "web engineering2",
    verwalter: createdProf.id!,
  };

  const createdGebiet2 = await createGebiet(newGebiet2);

  const newThema1: ThemaResource = {
    titel: "Mongosee",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet1.id!,
  };
  const createdThema1 = await createThema(newThema1);

  const arrGebiet = await getAlleGebiete();
  expect(arrGebiet).toBeDefined();
  expect(arrGebiet.length).toBe(1);
  expect(arrGebiet[0].verwalterName).toBe("klinski");
  let count = 0
  for(let i = 0; i < arrGebiet.length; i++){
    if(arrGebiet[i].anzahlThemen){
      count++
    }
    expect(count).toBe(1)
  }
});

test("get all professors", async () => {
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
    verwalterName: "klinski",
  };

  const createdGebiet1 = await createGebiet(newGebiet1);
  const newGebiet2: GebietResource = {
    name: "pilgrim",
    public: false,
    beschreibung: "web engineering2",
    verwalter: createdProf.id!,
  };

  const createdGebiet2 = await createGebiet(newGebiet2);

  const arrGebiet = await getAlleGebiete();
  expect(arrGebiet).toBeDefined();
  expect(arrGebiet.length).toBe(1);
  expect(arrGebiet[0].verwalterName).toBe("klinski");
  expect(arrGebiet[0].anzahlThemen).toBe(0)
});

test("get all professors", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: false,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: false,
    beschreibung: "web engineering",
    verwalter: createdProf.id!,
  };

  const createdGebiet1 = await createGebiet(newGebiet1);
  const newGebiet2: GebietResource = {
    name: "pilgrim",
    public: false,
    beschreibung: "web engineering2",
    verwalter: createdProf.id!,
    verwalterName: "klinski",
  };

  const createdGebiet2 = await createGebiet(newGebiet2);

  const arrGebiet = await getAlleGebiete(createdProf.id);
  expect(arrGebiet).toBeDefined()
  expect(arrGebiet.length).toBe(2)

});


test("get one professors wrong id", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf = await createProf(newProf);

  const errGebiet: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalterName:"klinski",
    verwalter: createdProf.id!,
  };
  const createdErrGebiet = await createGebiet(errGebiet);
  const arrErrGebiet = await getGebiet(createdErrGebiet.id!);
  expect(arrErrGebiet.anzahlThemen).toBe(0)

  const newGebiet: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalterName:"klinski",
    verwalter: createdProf.id!,
  };
  const createdGebiet = await createGebiet(newGebiet);

  const newThema1: ThemaResource = {
    titel: "Mongosee",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf.id!,
    gebiet: createdGebiet.id!,
  };
  const createdThema1 = await createThema(newThema1);

  const arrGebiet = await getGebiet(createdGebiet.id!);
  expect(arrGebiet).toBeDefined();
  expect(arrGebiet.verwalterName).toBe("klinski")
  const randomID = "123456789012345678901234";
  try {
    const gebiet = await getGebiet(randomID);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});


test("new Gebiet created", async () => {
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

  expect(createdGebiet1.verwalter).toBeDefined();
  expect(createdGebiet1.name).toBe(newGebiet1.name);
  expect((createdGebiet1 as any).password).not.toBeDefined(); //keine ahnung ob das was bringt. hat halt nichts mit passwort zu tuhen
});

test("new Gebiet created with no ressource", async () => {
  const newGebiet1: GebietResource = {
    name: undefined!,
    verwalter: undefined!,
  };

  try{
    await createGebiet(newGebiet1);
    throw new Error("ressource erstellt aber sollte nicht")
  }catch(err){
    expect(err).toBeTruthy()
  }
});

test("new Gebiet created with no verwalterID", async () => {

  const newGebiet1: GebietResource = {
    name: "klinski",
    public: true,
    beschreibung: "web engineering",
    verwalter: "123456789012345678901234",
  };

  try{
    await createGebiet(newGebiet1);
    throw new Error("ressource erstellt aber sollte nicht")
  }catch(err){
    expect(err).toBeTruthy()
  }
});

test("new Gebiet created", async () => {
  try {
    const newProf: ProfResource = {
      campusID: "1234",
      name: "klinski",
      admin: true,
      titel: "professor",
      password: "1111",
    };
    const createdProf = await createProf(newProf);

    const newGebiet1: GebietResource = {
      name: undefined!,
      public: undefined!,
      beschreibung: "web engineering",
      verwalter: createdProf.id!,
    };

    await createGebiet(newGebiet1);
    throw new Error("gebiet was created but it shouldnt");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("UpdateOne GebietService", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const createdGebiet = {
    name: "pilgtim",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf1.id!,
    anzahlThemen: 1
  };
  const creatgebiet = await createGebiet(createdGebiet);

  const updatedGebiet = {
    id: creatgebiet.id!,
    name: "pilgrim jr",
    anzahlThemen: 0,
    public: false,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };
  const updatedGebiet1 = await updateGebiet(updatedGebiet);

  const newThema1: ThemaResource = {
    titel: "Mongosee",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf1.id!,
    gebiet: creatgebiet.id!,
  };
  const createdThema1 = await createThema(newThema1);

  
  expect(updatedGebiet1.name).toBe("pilgrim jr");
  expect(updatedGebiet1.public).toBe(false);
  expect(updatedGebiet1.beschreibung).toBe("web engineering"); //soll nicht ändern weil anforderungen
  const arrGebiet = await getAlleGebiete();
  let count = 0
  for(let i = 0; i < arrGebiet.length; i++){
    if(arrGebiet[i].anzahlThemen){
      count++
    }
    expect(count).toBe(1)
  }
});

test("UpdateOne GebietService anzahl themen", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const createdGebiet = {
    name: "pilgtim",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf1.id!,
    anzahlThemen: 1
  };
  const creatgebiet = await createGebiet(createdGebiet);

  const updatedGebiet = {
    id: creatgebiet.id!,
    name: "pilgrim jr",
    anzahlThemen: 0,
    public: false,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };
  const updatedGebiet1 = await updateGebiet(updatedGebiet);

  const newThema1: ThemaResource = {
    titel: "Mongosee",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf1.id!,
    gebiet: creatgebiet.id!,
  };
  const createdThema1 = await createThema(newThema1);


  const updatedGebiet2 = {
    id: creatgebiet.id!,
    name: "pilgrim jr",
    anzahlThemen: 0,
    public: false,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };
  const updatedGebiet4 = await updateGebiet(updatedGebiet2);

  expect(updatedGebiet4.anzahlThemen).toBe(1)
});


test("UpdateOne GebietService id missing", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const updatedGebiet = {
    name: "pilgrim jr",
    public: false,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };
  try {
    await updateGebiet(updatedGebiet);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("UpdateOne GebietService gebiet missing", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const updatedGebiet = {
    name: "pilgrim jr",
    public: false,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };

  const creatgebiet = await createGebiet(updatedGebiet);

  await deleteGebiet(creatgebiet.id!);

  const updatedGebiet1 = {
    id: creatgebiet.id!,
    name: "pilgrim jr",
    public: false,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };

  const creatgebiet1 = await createGebiet(updatedGebiet);

  try {
    await updateGebiet(creatgebiet1);
    throw new Error("error was expected");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("UpdateOne GebietService non exist id", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const updatedGebiet = {
    id: "123456789012345678901234",
    name: "pilgrim jr",
    public: false,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };

  try {
    await updateGebiet(updatedGebiet);
    throw new Error("error was expected");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("deleteOne GebietService", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const createdGebiet1 = {
    name: "web22",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf1.id!,
  };
  const createdGebiet = await createGebiet(createdGebiet1);

  if (!createdGebiet.id) {
    throw new Error("Gebiet has no ID");
  }

  const createdThema = new Thema({
    titel: "Mongose",
    beschreibung: "bla mark 2",
    abschluss: "bsc",
    status: "reserviert",
    updatedAt: new Date(),
    betreuer: createdProf1.id,
    gebiet: createdGebiet.id,
  });
  await createdThema.save();

  if (!createdThema.id) {
    throw new Error("Thema has no ID");
  }
  const beforeThemen = await Thema.find({
    status: "reserviert",
    gebiet: createdGebiet.id,
  }).exec();
  expect(beforeThemen.length).toBe(1);
  await deleteGebiet(createdGebiet.id!);
  const deletedGebiet = await Gebiet.findById(createdGebiet.id).exec();
  expect(deletedGebiet).toBeNull();
  // const deletedThema = await Thema.findById(createdThema.id).exec();
  // expect(deletedThema).toBeNull();
});

test("deleteOne GebietService with status offen", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const createdGebiet1 = {
    name: "web22",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf1.id!,
  };
  const createdGebiet = await createGebiet(createdGebiet1);

  if (!createdGebiet.id) {
    throw new Error("Gebiet has no ID");
  }

  const createdThema = new Thema({
    titel: "Mongose",
    beschreibung: "bla mark 2",
    abschluss: "bsc",
    status: "offen",
    updatedAt: new Date(),
    betreuer: createdProf1.id,
    gebiet: createdGebiet.id,
  });
  await createdThema.save();

  if (!createdThema.id) {
    throw new Error("Thema has no ID");
  }
  const beforeThemen = await Thema.find({
    status: "offen",
    gebiet: createdGebiet.id,
  }).exec();
  expect(beforeThemen.length).toBe(1);
  try {
    await deleteGebiet(createdGebiet.id!);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("deleteGebiet keine id", async () => {
  try {
    await deleteGebiet("");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("erfunde id deleteGebiet", async () => {
  const randomID = "123456789012345678901234";
  try {
    await deleteGebiet(randomID);
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("UpdateOne GebietService länge", async () => {
  const newProf: ProfResource = {
    campusID: "1234",
    name: "klinski",
    admin: true,
    titel: "professor",
    password: "1111",
  };
  const createdProf1 = await createProf(newProf);

  const createdGebiet = {
    name: "pilgtim",
    public: true,
    beschreibung: "web engineering",
    verwalter: createdProf1.id!,
  };
  const creatgebiet = await createGebiet(createdGebiet);

  const newThema: ThemaResource = {
    titel: "Mongosee",
    beschreibung: "bla",
    abschluss: "bsc",
    status: "offen",
    betreuer: createdProf1.id!,
    gebiet: creatgebiet.id!,
  };
   await createThema(newThema);

   const updatedGebiet = {
    id: creatgebiet.id!,
    name: "pilgrim jr",
    public: true,
    beschreibung: "web engineering 2",
    verwalter: createdProf1.id!,
  };
  const updatedGebiet1 = await updateGebiet(updatedGebiet);


  expect(updatedGebiet1.anzahlThemen).toBe(1)
});
