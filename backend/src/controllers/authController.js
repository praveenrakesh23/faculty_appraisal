const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "faculty", dept } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await userService.findByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userService.create({ name, email, passwordHash, role, dept });

    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, dept: user.dept });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

    const user = await userService.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken({ id: user.id, role: user.role, name: user.name, dept: user.dept });
    const refreshToken = signRefreshToken({ id: user.id });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, dept: user.dept },
      tokens: { accessToken, refreshToken }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.me = async (req, res) => {
  // req.user is populated by requireAuth
  return res.json({ user: req.user });
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Missing refresh token" });
    const payload = verifyRefreshToken(refreshToken);
    const user = await userService.findById(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    const accessToken = signAccessToken({ id: user.id, role: user.role, name: user.name, dept: user.dept });
    const newRefreshToken = signRefreshToken({ id: user.id });

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};
