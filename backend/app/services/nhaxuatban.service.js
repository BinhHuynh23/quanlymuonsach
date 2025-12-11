const { ObjectId } = require("mongodb");

function NhaXuatBanService(client) {
    const collection = client.db().collection("NhaXuatBan");

    return {
        extractNhaXuatBanData(payload) {
            const nhaXuatBan = {
                MaNXB: payload.MaNXB,
                TenNXB: payload.TenNXB,
                DiaChi: payload.DiaChi,
            };
            Object.keys(nhaXuatBan).forEach((key) => nhaXuatBan[key] === undefined && delete nhaXuatBan[key]);
            return nhaXuatBan;
        },

        async create(payload) {
            const nhaXuatBan = this.extractNhaXuatBanData(payload);
            const existingNXB = await collection.findOne({ MaNXB: nhaXuatBan.MaNXB });
            if (existingNXB) {
                throw new Error("Mã nhà xuất bản đã tồn tại");
            }
            const result = await collection.insertOne(nhaXuatBan);
            return nhaXuatBan.MaNXB;
        },

        async getAll() {
            return await collection.find().toArray();
        },

        async getByMaNXB(maNXB) {
            return await collection.findOne({ MaNXB: maNXB });
        },

        async update(maNXB, data) {
            const update = this.extractNhaXuatBanData(data);
            const result = await collection.updateOne({ MaNXB: maNXB }, { $set: update });
            return result.modifiedCount > 0;
        },

        async delete(maNXB) {
            const result = await collection.deleteOne({ MaNXB: maNXB });
            return result.deletedCount > 0;
        },

        async deleteAll() {
            const result = await collection.deleteMany({});
            return result.deletedCount > 0;
        }
    };
}

module.exports = NhaXuatBanService;