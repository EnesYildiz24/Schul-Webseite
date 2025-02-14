import { logger } from "../logger";
import { Prof } from "../model/ProfModel";

/**
 * Prüft Campus-ID und Passwort, bei Erfolg ist `success` true
 * und es wird die `id` und `role` ("u" oder "a") des Profs zurückgegeben
 *
 * Falls kein Prof mit gegebener Campus-ID existiert oder das Passwort falsch ist, wird nur
 * `success` mit falsch zurückgegeben. Aus Sicherheitsgründen wird kein weiterer Hinweis gegeben.
 */
export async function login(
  campusID: string,
  password: string
): Promise<{ id: string; role: "a" | "u" } | false> {
  if (!campusID || !password) {
    logger.warn("no campusid or password");
    return false;
  }

  const prof = await Prof.findOne({ campusID }).exec();

  if (!prof) {
    return false;
  }

  const iscorrectPassword = await prof.isCorrectPassword(password)
  if(!iscorrectPassword){
    return false
  }
  const role: "a" | "u" = prof.admin ? "a" : "u";

  return { id: prof._id.toString(), role };
}
