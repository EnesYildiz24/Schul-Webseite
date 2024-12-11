import { Types } from "mongoose";
import { Gebiet } from "../model/GebietModel";
import { GebietResource } from "../Resources";
import { logger } from "../logger";
import { Thema } from "../model/ThemaModel";
import { deleteThema } from "./ThemaService";
import { Prof } from "../model/ProfModel";
import { dateToString } from "./ServiceHelper";

/**
 * Gibt alle Gebiete zurück, die für einen Prof sichtbar sind. Dies sind:
 * - alle öffentlichen (public) Gebiete
 * - alle eigenen Gebiete, dies ist natürlich nur möglich, wenn die profId angegeben ist.
 */
export async function getAlleGebiete(
  profId?: string
): Promise<GebietResource[]> {
  const filter = profId
  ? { $or: [{ public: false, verwalter: profId }, { public: true }] }
  : { public: true };

  const arrGebiet = await Gebiet.find(filter).exec();
  const arrGebietRes = await Promise.all(
    arrGebiet.map(async (gebiet) => {
      const betreuerProf = await Prof.findById(gebiet.verwalter).exec();
      const anzahlThemen = await Thema.countDocuments({
        gebiet: gebiet._id,
      }).exec();
      return {
        name: gebiet.name,
        id: gebiet._id?.toString(),
        beschreibung: gebiet.beschreibung?.toString(),
        public: gebiet?.public,
        closed: gebiet?.closed,
        verwalterName: betreuerProf?.name,
        verwalter: gebiet.verwalter.toString(),
        createdAt: dateToString(gebiet.createdAt!),
        anzahlThemen: anzahlThemen > 0 ? anzahlThemen : 0,
      };
    })
  );
  return arrGebietRes;
}

/**
 * Liefert das Gebiet mit angegebener ID.
 * Falls kein Gebiet gefunden wurde, wird ein Fehler geworfen.
 */
export async function getGebiet(id: string): Promise<GebietResource> {
  const gebiet = await Gebiet.findById(id).exec();

  if (!gebiet) {
    throw new Error("gebiet nicht gefunden");
  }
  const betreuerProf = await Prof.findById(gebiet.verwalter).exec();
  const anzahlThemen = await Thema.countDocuments({
    gebiet: gebiet._id,
  }).exec();

  return {
    name: gebiet.name,
    id: gebiet._id?.toString(),
    beschreibung: gebiet?.beschreibung,
    verwalterName: betreuerProf?.name,
    public: gebiet?.public,
    closed: gebiet?.closed,
    verwalter: gebiet.verwalter.toString(),
    createdAt: dateToString(gebiet.createdAt!),
    anzahlThemen: anzahlThemen > 0 ? anzahlThemen : 0,
  };
}

/**
 * Erzeugt das Gebiet.
 */
export async function createGebiet(
  gebietResource: GebietResource
): Promise<GebietResource> {
  if (!gebietResource.verwalter) {
    throw new Error("falsche verwalter");
  }

  const verwalter = await Prof.findById(gebietResource.verwalter).exec();
  if (!verwalter) {
    throw new Error("falsche verwalterid");
  }

  try {
    const gebiet = await Gebiet.create({
      name: gebietResource.name,
      beschreibung: gebietResource.beschreibung,
      public: gebietResource.public,
      closed: gebietResource.closed,
      createdAt: new Date(),
      verwalter: gebietResource.verwalter,
      anzahlThemen: gebietResource.anzahlThemen,
      verwalterName: gebietResource.verwalterName,
    });
    return {
      id: gebiet?._id.toString(),
      name: gebiet.name,
      beschreibung: gebiet?.beschreibung,
      public: gebiet?.public,
      closed: gebiet?.closed,
      createdAt: gebiet.createdAt?.toString(),
      verwalter: gebiet.verwalter.toString(),
      verwalterName: verwalter.name,
      anzahlThemen: 0,
    };
  } catch (err) {
    logger.error("gebiet konnte nicht erstellt werden");
    throw new Error("gebiet created failed");
  }
}

/**
 * Ändert die Daten eines Gebiets.
 * Aktuell können nur folgende Daten geändert werden: name, public, closed.
 * Falls andere Daten geändert werden, wird dies ignoriert.
 */
export async function updateGebiet(
  gebietResource: GebietResource
): Promise<GebietResource> {
  if (!gebietResource.id) {
    throw new Error("Gebiet id missing, cannot update");
  }
  const gebiet = await Gebiet.findById(gebietResource.id).exec();
  if (!gebiet) {
    throw new Error(
      `No Gebiet with id ${gebietResource.id} found, cannot update`
    );
  }
  const anzahlThemen = await Thema.countDocuments({
    gebiet: gebiet._id,
  }).exec();
  const betreuerProf = await Prof.findById(gebiet.verwalter).exec();

  const oldName = gebiet.name;
  const oldPublic = gebiet.public;
  const oldClosed = gebiet.closed;

  gebiet.name = gebietResource.name;
  if (gebietResource.public !== undefined)
    gebiet.public = gebietResource.public;
  if (gebietResource.closed !== undefined)
    gebiet.closed = gebietResource.closed;

  const updated =
    gebiet.name !== oldName ||
    gebiet.public !== oldPublic ||
    gebiet.closed !== oldClosed;

  if (updated) {
    const saveGebiet = await gebiet.save();
    return {
      id: gebiet?.id,
      name: saveGebiet.name,
      beschreibung: gebiet?.beschreibung,
      public: saveGebiet?.public,
      verwalterName: betreuerProf?.name,
      closed: saveGebiet?.closed,
      verwalter: gebiet.verwalter.toString(),
      anzahlThemen: anzahlThemen > 0 ? anzahlThemen : 0,
      createdAt: dateToString(saveGebiet.createdAt!),
    };
  } else {
    return {
      id: gebiet?.id,
      name: gebiet.name,
      beschreibung: gebiet?.beschreibung,
      public: gebiet?.public,
      verwalterName: betreuerProf?.name,
      closed: gebiet?.closed,
      verwalter: gebiet.verwalter.toString(),
      anzahlThemen: anzahlThemen > 0 ? anzahlThemen : 0,
      createdAt: dateToString(gebiet.createdAt!),
    };
  }
}
/**
 * Beim Löschen wird das Gebiet über die ID identifiziert.
 * Falls ein Gebiet nicht gefunden wurde, oder ein dazugehöriges Thema noch offen ist
 * (oder aus anderen Gründen nicht gelöscht werden kann) wird ein Fehler geworfen.
 */
export async function deleteGebiet(id: string): Promise<void> {
  if (!id) {
    throw new Error("No id given, cannot delete Gebiet.");
  }
  const gebietId = new Types.ObjectId(id);
  const offeneThemen = await Thema.find({
    status: "offen",
    gebiet: gebietId,
  }).exec();
  if (offeneThemen.length > 0) {
    throw new Error(`Cannot delete Gebiet with open Themen.`);
  }
  await Thema.deleteMany({ gebiet: gebietId }).exec();

  const res = await Gebiet.deleteOne({ _id: gebietId }).exec();
  if (res.deletedCount !== 1) {
    throw new Error(`No gebiet with id ${id} deleted, probably id not valid`);
  }
}
