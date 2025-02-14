export type ProfResource = {
    /** 
     * Optional, da bei Konstruktion noch nicht vorhanden. Später allerdings immer benötigt bzw. vorhanden. 
     */
    id?: string;
    name: string;
    titel?: string;
    campusID: string;
    /** 
     * Wird von MongoDB automatisch gesetzt, wir wollen aber (in der API nach außen) dieses 
     * wichtige Feld immer explizit setzen lassen. Beim Lesen ohnehin immer vorhanden.
     */
    admin: boolean;
    /** 
     * Quasi write only, d.h. beim Lesen niemals vorhanden. 
     */
    password?: string;
};

export type GebietResource = {
    /** 
     * Optional, da bei Konstruktion noch nicht vorhanden. Später allerdings immer benötigt bzw. vorhanden. 
     */
    id?: string;
    name: string;
    beschreibung?: string;
    /**
     * Beim Lesen immer vorhanden, wird beim Schreiben ggf. von MongoDB automatisch gesetzt.
     */
    public?: boolean;
    /**
     * Beim Lesen immer vorhanden, wird beim Schreiben ggf. von MongoDB automatisch gesetzt.
     */
    closed?: boolean;
    verwalter: string;
    /**
     * Wird berechnet und daher beim Lesen (über den Router bzw. Service) gesetzt,
     * beim Schreiben wird der Wert ignoriert und ist dann optional.
     */
    verwalterName?: string;
    /**
     * Read-only, d.h. beim Schreiben wird es nicht benötigt (bzw. wird ignoriert), beim Lesen immer vorhanden.
     */
    createdAt?: string;
    /**
     * Wird berechnet und daher beim Lesen (über den Router bzw. Service) gesetzt,
     * beim Schreiben wird der Wert ignoriert und ist dann optional.
     */
    anzahlThemen?: number;
};

export type ThemaResource = {
    /** 
     * Optional, da bei Konstruktion noch nicht vorhanden. Später allerdings immer benötigt bzw. vorhanden. 
     * */
    id?: string;
    titel: string;
    beschreibung: string;
    abschluss?: string;
    /**
     * Beim Lesen immer vorhanden, wird beim Schreiben ggf. von MongoDB automatisch gesetzt.
     */
    status?: string;
    betreuer: string;
    /**
     * Wird berechnet und daher beim Lesen (über den Router bzw. Service) gesetzt,
     * beim Schreiben wird der Wert ignoriert und ist dann optional.
     */
    betreuerName?: string;
    gebiet: string;
    /**
     * Read-only, d.h. beim Schreiben wird es nicht benötigt (bzw. wird ignoriert), beim Lesen immer vorhanden.
     */
    updatedAt?: string;
};

export type LoginResource = {
    id: string;
    role: "a" | "u";
    /** Expiration time in seconds since 1.1.1970 */
    exp: number;
};
