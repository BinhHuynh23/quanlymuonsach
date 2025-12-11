const express = require("express");
const TheoDoiMuonSachController = require("../controllers/theodoimuonsach.controller");
const roleMiddleware = require("../middlewares/role.middleware");

const routerTheoDoiMuonSach = express.Router();

// Người dùng và admin đều có thể tạo yêu cầu mượn sách
routerTheoDoiMuonSach.route("/")
  .post(TheoDoiMuonSachController.create)
  // Chỉ admin được xem danh sách yêu cầu
  .get(roleMiddleware("admin"), TheoDoiMuonSachController.findAll);

// Chỉ admin được xem, cập nhật, hoặc xóa một yêu cầu cụ thể
routerTheoDoiMuonSach.route("/:id")
  .get(roleMiddleware("admin"), TheoDoiMuonSachController.findOne)
  .put(roleMiddleware("admin"), TheoDoiMuonSachController.update)
  .delete(roleMiddleware("admin"), TheoDoiMuonSachController.delete);

// Người dùng có thể xem yêu cầu mượn sách của họ
routerTheoDoiMuonSach.route("/docgia/:maDocGia")
  .get(TheoDoiMuonSachController.findByDocGia);

// Thêm tuyến đường DELETE dựa trên maDocGia và maSach
routerTheoDoiMuonSach.route("/docgia/:maDocGia/sach/:maSach")
  .delete(roleMiddleware("admin"), TheoDoiMuonSachController.delete);

module.exports = routerTheoDoiMuonSach;