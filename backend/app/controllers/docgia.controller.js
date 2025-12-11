const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.Ten) {
        return next(new ApiError(400, "Tên không được để trống"));
    }
    try {
        const service = DocGiaService(MongoDB.client);
        const maDocGia = await service.create(req.body);
        return res.status(201).json({ MaDocGia: maDocGia });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo độc giả"));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const service = DocGiaService(MongoDB.client);
        const documents = await service.find(req.query);
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách độc giả"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = DocGiaService(MongoDB.client);
        const document = await service.findByMaDocGia(req.params.maDocGia);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy độc giả với MaDocGia=${req.params.maDocGia}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const service = DocGiaService(MongoDB.client);
        const success = await service.update(req.params.maDocGia, req.body);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send({ message: "Cập nhật độc giả thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật độc giả với MaDocGia=${req.params.maDocGia}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = DocGiaService(MongoDB.client);
        const success = await service.delete(req.params.maDocGia);
        if (!success) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        return res.send({ message: "Xóa độc giả thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa độc giả với MaDocGia=${req.params.maDocGia}`));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const service = DocGiaService(MongoDB.client);
        const deleteCount = await service.deleteAll();
        return res.send({ message: `Đã xóa ${deleteCount} độc giả thành công` });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa toàn bộ độc giả"));
    }
};