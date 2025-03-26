const MongoDB = require("../utils/mongodb.util");
const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await theoDoiMuonSachService.create(req.body);
    return res.status(201).json(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo yêu cầu mượn sách"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const documents = await theoDoiMuonSachService.getAll();
    return res.status(200).json(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách yêu cầu mượn sách"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await theoDoiMuonSachService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy yêu cầu mượn sách"));
    }
    return res.status(200).json(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy thông tin yêu cầu mượn sách"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await theoDoiMuonSachService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy yêu cầu mượn sách"));
    }
    return res.status(200).json({ message: "Cập nhật yêu cầu mượn sách thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật yêu cầu mượn sách"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const { maDocGia, maSach } = req.params;
    const result = await theoDoiMuonSachService.delete(maDocGia, maSach);
    if (!result) {
      return res.status(404).json({ message: "Bản ghi mượn sách không tồn tại" });
    }
    res.status(200).json({ message: "Xóa bản ghi mượn sách thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bản ghi mượn sách", error });
  }
};

exports.findByDocGia = async (req, res, next) => {
  try {
    const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
    const documents = await theoDoiMuonSachService.getByDocGia(req.params.maDocGia);
    return res.status(200).json(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy yêu cầu mượn sách theo độc giả"));
  }
};