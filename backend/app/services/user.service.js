const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function UserService(client) {
  const collection = client.db().collection("users");

  return {
    // Extract user data from the payload
    extractUserData(payload) {
      const user = {
        username: payload.username,
        password: payload.password,
        role: payload.role || "user", // Default role is "user"
      };
      Object.keys(user).forEach((key) => user[key] === undefined && delete user[key]);
      return user;
    },

    // Register a new user
    async register(payload) {
      const user = this.extractUserData(payload);
      const existingUser = await collection.findOne({ username: user.username });
      if (existingUser) {
        throw new Error("Tên đăng nhập đã tồn tại");
      }

      // Hash the password
      user.password = await bcrypt.hash(user.password, 10);
      const result = await collection.insertOne(user);
      return { username: user.username, role: user.role };
    },

    // Login a user
    async login(username, password) {
      const user = await collection.findOne({ username });
      if (!user) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
      }

      // Generate JWT token
      const token = jwt.sign(
        { username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { token, user: { username: user.username, role: user.role } };
    },
  };
}

module.exports = UserService;