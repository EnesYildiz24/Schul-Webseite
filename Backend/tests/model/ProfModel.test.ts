import { HydratedDocument } from "mongoose";
import { IProf, Prof , IProfMethods} from "../../src/model/ProfModel";

let pilgrim: HydratedDocument<IProf> & IProfMethods;

beforeEach(async () => {
  pilgrim = await Prof.create({
    name: "Pilgrim",
    titel: "prof, dr",
    campusID: "123",
    password: "Web2",
    admin: true,
  });
});

test("erstelle und rufe MyProf auf", async () => {
  const myProfCreated = new Prof({
    name: "Pilgrim",
    titel: "prof, dr",
    campusID: "12345",
    password: "Web2",
    admin: true,
  });
  await myProfCreated.save();

  const myProfFound: HydratedDocument<IProf>[] = await Prof.find({
    campusID: "12345",
  }).exec();
  expect(myProfFound.length).toBe(1);
  expect(myProfFound[0].name).toBe("Pilgrim");
  expect(myProfFound[0].admin).toBe(true);
  expect(myProfFound[0].campusID).toBe("12345");

  expect(myProfFound[0].toJSON()).toEqual(myProfCreated.toJSON());
});

test("Duplicate campusID with try/catch", async () => {
  const savedUser = await pilgrim.save();
  expect(savedUser).toBeDefined();

  const user2 = new Prof({
    name: "klinski",
    titel: "prof, dr, dr",
    campusID: "123",
    password: "Web2.2",
    admin: true,
  });

  try {
    await user2.save();
    throw new Error("User 2 saved, but should not");
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test("isCorrectPassword with saved user", async () => {
  const user = new Prof(pilgrim);
  expect(user).toBeDefined();
  expect(user.name).toBe(pilgrim.name);

  await user.save();

  expect(await user.isCorrectPassword(pilgrim.password)).toBeTruthy();
  expect(await user.isCorrectPassword("Another password")).toBeFalsy();
  expect(await user.isCorrectPassword(user.password)).toBeFalsy();
});

test("passwort not double hashed", async () => {
  const user = await pilgrim.save();
  await user.save();
  const hashedPassword = user.password;
  await user.save();
  expect(user.password).toBe(hashedPassword);
  user.password = "Web2"; //TODO: erkennt die änderung aber nicht den inhalt
  await user.save();
  expect(user.password).not.toBe(hashedPassword);
});

test("passwort save richtig?", async () => {
  const user = await pilgrim.save();
  const sameUser = await user.isCorrectPassword("Web2");
  expect(sameUser).toBeTruthy();
  const notSameUser = await user.isCorrectPassword("Web1");
  expect(notSameUser).toBeFalsy();
});

test("update and find", async () => {

  const t1 = await Prof.updateOne(
    { campusID: "123" },
    { password: "Web3", name: "klinski" }
  );

  expect(t1.matchedCount).toBe(1);
  expect(t1.modifiedCount).toBe(1);
  expect(t1.acknowledged).toBeTruthy();

  const t2 = await Prof.findOne({ password: "1" }).exec();
  if (t2) {
    throw new Error("Titel nach Update trotz email change");
  }

  const t3 = await Prof.findOne({ name: "klinski" }).exec();
  if (!t3) {
    throw new Error("titel Change not found");
  }
  expect(t3.name).toBe("klinski");
});


test("passwort hashed?", async () => {
  const user = new Prof({
    name: "test",
    campusID: "12344",
    password: "testweb",
  });
  expect(user.isCorrectPassword("irrelevat")).rejects.toThrowError("password not hashed");
});
