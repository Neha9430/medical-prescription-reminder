import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔐 .env में होना चाहिए
    const user = await User.findById(decoded.userId).select("-password"); // password hide

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user; // ✅ यह key हमें controller में use करनी है
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default authMiddleware;
