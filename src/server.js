import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { Car } from "./models/Car.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import carRoutes from "./routes/cars.routes.js";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ name: "DriveFleet API", status: "running" });
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get("/api/seed", async (_req, res) => {
  try {
    const cars = [
      { name: "Tesla Model Y", dailyRent: 145, type: "Electric", imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a", seatCapacity: 5, pickupLocation: "Dhaka", description: "Demo car", availability: true },
      { name: "BMW 5 Series", dailyRent: 180, type: "Luxury", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e", seatCapacity: 5, pickupLocation: "Dhaka", description: "Demo car", availability: true },
      { name: "Range Rover", dailyRent: 210, type: "SUV", imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24", seatCapacity: 5, pickupLocation: "Dhaka", description: "Demo car", availability: true },
      { name: "Toyota Camry", dailyRent: 95, type: "Sedan", imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", seatCapacity: 5, pickupLocation: "Dhaka", description: "Demo car", availability: true },
      { name: "Porsche 911", dailyRent: 360, type: "Sports", imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70", seatCapacity: 2, pickupLocation: "Dhaka", description: "Demo car", availability: false },
      { name: "Audi e-tron", dailyRent: 285, type: "Electric", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", seatCapacity: 4, pickupLocation: "Dhaka", description: "Demo car", availability: true },
    ];
    await Car.deleteMany({ ownerEmail: "demo@drivefleet.com" });
    await Car.insertMany(cars.map(c => ({ ...c, ownerEmail: "demo@drivefleet.com", ownerName: "DriveFleet Demo" })));
    res.json({ success: true, message: "Database seeded with demo cars!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Server error",
  });
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`DriveFleet API listening on ${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
