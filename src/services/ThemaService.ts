import { title } from "process";
import { Gebiet } from "../model/GebietModel";
import { ThemaResource } from "../Resources";
import { Thema } from "../model/ThemaModel";
import { logger } from "../logger";
import { Types } from "mongoose";
import { Prof } from "../model/ProfModel";
import { dateToString } from "./ServiceHelper";

/**
 * Gibt alle Themen in einem Gebiet zurück.
 * Wenn das Gebiet nicht gefunden wurde, wird ein Fehler geworfen.
 */
export async function getAlleThemen(
  gebietId: string
): Promise<ThemaResource[]> {
  if (!gebietId) {
    throw new Error("not gebiet found in getAlleThemen");
  }

  const gebiet = await Gebiet.findById(gebietId).exec();
  if (!gebiet) {
    throw new Error("kein gebiet bei getAlleThemen");
  }
  const allGebiet = await Thema.find({
    gebiet: new Types.ObjectId(gebietId),
  }).exec();
  const allGebietRes = await Promise.all(
    allGebiet.map(async (thema) => {
      const betreuerProf = await Prof.findById(thema.betreuer).exec();
      return {
        id: thema._id.toString(),
        titel: thema.titel,
        betreuerName: betreuerProf?.name,
        beschreibung: thema.beschreibung,
        abschluss: thema.abschluss,
        status: thema?.status,
        betreuer: thema.betreuer.toString(),
        gebiet: thema.gebiet.toString(),
        updatedAt: dateToString(thema.updatedAt!),
      };
    })
  );
  return allGebietRes;
}

/**
 * Liefert die ThemaResource mit angegebener ID.
 * Falls kein Thema gefunden wurde, wird ein Fehler geworfen.
 */
export async function getThema(id: string): Promise<ThemaResource> {
  const alleThemen = await Thema.find();
  const thema = await Thema.findById(id).exec();
  if (!thema) {
    throw new Error("Thema nicht gefunden");
  }
  const betreuerProf = await Prof.findById(thema.betreuer).exec();
  return {
    id: thema._id.toString(),
    titel: thema.titel,
    beschreibung: thema.beschreibung,
    abschluss: thema.abschluss,
    status: thema?.status,
    betreuerName: betreuerProf?.name,
    betreuer: thema.betreuer.toString(),
    gebiet: thema.gebiet.toString(),
    updatedAt: dateToString(thema.updatedAt!),
  };
}

/**
 * Erzeugt ein Thema.
 * Daten, die berechnet werden aber in der gegebenen Ressource gesetzt sind, werden ignoriert.
 * Falls die Liste geschlossen (closed) ist, wird ein Fehler wird geworfen.
 */
export async function createThema(
  themaResource: ThemaResource
): Promise<ThemaResource> {
  if (!themaResource.betreuer) {
    throw new Error("kein betreuer");
  }
  if (!themaResource.gebiet) {
    throw new Error("kein gebiet");
  }
  const betreuerProf = await Prof.findById(themaResource.betreuer).exec();
  if (!betreuerProf) {
    throw new Error("Der angegebene Betreuer existiert nicht.");
  }
  const gebiet = await Gebiet.findById(themaResource.gebiet).exec();
  if (!gebiet) {
    throw new Error("kein gebiet");
  }
  if (gebiet.closed) {
    throw new Error("gebiet closed");
  }
  try {
    const thema = await Thema.create({
      titel: themaResource.titel,
      beschreibung: themaResource.beschreibung,
      abschluss: themaResource.abschluss,
      status: themaResource.status,
      betreuer: themaResource.betreuer,
      gebiet: themaResource.gebiet,
      betreuerName: themaResource.betreuerName,
      updatedAt: new Date(),
    });
    return {
      id: thema?._id.toString(),
      titel: thema.titel,
      beschreibung: thema.beschreibung,
      abschluss: thema?.abschluss,
      status: thema?.status,
      betreuer: thema.betreuer.toString(),
      gebiet: thema.gebiet.toString(),
      updatedAt: dateToString(thema.updatedAt!),
      betreuerName: betreuerProf?.name,
    };
  } catch (err) {
    logger.error(`Thema konnte nicht erstellt werden: ${err}`);
    throw new Error("thema created failed");
  }
}

/**
 * Updated ein Thema. Es können nur Titel, Beschreibung, Abschluss und Status geändert werden.
 * Aktuell können Themen nicht von einem Gebiet in ein anderes verschoben werden.
 * Auch kann der Betreuer nicht geändert werden.
 * Falls das Gebiet oder Betreuer geändert wurde, wird dies ignoriert.
 */
export async function updateThema(
  themaResource: ThemaResource
): Promise<ThemaResource> {
  if (!themaResource.id) {
    throw new Error("Thema id missing, cannot update");
  }
  const thema = await Thema.findById(themaResource.id).exec();
  if (!thema) {
    throw new Error(
      `No Thema with id ${themaResource.id} found, cannot update`
    );
  }
  const betreuerProf = await Prof.findById(thema.betreuer).exec();
  if (!betreuerProf) {
    throw new Error("kein betreuer gefunden mit namen");
  }

  if (
    themaResource.betreuer &&
    themaResource.betreuer !== thema.betreuer.toString()
  ) {
    throw new Error("Betreuer kann nicht geändert werden.");
  }

  const oldTitel = thema.titel;
  const oldBeschreibung = thema.beschreibung;
  const oldAbschluss = thema.abschluss;
  const oldStatus = thema.status;

  thema.titel = themaResource.titel;
  thema.beschreibung = themaResource.beschreibung;
  if (
    themaResource.abschluss === "bsc" ||
    themaResource.abschluss === "msc" ||
    themaResource.abschluss === "any"
  ) {
    thema.abschluss = themaResource.abschluss;
  }
  if (themaResource.status === "offen" || themaResource.status === "reserviert")
    thema.status = themaResource.status;

  const updated =
    thema.titel !== oldTitel ||
    thema.beschreibung !== oldBeschreibung ||
    thema.abschluss !== oldAbschluss ||
    thema.status !== oldStatus;

  if (updated) {
    const saveThema = await thema.save();
    return {
      id: thema.id,
      titel: saveThema.titel,
      beschreibung: saveThema.beschreibung,
      abschluss: saveThema.abschluss,
      status: saveThema.status,
      betreuerName: betreuerProf.name,
      betreuer: thema.betreuer.toString(),
      gebiet: thema.gebiet.toString(),
      updatedAt: dateToString(saveThema.updatedAt!),
    };
  } else {
    return {
      id: thema.id,
      titel: thema.titel,
      beschreibung: thema.beschreibung,
      abschluss: thema.abschluss,
      status: thema.status,
      betreuerName: betreuerProf.name,
      betreuer: thema.betreuer.toString(),
      gebiet: thema.gebiet.toString(),
      updatedAt: dateToString(thema.updatedAt!),
    };
  }
}

/**
 * Beim Löschen wird das Thema über die ID identifiziert.
 * Falls es nicht gefunden wurde (oder aus
 * anderen Gründen nicht gelöscht werden kann) wird ein Fehler geworfen.
 */
export async function deleteThema(id: string): Promise<void> {
  if (!id) {
    throw new Error("No id given, cannot delete Thema.");
  }
  const themaId = new Types.ObjectId(id);
  const res = await Thema.deleteOne({ _id: themaId }).exec();
  if (res.deletedCount !== 1) {
    throw new Error(`No Thema with id ${id} deleted, probably id not valid`);
  }
}
