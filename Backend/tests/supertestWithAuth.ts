import express from 'express';
import supertest, { Test } from "supertest";
import app from "../src/app";
import { Cookie, parseCookies, supertestWithReqMiddleware } from "restmatcher"

let cookie: Cookie | undefined = undefined

/**
 * Führt einen Login durch und speichert den Cookie, damit dieser später in `supertestWithAuth` verwendet werden kann.
 */
export async function performAuthentication(campusID: string, password: string) {
    const testee = supertest(app);
    const res = parseCookies(await testee.post(`/api/login`).send({ campusID, password }));
    cookie = res.cookiesRaw.find(c => c.name === "access_token");
    if (cookie === undefined) {
        throw new Error(`Authentication failed, cannot login (no cookie found in response)`)
    }
}

/**
 * Wie `supertest`, aber mit Authentifizierung. Die Authentifizierung wird über einen Cookie und via `performAuthentication` durchgeführt.
 */
export function supertestWithAuth(app: express.Express) {
    if (!cookie) throw new Error("Kein Cookie gefunden, bitte zunächst mit performAuthentication Authentifizierung durchführen.");
    return supertestWithReqMiddleware(app,
        (req: Test) => {
            return req.set('Cookie', [
                "access_token=" + cookie.value
                + (cookie.httpOnly ? ';HttpOnly' : '')
                + (cookie.expires ? ';Expires=' + cookie.expires.toUTCString() : '')
                + (cookie.path ? ';Path=' + cookie.path : '')
                + (cookie.domain ? ';Domain=' + cookie.domain : '')
                + (cookie.secure ? ';Secure' : '')
                + "]"
            ]);
        });
}
