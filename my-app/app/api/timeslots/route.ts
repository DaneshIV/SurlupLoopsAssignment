import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

// 📅 GET — Fetch all available or booked time slots
export async function GET(request: Request) {

    console.log("✅ /api/timeslots endpoint hit");

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // optional ?date=2025-10-16

    const query: any = {};
    if (date) query.date = date;

    const timeSlots = await TimeSlot.find(query).sort({ date: 1, startTime: 1 });

    return NextResponse.json({ success: true, data: timeSlots });
  } catch (error) {
    console.error("GET /timeslots error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch time slots" });
  }
}

// ➕ POST — Create new time slots (admin/you manually)
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.date || !body.startTime || !body.endTime) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    const slot = await TimeSlot.create({
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      isBooked: false,
    });

    return NextResponse.json({ success: true, data: slot });
  } catch (error) {
    console.error("POST /timeslots error:", error);
    return NextResponse.json({ success: false, message: "Failed to create time slot" });
  }
}

// ✏️ PATCH — Mark slot as booked (after WhatsApp booking)
export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.slotId || !body.bookedBy) {
      return NextResponse.json({ success: false, message: "Missing slotId or bookedBy" });
    }

    const updated = await TimeSlot.findByIdAndUpdate(
      body.slotId,
      { isBooked: true, bookedBy: body.bookedBy },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /timeslots error:", error);
    return NextResponse.json({ success: false, message: "Failed to update slot" });
  }
}
