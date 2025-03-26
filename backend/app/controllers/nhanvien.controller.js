const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.MSNV || !req.body?.Password) {
        return next(new ApiError(400, "MSNV và mật khẩu không được để trống"));
    }
    try {
        const service = NhanVienService(MongoDB.client);
        const msnv = await service.create(req.body);
        return res.status(201).json({ MSNV: msnv });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo nhân viên"));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = NhanVienService(MongoDB.client);
        const documents = await service.getAll();
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = NhanVienService(MongoDB.client);
        const document = await service.getByMSNV(req.params.msnv);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy nhân viên với MSNV=${req.params.msnv}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const service = NhanVienService(MongoDB.client);
        const success = await service.update(req.params.msnv, req.body);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({ message: "Cập nhật nhân viên thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật nhân viên với MSNV=${req.params.msnv}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = NhanVienService(MongoDB.client);
        const success = await service.delete(req.params.msnv);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.send({ message: "Xóa nhân viên thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa nhân viên với MSNV=${req.params.msnv}`));
    }
};

exports.authenticate = async (req, res, next) => {
    if (!req.body?.MSNV || !req.body?.Password) {
        return next(new ApiError(400, "MSNV và mật khẩu không được để trống"));
    }
    try {
        const service = NhanVienService(MongoDB.client);
        const document = await service.authenticate(req.body.MSNV, req.body.Password);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(401, "Sai MSNV hoặc mật khẩu"));
    }
};