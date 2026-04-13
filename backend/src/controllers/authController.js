import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/token.js";

export async function registerUser(req, res) {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await pool.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email.trim(), username.trim()]
    );

    if (existing.length > 0) {
      if (existing[0].email === email.trim()) {
        return res.status(409).json({ message: "Email is already registered" });
      }

      return res.status(409).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const [result] = await pool.execute(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email.trim(), username.trim(), hashedPassword]
    );

    return res.status(201).json({
      message: "Registration successful",
      userId: result.insertId
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both username and password" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Username not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function logoutUser(req, res) {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
}

export async function getCurrentUser(req, res) {
  return res.json({
    user: req.user
  });
}