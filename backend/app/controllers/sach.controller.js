const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.TenSach) {
        return next(new ApiError(400, "Tên sách không được để trống"));
    }
    try {
        const service = SachService(MongoDB.client);
        const maSach = await service.create(req.body);
        return res.status(201).json({ MaSach: maSach });
    } catch (error) {
        return next(new ApiError(500, error.message || "Lỗi khi thêm sách"));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = SachService(MongoDB.client);
        const documents = await service.find(req.query);
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = SachService(MongoDB.client);
        const document = await service.findByMaSach(req.params.maSach);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy sách với MaSach=${req.params.maSach}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const service = SachService(MongoDB.client);
        const success = await service.update(req.params.maSach, req.body);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send({ message: "Cập nhật sách thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật sách với MaSach=${req.params.maSach}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = SachService(MongoDB.client);
        const success = await service.delete(req.params.maSach);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy sách"));
        }
        return res.send({ message: "Xóa sách thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa sách với MaSach=${req.params.maSach}`));
    }
};