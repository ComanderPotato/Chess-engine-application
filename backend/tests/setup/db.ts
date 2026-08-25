import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
let mongo: MongoMemoryReplSet;

export async function connectDB() {
  mongo = await MongoMemoryReplSet.create({
    binary: {
      downloadDir: "./mongo-cache",
    },
    replSet: {
      count: 1,
    },
  });

  await mongoose.connect(mongo.getUri());
}

export async function clearDB() {
  if (!mongoose.connection.readyState) return;
  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  await mongo.stop({ force: true, doCleanup: true });
}
