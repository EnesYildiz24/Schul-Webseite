// cf. https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners

import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Stops the MongoMemoryServer. 
 * 
 * This file is configured in jest.config.js and automatically called after all tests.
 * 
 * It uses a global variable previously set in globalSetup.ts.
 * 
 * Please do not change this file.
 */
export default async function globalTeardown() {
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    if (!instance) {
        throw new Error("MongoMemoryServer not found, please fix globalSetup.");
    }
    await instance.stop();
}
