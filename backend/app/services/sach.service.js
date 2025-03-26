const { ObjectId } = require("mongodb");

function SachService(client) {
    const collection = client.db().collection("Sach");

    return {
        extractSachData(payload) {
            const sach = {
                MaSach: payload.MaSach,
                TenSach: payload.TenSach,
                DonGia: payload.DonGia,
                SoQuyen: payload.SoQuyen,
                NamXuatBan: payload.NamXuatBan,
                MaNXB: payload.MaNXB,
                TacGia: payload.TacGia,
            };
            Object.keys(sach).forEach((key) => sach[key] === undefined && delete sach[key]);
            return sach;
        },

        async create(payload) {
            const sach = this.extractSachData(payload);
            const existingSach = await collection.findOne({ MaSach: sach.MaSach });
            if (existingSach) {
                throw new Error("Mã sách đã tồn tại");
            }
            const nhaXuatBan = await client.db().collection("NhaXuatBan").findOne({ MaNXB: sach.MaNXB });
            if (!nhaXuatBan) {
                throw new Error("Nhà xuất bản không tồn tại");
            }
            const result = await collection.insertOne(sach);
            return sach.MaSach;
        },

        async find(filter = {}) {
            return await collection.find(filter).toArray();
        },

        async findByMaSach(maSach) {
            return await collection.findOne({ MaSach: maSach });
        },

        async update(maSach, payload) {
            const update = this.extractSachData(payload);
            if (update.MaNXB) {
                const nhaXuatBan = await client.db().collection("NhaXuatBan").findOne({ MaNXB: update.MaNXB });
                if (!nhaXuatBan) {
                    throw new Error("Nhà xuất bản không tồn tại");
                }
            }
            const result = await collection.updateOne({ MaSach: maSach }, { $set: update });
            return result.modifiedCount > 0;
        },

        async delete(maSach) {
            const result = await collection.deleteOne({ MaSach: maSach });
            return result.deletedCount > 0;
        },
    };
}

module.exports = SachService;