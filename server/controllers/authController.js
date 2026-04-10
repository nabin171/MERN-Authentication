import bcrypt from "bcryptjs";
import { JsonWebTokenError } from "jsonwebtoken";
import userModel from "../models/userModal";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
