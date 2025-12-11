const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

function NhanVienService(client) {
    const collection = client.db().collection("NhanVien");

    return {
        extractNhanVienData(payload) {
            const nhanVien = {
                MSNV: payload.MSNV,
                HoTenNV: payload.HoTenNV,
                Password: payload.Password,
                ChucVu: payload.ChucVu,
                DiaChi: payload.DiaChi,
                SoDienThoai: payload.SoDienThoai,
            };
            Object.keys(nhanVien).forEach((key) => nhanVien[key] === undefined && delete nhanVien[key]);
            return nhanVien;
        },

        async create(data) {
            const nhanVien = this.extractNhanVienData(data);
            const existingEmployee = await collection.findOne({ MSNV: nhanVien.MSNV });
            if (existingEmployee) {
                throw new Error("Nhân viên đã tồn tại");
            }
            // Hash password
            nhanVien.Password = await bcrypt.hash(nhanVien.Password, 10);
            const result = await collection.insertOne(nhanVien);
            return nhanVien.MSNV;
        },

        async getAll() {
            return await collection.find().toArray();
        },

        async getByMSNV(msnv) {
            return await collection.findOne({ MSNV: msnv });
        },

        async update(msnv, data) {
            const update = this.extractNhanVienData(data);
            if (update.Password) {
                update.Password = await bcrypt.hash(update.Password, 10);
            }
            const result = await collection.updateOne({ MSNV: msnv }, { $set: update });
            return result.modifiedCount > 0;
        },

        async delete(msnv) {
            const result = await collection.deleteOne({ MSNV: msnv });
            return result.deletedCount > 0;
        },
    };
}

module.exports = NhanVienService;