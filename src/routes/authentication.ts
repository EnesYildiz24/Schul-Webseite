import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        export interface Request {
            /**
             * Mongo-ID of currently logged in prof; or undefined, if prof is a guest.
             */
            profId?: string;
            role?: "u" | "a";
        }
    }
}

/**
 * Prüft Authentifizierung und schreibt `profId` und `role' des Profs in den Request.
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) gesendet.
 */
export function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
    throw new Error("Function requiresAuthentication not implemented");
}

/**
 * Prüft Authentifizierung und schreibt `profId` und `role' des Profs in den Request.
 * Falls ein JWT vorhanden ist, wird bei fehlgeschlagener Prüfung ein Fehler gesendet.
 * Ansonsten wird kein Fehler erzeugt.
 */
export function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
    throw new Error("Function requiresAuthentication not implemented");

}

