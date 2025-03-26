const { ObjectId } = require('mongodb');

function DocGiaService(client) {
    const collection = client.db().collection("DocGia");
    return {
        extractDocGiaData(payload) {
            const docGia = {
                MaDocGia: payload.MaDocGia,
                HoLot: payload.HoLot,
                Ten: payload.Ten,
                NgaySinh: payload.NgaySinh,
                Phai: payload.Phai,
                DiaChi: payload.DiaChi,
                DienThoai: payload.DienThoai,
            };
            Object.keys(docGia).forEach((key) => docGia[key] === undefined && delete docGia[key]);
            return docGia;
        },

        async create(payload) {
            const docGia = this.extractDocGiaData(payload);
            const existingDocGia = await collection.findOne({ MaDocGia: docGia.MaDocGia });
            if (existingDocGia) {
                throw new Error("Mã độc giả đã tồn tại");
            }
            const result = await collection.insertOne(docGia);
            return docGia.MaDocGia;
        },

        async find(filter = {}) {
            return await collection.find(filter).toArray();
        },

        async findByMaDocGia(maDocGia) {
            return await collection.findOne({ MaDocGia: maDocGia });
        },

        async update(maDocGia, payload) {
            const update = this.extractDocGiaData(payload);
            const result = await collection.updateOne({ MaDocGia: maDocGia }, { $set: update });
            return result.modifiedCount > 0;
        },

        async delete(maDocGia) {
            await client.db().collection("TheoDoiMuonSach").deleteMany({ MaDocGia: maDocGia });
            const result = await collection.deleteOne({ MaDocGia: maDocGia });
            return result.deletedCount > 0;
        },

        async deleteAll() {
            const result = await collection.deleteMany({});
            return result.deletedCount;
        },
    };
}

module.exports = DocGiaService;