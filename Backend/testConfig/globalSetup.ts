// cf. https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners

import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Starts the MongoMemoryServer.
 * 
 * This file is configured in jest.config.js and automatically called before all tests.
 * 
 * It makes the URI oif the server available to the test suite
 * by means of a global variable. This is necessary because the test
 * environment is running in a separate process, so the URI cannot be
 * simply exported from this file.
 * 
 * The URI is stored in the environment variable `MONGO_URI`. This variable
 * is only needed in setupFile.ts and not in the tests later on
 * 
 * The MongoMemoryServer instance is stored in a global variable so that
 * it can be stopped in globalTeardown.ts.
 * 
 * Please do not change this file.
 */
export default async function globalSetup() {
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    // await mongoose.connect(uri);
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
}