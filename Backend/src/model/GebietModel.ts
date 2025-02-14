import { Schema, model, Types } from "mongoose";

export interface IGebiet {
  name: string;
  beschreibung?: string;
  public?: boolean;
  closed?: boolean;
  createdAt?: Date;
  verwalter: Types.ObjectId;
}

const myGebietSchema = new Schema<IGebiet>(
  {
    name: { type: String, required: true },
    beschreibung: String,
    public: { type: Boolean, default: false },
    closed: { type: Boolean, default: false },
    verwalter: { type: Schema.Types.ObjectId, ref: "Prof", required: true },
  },
  { timestamps: true }
);

export const Gebiet = model<IGebiet>("Gebiet", myGebietSchema);
