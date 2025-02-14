// istanbul ignore file

import { GebietResource, ThemaResource } from "../Resources";

export const gebiete: GebietResource[] = [
    {
        id: "101",
        name: "Transfiguration",
        public: true,
        closed: false,
        verwalter: "501",
        verwalterName: "Minerva McGonagall",
        createdAt: "01.10.2024"
    },
    {
        id: "102",
        name: "Defense Against the Dark Arts",
        public: true,
        closed: false,
        verwalter: "501",
        verwalterName: "Minerva McGonagall",
        createdAt: "02.10.2024"
    },
    {
        id: "103",
        name: "Potions",
        public: true,
        closed: false,
        verwalter: "502",
        verwalterName: "Severus Snape",
        createdAt: "03.10.2024"
    }
]

export const themen: ThemaResource[] = [
    {
        id: "201",
        titel: "Verwandlungen in Wölfe",
        beschreibung: "Wie verwandelt man sich ein einen Wolf unter besonderer Berücksichtigung von brandeburgischen Wölfen?",
        abschluss: "bsc",
        status: "offen",
        betreuer: "501",
        betreuerName: "Minerva McGonagall",
        gebiet: "101",
        updatedAt: "01.11.2024"
    },
    {
        id: "202",
        titel: "Verwandlungen in Mäuse",
        beschreibung: "Wie verwandelt man sich eine Maus unter besonderer Berücksichtigung von Stadtmäusen?",
        abschluss: "bsc",
        status: "offen",
        betreuer: "501",
        betreuerName: "Minerva McGonagall",
        gebiet: "101",
        updatedAt: "02.11.2024"
    },
    {
        id: "203",
        titel: "Vegetarische Zaubertränke",
        beschreibung: "Wie kann man Zaubertränke vegetarisch herstellen?",
        abschluss: "bsc",
        status: "offen",
        betreuer: "502",
        betreuerName: "Severus Snape",
        gebiet: "103",
        updatedAt: "03.11.2024"
    },

];
