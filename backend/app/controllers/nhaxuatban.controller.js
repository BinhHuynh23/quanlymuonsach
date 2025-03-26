const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.TenNXB) {
        return next(new ApiError(400, "Tên nhà xuất bản không được để trống"));
    }
    try {
        const service = NhaXuatBanService(MongoDB.client);
        const maNXB = await service.create(req.body);
        return res.status(201).json({ MaNXB: maNXB });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo nhà xuất bản"));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = NhaXuatBanService(MongoDB.client);
        const documents = await service.getAll();
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách nhà xuất bản"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = NhaXuatBanService(MongoDB.client);
        const document = await service.getByMaNXB(req.params.maNXB);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy nhà xuất bản với MaNXB=${req.params.maNXB}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const service = NhaXuatBanService(MongoDB.client);
        const success = await service.update(req.params.maNXB, req.body);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }
        return res.send({ message: "Cập nhật nhà xuất bản thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật nhà xuất bản với MaNXB=${req.params.maNXB}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = NhaXuatBanService(MongoDB.client);
        const success = await service.delete(req.params.maNXB);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }
        return res.send({ message: "Xóa nhà xuất bản thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa nhà xuất bản với MaNXB=${req.params.maNXB}`));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const service = NhaXuatBanService(MongoDB.client);
        const deletedCount = await service.deleteAll();
        return res.send({
            message: `nhà xuất bản đã được xóa thành công`,
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa tất cả nhà xuất bản"));
    }
};