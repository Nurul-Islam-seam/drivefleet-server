import express from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import { Booking } from "../models/Booking.js";
import { Car } from "../models/Car.js";

const router = express.Router();
const editableFields = ["dailyRent", "description", "availability", "imageUrl", "type", "pickupLocation"];

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  return value === "true";
}

router.get("/", async (req, res, next) => {
  try {
    const { search = "", type = "", limit = "" } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (type) query.type = type;

    const carsQuery = Car.find(query).sort({ createdAt: -1 });
    if (limit) carsQuery.limit(Number(limit));
    const cars = await carsQuery;
    res.json(cars);
  } catch (error) {
    next(error);
  }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const cars = await Car.find({ ownerEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Car not found" });
    }
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const car = await Car.create({
      name: req.body.name,
      dailyRent: Number(req.body.dailyRent),
      type: req.body.type,
      imageUrl: req.body.imageUrl,
      seatCapacity: Number(req.body.seatCapacity),
      pickupLocation: req.body.pickupLocation,
      description: req.body.description,
      availability: toBoolean(req.body.availability),
      ownerEmail: req.user.email,
      ownerName: req.user.name,
    });
    res.status(201).json(car);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: "Only the owner can update this car" });
    }

    for (const field of editableFields) {
      if (req.body[field] !== undefined) car[field] = req.body[field];
    }
    if (req.body.dailyRent !== undefined) car.dailyRent = Number(req.body.dailyRent);
    if (req.body.availability !== undefined) car.availability = toBoolean(req.body.availability);

    await car.save();
    res.json(car);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: "Only the owner can delete this car" });
    }

    await Booking.deleteMany({ car: car._id });
    await car.deleteOne();
    res.json({ message: "Car deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
