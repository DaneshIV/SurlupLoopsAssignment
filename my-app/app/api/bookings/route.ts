import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TimeSlot from "@/models/TimeSlot";

export async function POST(req: Request) {
  try {
    console.log("📩 Incoming booking request...");
    await connectToDatabase();
    console.log("✅ Database connected");

    const body = await req.json();
    console.log("🧾 Request Body:", body);

    const { clientName, clientEmail, date, startTime, endTime } = body;

    // 1️⃣ Check if a timeslot exists
    const slot = await TimeSlot.findOne({ date, startTime, endTime });
    if (!slot) {
      console.log("⚠️ No matching time slot found!");
      return NextResponse.json(
        { success: false, message: "No matching time slot found" },
        { status: 404 }
      );
    }

    // 2️⃣ Check if slot is already booked
    if (slot.booked) {
      console.log("⚠️ Slot already booked!");
      return NextResponse.json(
        { success: false, message: "Slot already booked" },
        { status: 400 }
      );
    }

    // 3️⃣ Create booking with reference to TimeSlot
    const booking = await Booking.create({
      clientName,
      email: clientEmail,
      date,
      timeSlot: slot._id, // ✅ reference the ObjectId
      status: "confirmed",
    });

    console.log("✅ Booking created:", booking);

    // 4️⃣ Mark the TimeSlot as booked
    slot.booked = true;
    await slot.save();

    console.log("📅 TimeSlot marked as booked");

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("💥 Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking", error: String(error) },
      { status: 500 }
    );
  }
}
