const ApiError = require("../api-error");

const roleMiddleware = (requiredRole) => (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== requiredRole) {
    return next(new ApiError(403, "Bạn không có quyền truy cập tài nguyên này"));
  }
  next();
};

module.exports = roleMiddleware;