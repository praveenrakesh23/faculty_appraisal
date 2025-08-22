const router = require("express").Router();
const { login, register, me, refresh } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);      // lock this behind admin later if needed
router.get("/me", requireAuth, me);
router.post("/refresh", refresh);        // optional refresh token flow

module.exports = router;
