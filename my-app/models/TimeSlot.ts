import { Schema, model, models } from "mongoose";

const TimeSlotSchema = new Schema({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: Schema.Types.ObjectId, ref: "Booking", default: null },
});

const TimeSlot = models.TimeSlot || model("TimeSlot", TimeSlotSchema);
export default TimeSlot;
