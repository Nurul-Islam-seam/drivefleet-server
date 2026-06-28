import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Booking } from "../models/Booking.js";
import { Car } from "../models/Car.js";

const router = express.Router();

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { carId, driverNeeded = false, specialNote = "", bookingDate } = req.body;
    const car = await Car.findById(carId);

    if (!car) return res.status(404).json({ message: "Car not found" });
    if (!car.availability) return res.status(409).json({ message: "This car is unavailable" });

    const totalPrice = Number(car.dailyRent) + (driverNeeded ? 35 : 0);
    const booking = await Booking.create({
      car: car._id,
      carName: car.name,
      carImage: car.imageUrl,
      userEmail: req.user.email,
      userName: req.user.name,
      bookingDate,
      totalPrice,
      driverNeeded,
      specialNote,
    });

    await Car.updateOne({ _id: car._id }, { $inc: { bookingCount: 1 } });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
