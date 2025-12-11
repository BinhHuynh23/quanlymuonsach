const express = require("express");
const cors = require("cors");

const docGiaRouter = require("./app/routes/docgia.route");
const nhanVienRouter = require("./app/routes/nhanvien.route");
const nhaXuatBanRouter = require("./app/routes/nhaxuatban.route");
const sachRouter = require("./app/routes/sach.route");
const theoDoiMuonSachRouter = require("./app/routes/theodoimuonsach.route");
const userRouter = require("./app/routes/user.route");
const authMiddleware = require("./app/middlewares/auth.middleware");
const roleMiddleware = require("./app/middlewares/role.middleware");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the library management system." });
});

// Các route không cần xác thực
app.use("/api/auth", userRouter);

// Các route cần xác thực
// Người dùng và admin đều có thể xem sách
app.use("/api/sach", authMiddleware, sachRouter);

// Người dùng và admin đều có thể tạo yêu cầu mượn sách, nhưng chỉ admin được duyệt
app.use("/api/theodoimuonsach", authMiddleware, theoDoiMuonSachRouter);

// Chỉ admin được truy cập các route sau
app.use("/api/docgia", authMiddleware, roleMiddleware("admin"), docGiaRouter);
app.use("/api/nhanvien", authMiddleware, roleMiddleware("admin"), nhanVienRouter);
app.use("/api/nhaxuatban", authMiddleware, roleMiddleware("admin"), nhaXuatBanRouter);

// Middleware xử lý lỗi
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;