// istanbul ignore file

import { ProfResource, GebietResource } from "./Resources";
import { logger } from "./logger";
import { Thema } from "./model/ThemaModel";
import { Prof } from "./model/ProfModel";
import { Gebiet } from "./model/GebietModel";
import { createThema } from "./services/ThemaService";
import { createProf } from "./services/ProfService";
import { createGebiet } from "./services/GebietService";

/**
 * Erzeugt einen Benutzer "Moriarty" und ein paar vom ihm angelegte Gebiete mit Themen.
 * Diese Funktion benötigen wir später zu Testzwecken im Frontend.
 */
export async function prefillDB(): Promise<{
  moriarty: ProfResource;
  gebiete: GebietResource[];
}> {
  await Prof.syncIndexes();
  await Gebiet.syncIndexes();
  await Thema.syncIndexes();

  const moriarty = await createProf({
    name: "Moriarty",
    titel: "Prof. Dr.",
    campusID: "459810",
    password: "Kingleon",
    admin: true,
  });
  logger.info(
    `Prefill DB with test data, campusID: ${moriarty.campusID}, password 123_abc_ABC`
  );

  const gebieteArr: GebietResource[] = [];

  const gebiet1 = await createGebiet({
    name: "Web",
    beschreibung: "Entwicklung von Web-Software",
    public: true,
    verwalter: moriarty.id!,
    closed: false,
  });
  const gebiet2 = await createGebiet({
    name: "KI",
    beschreibung: "Aktuelle Techniken der künstlichen Intelligenz",
    public: false,
    verwalter: moriarty.id!,
    closed: false,
  });

  await createThema({
    titel: "Entwicklung einer Lernplattform",
    beschreibung:
      "Eine Web-Anwendung, die es Studierenden ermöglicht, Lernmaterialien zu teilen, Fragen zu stellen und Antworten zu erhalten, sowie sich in Studiengruppen zu organisieren.",
    abschluss: "bsc",
    status: "offen",
    gebiet: gebiet1.id!,
    betreuer: moriarty.id!,
  });

  await createThema({
    titel: "Entwicklung eines Online-Shops",
    beschreibung:
      "Eine Web-Anwendung, die es Nutzern ermöglicht, Produkte zu durchsuchen, zu kaufen und zu bewerten.",
    abschluss: "msc",
    status: "reserviert",
    gebiet: gebiet1.id!,
    betreuer: moriarty.id!,
  });

  await createThema({
    titel: "Entwicklung eines Chatbots",
    beschreibung:
      "Chatbot, der mithilfe von NLP und ML Kundenanfragen versteht und beantwortet.",
    abschluss: "bsc",
    status: "offen",
    gebiet: gebiet2.id!,
    betreuer: moriarty.id!,
  });

  await createThema({
    titel: "KI-Modell zur Erkennung medizinischer Bilder",
    beschreibung:
      "KI-Modell, das medizinische Bilder (z.B. Röntgenaufnahmen, MRT-Scans) analysiert und Krankheiten oder Anomalien erkennt.",
    abschluss: "msc",
    status: "offen",
    gebiet: gebiet2.id!,
    betreuer: moriarty.id!,
  });

  await createThema({
    titel: "KI-Modell zur Fahrzeugsteuerung",
    beschreibung:
      "KI-Modell, das ein autonomes Fahrzeug steuert, einschließlich Sensorfusion, Routenplanung und Hindernisvermeidung.",
    abschluss: "msc",
    status: "reserviert",
    gebiet: gebiet2.id!,
    betreuer: moriarty.id!,
  });

  gebieteArr.push({ ...gebiet1, anzahlThemen: 2 });
  gebieteArr.push({ ...gebiet2, anzahlThemen: 3 });

  return { moriarty: moriarty, gebiete: gebieteArr };
}
