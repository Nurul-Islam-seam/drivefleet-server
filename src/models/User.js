import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    photoURL: { type: String, default: "" },
    provider: { type: String, default: "password" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
