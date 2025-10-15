// scripts/seedTimeSlots.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // ✅ Load environment variables manually

import { connectToDatabase } from "../lib/mongodb";
import TimeSlot from "../models/TimeSlot";

async function seed() {
  try {
    console.log("🧠 MONGODB_URI:", process.env.MONGODB_URI); // Debug line
    await connectToDatabase();
    console.log("✅ Connected to MongoDB!");

    const today = new Date();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const slots = [
      // Today's slots
      { date: formatDate(today), startTime: "10:00 AM", endTime: "11:00 AM", isBooked: false },
      { date: formatDate(today), startTime: "1:00 PM", endTime: "2:00 PM", isBooked: false },
      { date: formatDate(today), startTime: "3:00 PM", endTime: "4:00 PM", isBooked: false },

      // Tomorrow's slots
      { date: formatDate(tomorrow), startTime: "10:00 AM", endTime: "11:00 AM", isBooked: false },
      { date: formatDate(tomorrow), startTime: "1:00 PM", endTime: "2:00 PM", isBooked: false },
      { date: formatDate(tomorrow), startTime: "3:00 PM", endTime: "4:00 PM", isBooked: false },
    ];

    // Clear existing time slots for these days before reseeding
    await TimeSlot.deleteMany({
      date: { $in: [formatDate(today), formatDate(tomorrow)] },
    });

    // Insert the new slots
    await TimeSlot.insertMany(slots);

    console.log("✅ Successfully seeded today's & tomorrow's time slots!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding time slots:", error);
    process.exit(1);
  }
}

seed();
