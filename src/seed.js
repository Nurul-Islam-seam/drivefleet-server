import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Car } from "./models/Car.js";

dotenv.config();

const cars = [
  {
    name: "Tesla Model Y",
    dailyRent: 145,
    type: "Electric",
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    seatCapacity: 5,
    pickupLocation: "Dhaka Gulshan Hub",
    description: "Silent electric SUV with autopilot-ready comfort, panoramic glass, and premium cabin tech.",
    availability: true,
  },
  {
    name: "BMW 5 Series",
    dailyRent: 180,
    type: "Luxury",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    seatCapacity: 5,
    pickupLocation: "Banani Executive Desk",
    description: "Executive luxury sedan with refined handling, leather seating, and a quiet highway ride.",
    availability: true,
  },
  {
    name: "Range Rover Evoque",
    dailyRent: 210,
    type: "SUV",
    imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80",
    seatCapacity: 5,
    pickupLocation: "Uttara Airport Gate",
    description: "Confident SUV for city drives and weekend escapes with elevated seating and premium trim.",
    availability: true,
  },
  {
    name: "Toyota Camry Hybrid",
    dailyRent: 95,
    type: "Sedan",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
    seatCapacity: 5,
    pickupLocation: "Dhanmondi Pickup Point",
    description: "Fuel-efficient sedan with spacious seating, modern safety features, and smooth hybrid power.",
    availability: true,
  },
  {
    name: "Porsche 911 Carrera",
    dailyRent: 360,
    type: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    seatCapacity: 2,
    pickupLocation: "Gulshan Premium Bay",
    description: "Iconic sports car with precise steering, thrilling acceleration, and a driver-focused cockpit.",
    availability: false,
  },
  {
    name: "Audi e-tron GT",
    dailyRent: 285,
    type: "Electric",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    seatCapacity: 4,
    pickupLocation: "Bashundhara EV Lounge",
    description: "Electric grand tourer with sculpted design, quick charging support, and premium sound.",
    availability: true,
  },
];

await connectDB();
await Car.deleteMany({ ownerEmail: "demo@drivefleet.com" });
await Car.insertMany(
  cars.map((car) => ({
    ...car,
    ownerEmail: "demo@drivefleet.com",
    ownerName: "DriveFleet Demo",
  }))
);
console.log("Seeded demo cars");
process.exit(0);
