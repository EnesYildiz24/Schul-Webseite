import { LoginResource } from "../Resources";
import { JwtPayload, sign, verify } from "jsonwebtoken";
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
    sub: logger.id,
    role: logger.role,
  };
  const jwtString = sign(payload, secret, {
    expiresIn: parseInt(ttl, 10),
    algorithm: "HS256",
  });

  return jwtString;
}

export function verifyJWT(jwtString: string | undefined): LoginResource {
  throw new Error("Function verifyJWT not implemented");
}
