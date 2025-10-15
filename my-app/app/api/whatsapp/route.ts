import { NextResponse } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Booking from "@/models/Booking";
import { sendBookingConfirmation } from "@/lib/email";
import { createCalendarEvent } from "@/lib/googleCalendar";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const sessions: Record<string, { step: string; lastSlots?: any[] }> = {};

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const formData = await req.text();
    const params = new URLSearchParams(formData);
    const incomingMsg = (params.get("Body") || "").trim().toLowerCase();
    const from = params.get("From") || "";

    if (!sessions[from]) sessions[from] = { step: "menu" };

    let reply = "";

    // ===== MENU =====
    if (["hi", "hello", "menu", "start"].includes(incomingMsg)) {
      sessions[from] = { step: "menu" };
      reply =
        "👋 Hi! Welcome to Danesh’s Car Painting Booking Bot!\n\n" +
        "Reply:\n" +
        "1️⃣ View available slots\n" +
        "2️⃣ Help";
    }

    // ===== SHOW AVAILABLE SLOTS =====
    else if (incomingMsg === "1" && sessions[from].step === "menu") {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0];

      const availableSlots = await TimeSlot.find({
        date: { $in: [today, tomorrow] },
        isBooked: false,
      }).sort({ date: 1, startTime: 1 });

      if (availableSlots.length === 0) {
        reply = "😔 No available slots for today or tomorrow.";
      } else {
        reply = "📅 Available Slots:\n\n";
        availableSlots.forEach((slot, i) => {
          reply += `${i + 1}. ${slot.date} | ${slot.startTime} - ${slot.endTime}\n`;
        });
        reply +=
          "\nReply with the slot number (e.g., 1 or 2) to confirm your booking.";
        sessions[from] = { step: "selectSlot", lastSlots: availableSlots };
      }
    }

    // ===== SELECT SLOT & BOOK =====
    else if (sessions[from].step === "selectSlot" && /^\d+$/.test(incomingMsg)) {
      const slotNumber = Number(incomingMsg);
      const availableSlots = sessions[from].lastSlots || [];
      const selectedSlot = availableSlots[slotNumber - 1];

      if (!selectedSlot) {
        reply = "⚠️ Invalid slot number.";
      } else {
        await TimeSlot.findByIdAndUpdate(selectedSlot._id, { isBooked: true });

        const newBooking = await Booking.create({
          clientName: "WhatsApp User",
          email: "customer@example.com",
          whatsappNumber: from,
          date: selectedSlot.date,
          timeSlot: selectedSlot._id,
          status: "confirmed",
        });

        // send email confirmation
        await sendBookingConfirmation(
          "customer@example.com",
          selectedSlot.startTime,
          selectedSlot.date
        );

        // convert “10:00 AM” into ISO datetime
        const parseTime = (timeStr: string, date: string) => {
          const [hourMin, modifier] = timeStr.split(" ");
          let [hours, minutes] = hourMin.split(":").map(Number);
          if (modifier === "PM" && hours < 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;
          return new Date(`${date}T${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:00+08:00`);
        };

        const start = parseTime(selectedSlot.startTime, selectedSlot.date);
        const end = parseTime(selectedSlot.endTime, selectedSlot.date);

        // create google calendar event
        await createCalendarEvent({
          summary: `Car Painting Booking - ${selectedSlot.startTime}`,
          description: `Booking confirmed for ${selectedSlot.date} at ${selectedSlot.startTime}`,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          attendees: [{ email: "customer@example.com" }],
        });

        reply = `✅ Booking Confirmed!\n${selectedSlot.date} | ${selectedSlot.startTime} - ${selectedSlot.endTime}\n📧 Confirmation email and calendar invite sent.`;
        sessions[from].step = "done";
      }
    }

    // ===== HELP =====
    else if (incomingMsg === "2" || incomingMsg.includes("help")) {
      reply =
        "🆘 Help Menu:\n" +
        "- Type 'Hi' to restart\n" +
        "- Type '1' to view slots\n" +
        "- Type the slot number to book\n" +
        "- Type 'cancel' to cancel your booking";
    }

    // ===== CANCEL =====
    else if (incomingMsg.includes("cancel")) {
      sessions[from] = { step: "menu" };
      reply = "❌ Booking canceled. Type 'Hi' to start again.";
    }

    // ===== FALLBACK =====
    else {
      reply =
        "🤖 Sorry, I didn’t understand that.\nType 'Hi' to start again or '1' to view available slots.";
    }

    // Send WhatsApp reply
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER!,
      to: from,
      body: reply,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ WhatsApp error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
