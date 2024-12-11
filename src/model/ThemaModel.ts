import { Schema, model, Types } from "mongoose";

export interface IThema {
  titel: string;
  beschreibung: string;
  abschluss: "bsc" | "msc" | "any";
  status: "offen" | "reserviert";
  updatedAt?: Date;
  gebiet: Types.ObjectId;
  betreuer: Types.ObjectId;
}

const myThemaSchema = new Schema<IThema>(
  {
    titel: { type: String, required: true },
    beschreibung: { type: String, required: true },
    abschluss: { type: String, enum: ["bsc", "msc", "any"], default: "any" },
    status: { type: String, enum: ["offen", "reserviert"], default: "offen" },
    gebiet: { type: Schema.Types.ObjectId, ref: "Gebiet", required: true },
    betreuer: { type: Schema.Types.ObjectId, ref: "Prof", required: true },
  },
  { timestamps: true }
);
// myThemaSchema.index({ betreuer: 1, titel: 1 }, { unique: true });

export const Thema = model<IThema>("Thema", myThemaSchema);
