import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import validator from "validator";

const COOKIE_NAME = process.env.COOKIE_NAME!;
const SECRET = process.env.JWT_SECRET!;

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
export function requiresAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwtString = req.cookies?.[COOKIE_NAME];

  if (!jwtString) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const payload = verify(jwtString, SECRET);
    if (
      typeof payload === "object" &&
      payload.exp &&
      payload.sub &&
      
      validator.isMongoId(payload.sub)
    ) {
      req.profId = payload.sub;
      req.role = payload.role || "guest";
      return next();
    }
  } catch (err) {}
  res.sendStatus(401);
}

/**
 * Prüft Authentifizierung und schreibt `profId` und `role' des Profs in den Request.
 * Falls ein JWT vorhanden ist, wird bei fehlgeschlagener Prüfung ein Fehler gesendet.
 * Ansonsten wird kein Fehler erzeugt.
 */
export function optionalAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwtString = req.cookies[COOKIE_NAME!];
  if (!jwtString) {
    return next();
  }
  try {
    const payload = verify(jwtString, SECRET);
    if (
      typeof payload === "object" &&
      payload.exp &&
      payload.sub &&
      validator.isMongoId(payload.sub)
    ) {
      req.profId = payload.sub;
      req.role = payload.role || "guest";
      next();
      return;
    }
  } catch (err) {
    return res.sendStatus(401);
  }
}
