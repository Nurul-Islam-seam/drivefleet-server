import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.cookies?.drivefleet_token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

export function signSession(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, name: user.name, photoURL: user.photoURL },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
