// TEMPORARY in-memory "DB" so you can develop routes now.
// Your DB teammate will replace these with real ORM/SQL calls.
const bcrypt = require("bcryptjs");



let idCounter = 3;
const users = [
  // seed an admin and a faculty for quick testing
  {
    id: 1,
    name: "Admin User",
    email: "admin@demo.edu",
    passwordHash:  bcrypt.hashSync("Admin@123", 10), // "Admin@123" (placeholder; regen if needed)
    role: "admin",
    dept: "HQ"
  },
  {
    id: 2,
    name: "Faculty One",
    email: "faculty@demo.edu",
    passwordHash: "$2a$10$Qd0w2B8V4Xr0bJ7Kk8V8Fe2kqJx2vT6v8QWkX0eDkZ0e5pQ2n5mMi", // "Admin@123" for quick test
    role: "faculty",
    dept: "CSE"
  }
];

module.exports = {
  async findByEmail(email) {
    return users.find(u => u.email === email) || null;
  },
  async findById(id) {
    return users.find(u => u.id === Number(id)) || null;
  },
  async create({ name, email, passwordHash, role, dept }) {
    const user = { id: ++idCounter, name, email, passwordHash, role, dept };
    users.push(user);
    return user;
  }
};
