const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { checkRecordExists, insertRecord } = require("../utils/sqlFunctions");

const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    userId: uuidv4(),
    name,
    email,
    phone,
    password: hashedPassword,
    role: "user"
  };

  try {
    const userAlreadyExists = await checkRecordExists("users", "email", email);
    if (userAlreadyExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    await insertRecord("users", user);

    const token = generateAccessToken(user.userId, user.role);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user.userId,
      name: user.name, // ADD THIS LINE
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email or Password fields cannot be empty!" });
  }

  try {
    const existingUser = await checkRecordExists("users", "email", email);

    if (!existingUser || !existingUser.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateAccessToken(existingUser.userId, existingUser.role);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      userId: existingUser.userId,
      name: existingUser.name, // ADD THIS LINE
      email: existingUser.email,
      role: existingUser.role,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  logout
};