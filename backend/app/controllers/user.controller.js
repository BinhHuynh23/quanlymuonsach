const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.register = async (req, res, next) => {
  if (!req.body?.username || !req.body?.password) {
    return next(new ApiError(400, "Tên đăng nhập và mật khẩu không được để trống"));
  }

  try {
    const service = UserService(MongoDB.client);
    const user = await service.register(req.body);
    return res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi khi đăng ký người dùng"));
  }
};

exports.login = async (req, res, next) => {
  if (!req.body?.username || !req.body?.password) {
    return next(new ApiError(400, "Tên đăng nhập và mật khẩu không được để trống"));
  }

  try {
    const service = UserService(MongoDB.client);
    const { token, user } = await service.login(req.body.username, req.body.password);
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(new ApiError(401, error.message || "Lỗi khi đăng nhập"));
  }
};