import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dailyRent: { type: Number, required: true, min: 1 },
    type: {
      type: String,
      enum: ["SUV", "Sedan", "Luxury", "Sports", "Electric"],
      required: true,
    },
    imageUrl: { type: String, required: true },
    seatCapacity: { type: Number, required: true, min: 1 },
    pickupLocation: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    availability: { type: Boolean, default: true },
    bookingCount: { type: Number, default: 0 },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

carSchema.index({ name: "text", pickupLocation: "text" });

export const Car = mongoose.model("Car", carSchema);
