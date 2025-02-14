import { LoginResource } from "../Resources";
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken";
import { login } from "./AuthenticationService";

export async function verifyPasswordAndCreateJWT(
  campusID: string,
  password: string
): Promise<string | undefined> {
  const secret = process.env.JWT_SECRET;
  const ttl = process.env.JWT_TTL;
  if (!secret || !ttl) {
    throw new Error("JWT_SECRET oder JWT_TTL icht gegeben");
  }

  const logger = await login(campusID, password);
  if (!logger) {
    return undefined;
  }
  const payload: JwtPayload = {
    sub: logger.id as string,
    role: logger.role as "a" | "u",
  };
  const jwtString = sign(payload, secret, {
    expiresIn: parseInt(ttl, 10),
    algorithm: "HS256",
  });

  return jwtString;
}

export function verifyJWT(jwtString: string | undefined): LoginResource {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new JsonWebTokenError("JWT_SECRET oder JWT_TTL icht gegeben");
  }
  if (!jwtString) {
    throw new JsonWebTokenError("JWT ist nicht definiert");
  }

  try {
    const payload = verify(jwtString, secret, {
      algorithms: ["HS256"],
    }) as JwtPayload;

    const userId = payload.sub as string;
    const role = payload.role as "a" | "u";
    const exp = payload.exp as number;

    if (!userId || !exp || !role) {
      throw new JsonWebTokenError("Ungültiges JWT-Payload");
    }
    return {
      id: userId,
      role: payload.role,
      exp: exp,
    } as LoginResource;
  } catch (err) {
    throw new JsonWebTokenError(`JWT-Validierung fehlgeschlagen`);
  }
}
