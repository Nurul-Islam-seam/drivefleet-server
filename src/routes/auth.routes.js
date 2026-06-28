import express from "express";
import { getFirebaseAdmin } from "../config/firebaseAdmin.js";
import { cookieOptions, requireAuth, signSession } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { idToken, user } = req.body;
    let profile = user;
    const firebaseAdmin = getFirebaseAdmin();

    if (firebaseAdmin && idToken) {
      const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
      profile = {
        name: decoded.name || user?.name || decoded.email?.split("@")[0],
        email: decoded.email,
        photoURL: decoded.picture || user?.photoURL || "",
        provider: decoded.firebase?.sign_in_provider || "firebase",
      };
    }

    if (!profile?.email) {
      return res.status(400).json({ message: "Valid user profile is required" });
    }

    const savedUser = await User.findOneAndUpdate(
      { email: profile.email.toLowerCase() },
      {
        name: profile.name || profile.email.split("@")[0],
        email: profile.email.toLowerCase(),
        photoURL: profile.photoURL || "",
        provider: profile.provider || "firebase",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const token = signSession(savedUser);
    res.cookie("drivefleet_token", token, cookieOptions());
    res.json({ user: savedUser });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) return res.status(401).json({ message: "Session user not found" });
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("drivefleet_token", cookieOptions());
  res.json({ message: "Logged out" });
});

export default router;
