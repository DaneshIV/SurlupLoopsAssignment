import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await Booking.find({});
    return NextResponse.json({ success: true, count: bookings.length });
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json({ success: false, error: "Database connection failed" });
  }
}
