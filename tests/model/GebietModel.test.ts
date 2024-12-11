import { HydratedDocument } from "mongoose";
import { IGebiet, Gebiet } from "../../src/model/GebietModel";
import { IProf, Prof } from "../../src/model/ProfModel";

let Web2: HydratedDocument<IGebiet>;
let pilgrim: HydratedDocument<IProf>;

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
  const myProfCreated = new Gebiet({
    name: "Web2",
    beschreibung: "bla mark 2",
    public: false,
    closed: false,
    createdAt: new Date(100),
    verwalter: pilgrim._id,
  });
  await myProfCreated.save();

  const myProfFound: HydratedDocument<IGebiet>[] = await Gebiet.find({
    name: "Web2",
  }).exec();
  expect(myProfFound.length).toBe(1);
  expect(myProfFound[0].beschreibung).toBe("bla mark 2");
  expect(myProfFound[0].public).toBe(false);
  expect(myProfFound[0].closed).toBe(false);
  expect(myProfFound[0].createdAt?.getTime()).toBe(100);

  expect(myProfFound[0].toJSON()).toEqual(myProfCreated.toJSON());
});

test("delete user", async () => {
  const myProfCreated2 = new Gebiet({
    name: "Web1",
    beschreibung: "bla mark 3",
    public: false,
    closed: false,
    createdAt: new Date(100),
    verwalter: pilgrim._id,
  });
  await myProfCreated2.save();
  const delet = await Gebiet.findOne({
    verwalter: pilgrim._id,
    name: "Web1",
    beschreibung: "bla mark 3",
  }).exec();
  expect(delet).toBeDefined();
  expect(delet).not.toBeNull();

  await Gebiet.deleteOne({
    verwalter: pilgrim._id,
    name: "Web1",
    beschreibung: "bla mark 3",
  }).exec();

  const deleted = await Gebiet.findOne({
    verwalter: pilgrim._id,
    name: "Web1",
    beschreibung: "bla mark 3",
  }).exec();
  expect(deleted).toBeNull();
});
