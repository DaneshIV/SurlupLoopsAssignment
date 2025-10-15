// lib/mongodb.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Load env manually for scripts (like seeding)
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI as string; // 👈 Fix: Assert it's a string

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable in .env or .env.local");
}

// Global cache to avoid multiple connections during hot reload in dev
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "car_painting_bookings",
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
