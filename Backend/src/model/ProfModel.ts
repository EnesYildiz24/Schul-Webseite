import { Model, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IProf {
  name: string;
  titel?: string;
  campusID: string;
  password: string;
  admin: boolean;
}

export interface IProfMethods {
  isCorrectPassword(candidatePassword: string): Promise<boolean>;
}

export type profModel = Model<IProf, {}, IProfMethods>;

const myProfSchema = new Schema<IProf, profModel, IProfMethods>({
  name: { type: String, required: true },
  titel: String,
  campusID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

myProfSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //prüft nach änderung des passworts. keine duplicate
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
}); //der erkennt nicht wenn man den passwort auf das selbe ändert

myProfSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();
  if (update && "password" in update) {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
  }
  next();
});

myProfSchema.method(
  "isCorrectPassword",
  async function (candiatePassword: string): Promise<boolean> {
    if (!this.password || this.password.slice(0,4) !== "$2a$") {
      throw new Error("password not hashed");
    }
    return bcrypt.compare(candiatePassword, this.password);
  }
);
//INFO: die bcryopt version verwendet immer den selben bcrypt-Identifier 2a
export const Prof = model<IProf, profModel>("Prof", myProfSchema);
