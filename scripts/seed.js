import mongoose from "mongoose";
import clearCollections from "./clearCollections.js";
import fillCollections from "./fillCollections.js";

async function run() {
  try {
    console.log("Starting seed...");
    await clearCollections();
    await fillCollections();
    console.log("Seed complete.");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

run();
