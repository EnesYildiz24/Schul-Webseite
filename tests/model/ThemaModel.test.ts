import { HydratedDocument } from "mongoose";
import { IThema, Thema } from "../../src/model/ThemaModel";
import { IProf, Prof } from "../../src/model/ProfModel";
import { IGebiet, Gebiet } from "../../src/model/GebietModel";

let pilgrim: HydratedDocument<IProf>;
let Web2: HydratedDocument<IGebiet>;

beforeEach(async () => {
  pilgrim = await Prof.create({
    name: "Pilgrim",
    titel: "prof, dr",
    campusID: "123",
    password: "Web2",
    admin: true,
  });

  Web2 = await Gebiet.create({
    name: "Web1",
    beschreibung: "bla",
    public: false,
    closed: false,
    createdAt: new Date(100),
    verwalter: pilgrim._id,
  });
});

test("erstelle und rufe Gebiet auf", async () => {
  const myProfCreated = new Thema({
    titel: "Mongose",
    beschreibung: "bla mark 2",
    abschluss: "bsc",
    status: "offen",
    updatedAt: new Date(),
    betreuer: pilgrim._id,
    gebiet: Web2._id,
  });
  await myProfCreated.save();

  const myProfFound: HydratedDocument<IThema>[] = await Thema.find({
    betreuer: pilgrim._id,
  }).exec();
  expect(myProfFound.length).toBe(1);
  expect(myProfFound[0].beschreibung).toBe("bla mark 2");
  expect(myProfFound[0].abschluss).toBe("bsc");
  expect(myProfFound[0].status).toBe("offen");

  expect(myProfFound[0].toJSON()).toEqual(myProfCreated.toJSON());
});

test("update and find", async () => {
  const thema1 = new Thema({
    titel: "1",
    beschreibung: "1",
    abschluss: "bsc",
    status: "offen",
    updatedAt: new Date(),
    betreuer: pilgrim._id,
    gebiet: Web2._id,
  });
  await thema1.save();

  const t1 = await Thema.updateOne(
    { titel: "1" },
    { titel: "2", beschreibung: "2" }
  );
  expect(t1.matchedCount).toBe(1);
  expect(t1.modifiedCount).toBe(1);
  expect(t1.acknowledged).toBeTruthy();

  const t2 = await Thema.findOne({ titel: "1" }).exec();
  if (t2) {
    throw new Error("Titel nach Update trotz email change");
  }

  const t3 = await Thema.findOne({ titel: "2" }).exec();
  if (!t3) {
    throw new Error("email change not found!!!");
  }
  expect(t3.beschreibung).toBe("2");
});

test("delete user", async () => {
  const t5 = new Thema({
    titel: "5",
    beschreibung: "5",
    abschluss: "msc",
    status: "offen",
    updatedAt: new Date(),
    betreuer: pilgrim._id,
    gebiet: Web2._id,
  });
  await t5.save();
  const thema5 = await Thema.findOne({titel: "5", beschreibung: "5" }).exec();
  expect(thema5).toBeDefined();
  expect(thema5).not.toBeNull()

  await Thema.deleteOne({ titel: "5" }).exec();

  const deleted = await Thema.findOne({ betreuer: pilgrim._id, titel: "5", beschreibung: "5" }).exec();
  expect(deleted).toBeNull();
});

test("betreuer titel unique", async () => {
  const günter = new Thema({
    titel: "Web 1",
    beschreibung: "5",
    abschluss: "msc",
    status: "offen",
    updatedAt: new Date(),
    betreuer: pilgrim._id,
    gebiet: Web2._id,
  });
  await günter.save();

  const günter2 = new Thema({
    titel: "Web 1",
    beschreibung: "5",
    abschluss: "msc",
    status: "offen",
    updatedAt: new Date(),
    betreuer: pilgrim._id,
    gebiet: Web2._id,
  });
  try {
    await günter2.save();
    throw new Error("betreuer, titel duplicate save");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});
