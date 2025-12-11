const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "Không có token, vui lòng đăng nhập"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng (username, role) vào req.user
    next();
  } catch (error) {
    return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
  }
};

module.exports = authMiddleware;