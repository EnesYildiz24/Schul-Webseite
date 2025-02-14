// donenv wird über setupFiles.ts (vgl. jest.config.js) geladen
import { readFile } from "fs/promises";
import https from "https";
import supertest from "supertest";
import app from "../src/app";
import { createProf } from "../src/services/ProfService";
import { createGebiet } from "../src/services/GebietService";
import { GebietResource } from "../src/Resources";

beforeEach(async () => {

    const moriarty = await createProf({
        name: "Moriarty", campusID: "T381047", titel: "Prof. Dr.", password: "12345bcdABCD..;,.", admin: false
    });
    for (let i = 1; i < 10; i++) {
        await createGebiet({
            name: "Gebiet" + i,
            public: true, closed: false,
            verwalter: moriarty.id!
        })
    }
})


test("https test", async () => {

    expect(process.env.HTTPS_PORT).toBeDefined();
    expect(process.env.SSL_KEY_FILE).toBeDefined();
    expect(process.env.SSL_CRT_FILE).toBeDefined(); // Achten Sie vor allem hier auf die richtige Schreibweise!

    const httpsPort = parseInt(process.env.HTTPS_PORT!);
    expect(httpsPort).not.toBeNaN();
    const keyFile = process.env.SSL_KEY_FILE;
    const certFile = process.env.SSL_CRT_FILE;


    // https://nodejs.org/api/cli.html#node_tls_reject_unauthorizedvalue
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // set up server:
    const [privateSSLKey, publicSSLCert] = await Promise.all(
        [readFile(keyFile!), readFile(certFile!)]
    );
    const httpsServer = https.createServer(
        { key: privateSSLKey, cert: publicSSLCert },
        app);

    try {
        await new Promise<void>((resolve, reject) => {
            try {
                /*
                 * Bei einem Fehler "listen EADDRINUSE: address already in use :::3001", 
                 * meist verursacht durch fehlgeschlagene Tests,
                 * kann man (unter Linux und macos) den zugehörigen Prozess, sprich, die noch im Hintergrund
                 * laufende Node-Instanz mit
                 * > lsof -ti :3001
                 * identifizieren. Ausgegeben wird die Nummer des Prozesses, diesen kann man dann mit
                 * > kill «Prozessnummer»
                 * beenden.
                 * Oder als Einzeiler:
                 * > kill $(lsof -ti :3001)
                 * Achtung, es kann sein, dass die Jest-Extension immer wieder neue Tests
                 * 'scheduled' hat. Dann wird der Port immer wieder neu belegt.
                 */
                httpsServer.listen(httpsPort, () => {
                    // console.log(`Listening for HTTPS at https://localhost:${httpsPort}`);
                    resolve(/* void */);
                });
            } catch (err) {
                reject(err);
            }
        });
        // get that nice board
        const testee = supertest(httpsServer);
        const response = await testee.get(`/api/gebiet/alle`);
        expect(response.statusCode).toBe(200); // Seite kann geladen werden
        const gebietResources: GebietResource[] = response.body;
        expect(gebietResources.length).toBe(9); // alle 9 Gebiete gefunden
    } finally {
        httpsServer.close(); // in jedem Fall Server beenden
    }
});