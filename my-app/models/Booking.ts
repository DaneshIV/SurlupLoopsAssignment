import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema({
  clientName: { type: String },
  email: { type: String },
  whatsappNumber: { type: String },
  date: { type: String, required: true },
  timeSlot: { type: Schema.Types.ObjectId, ref: "TimeSlot" },
  meetingLink: { type: String },
  status: { type: String, default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

const Booking = models.Booking || model("Booking", BookingSchema);
export default Booking;
