import express from "express";
import { body, matchedData, validationResult } from "express-validator";
import { login } from "../services/AuthenticationService";
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken";
import { LoginResource } from "../Resources";
import cookieParser from "cookie-parser";
import { verifyJWT } from "../services/JWTService";

export const loginRouter = express.Router();
loginRouter.use(cookieParser());

// hier ohne Fehlerbehandlung für die Demo
const COOKIE_NAME = "access_token";
const SECRET = process.env.JWT_SECRET!;
const TTL = parseInt(process.env.JWT_TTL!);

loginRouter.post(
  "/",
  body("campusID").isString().isLength({ max: 100 }),
  body("password").isString().isLength({ min: 8 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { campusID, password } = matchedData(req) as {
      campusID: string;
      password: string;
    };
    const loginResult = await login(campusID, password);
    if (!loginResult) {
      res.status(401).send("Login failed");
      return
    }
    const jwtString = sign(
      {
        // Payload
        sub: loginResult.id,
        role: loginResult.role,
      },
      SECRET,
      {
        // SignOptions
        expiresIn: TTL, // numeric, i.e. seconds
        algorithm: "HS256",
      }
    );
    res.cookie(COOKIE_NAME, jwtString, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + TTL * 1000),
    });

    res.sendStatus(201);
  }
);

loginRouter.get("/", (req, res) => {
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    res.clearCookie(COOKIE_NAME);
    return res.json(false);
  }
  try {
    const payload = verifyJWT(token);
    res.json(payload);
  } catch (err) {
    res.clearCookie(COOKIE_NAME);
    res.json(false);
  }
});

loginRouter.delete("/", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    //TODO: keine ahnung ob das nötig ist (Sicherheit)
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.sendStatus(200);
});
