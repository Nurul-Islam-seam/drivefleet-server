import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    carName: { type: String, required: true },
    carImage: { type: String, required: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true, trim: true },
    bookingDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 1 },
    driverNeeded: { type: Boolean, default: false },
    specialNote: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
