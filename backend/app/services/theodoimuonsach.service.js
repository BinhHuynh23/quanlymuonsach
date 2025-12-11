const { ObjectId } = require("mongodb");

function TheoDoiMuonSachService(client) {
    const collection = client.db().collection("TheoDoiMuonSach");

    return {
        extractTheoDoiMuonSachData(payload) {
            const theoDoiMuonSach = {
                MaDocGia: payload.MaDocGia,
                MaSach: payload.MaSach,
                NgayMuon: payload.NgayMuon,
                NgayTra: payload.NgayTra,
            };
            Object.keys(theoDoiMuonSach).forEach((key) => theoDoiMuonSach[key] === undefined && delete theoDoiMuonSach[key]);
            return theoDoiMuonSach;
        },

        async create(data) {
            const theoDoiMuonSach = this.extractTheoDoiMuonSachData(data);
            const docGia = await client.db().collection("DocGia").findOne({ MaDocGia: theoDoiMuonSach.MaDocGia });
            if (!docGia) {
                throw new Error("Độc giả không tồn tại");
            }
            const sach = await client.db().collection("Sach").findOne({ MaSach: theoDoiMuonSach.MaSach });
            if (!sach) {
                throw new Error("Sách không tồn tại");
            }
            const existingRecord = await collection.findOne({ MaDocGia: theoDoiMuonSach.MaDocGia, MaSach: theoDoiMuonSach.MaSach });
            if (existingRecord) {
                throw new Error("Đã tồn tại bản ghi này");
            }
            const result = await collection.insertOne(theoDoiMuonSach);
            return result.insertedId;
        },

        async getAll() {
            return await collection.find().toArray();
        },

        async getByDocGia(maDocGia) {
            return await collection.find({ MaDocGia: maDocGia }).toArray();
        },

        async getBySach(maSach) {
            return await collection.find({ MaSach: maSach }).toArray();
        },

        async update(maDocGia, maSach, data) {
            const theoDoiMuonSach = this.extractTheoDoiMuonSachData(data);
            if (theoDoiMuonSach.MaDocGia) {
                const docGia = await client.db().collection("DocGia").findOne({ MaDocGia: theoDoiMuonSach.MaDocGia });
                if (!docGia) {
                    throw new Error("Độc giả không tồn tại");
                }
            }
            if (theoDoiMuonSach.MaSach) {
                const sach = await client.db().collection("Sach").findOne({ MaSach: theoDoiMuonSach.MaSach });
                if (!sach) {
                    throw new Error("Sách không tồn tại");
                }
            }
            const result = await collection.updateOne({ MaDocGia: maDocGia, MaSach: maSach }, { $set: theoDoiMuonSach });
            return result.modifiedCount > 0;
        },

        async delete(maDocGia, maSach) {
            const result = await collection.deleteOne({ MaDocGia: maDocGia, MaSach: maSach });
            return result.deletedCount > 0;
        },
    };
}

module.exports = TheoDoiMuonSachService;