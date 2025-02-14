// cf. https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners
// import before everything else
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

/**
 * This file is configured in jest.config.js and automatically called before all tests.
 * 
 * This setup requires globalSetup.ts to be run before the tests, i.e. globalSetup.ts
 * must be configured in jest.config.js as well.
 * 
 * This file must be configured in 'setupFilesAfterEnv' in jest.config.js in order to
 * be run after globalSetup.ts and have access to the URI of the MongoMemoryServer in
 * the environment variable `MONGO_URI`.
 */

/**
 * Connects to the MongoDB instance. It uses the URI stored in the environment variable
 * `MONGO_URI`. This variable is set in globalSetup.ts.
 */
beforeAll(async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MongoDB URI not set, please fix globalSetup.")
    }
    await mongoose.connect(process.env.MONGO_URI);
});

/**
 * Drops the database and disconnects from the MongoDB instance.
 */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

/**
 * Deletes all documents from all collections. It does not use `dropDatabase` in order
 * to preserve indexes.
 */
afterEach(async () => {
    const collections = Object.values(mongoose.connection.collections);
    for (const collection of collections) {
        await collection.deleteMany({});
    }
})