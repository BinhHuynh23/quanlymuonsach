import createApiClient from "./api.service";

class TheoDoiMuonSachService {
  constructor(baseUrl = "/api/theodoimuonsach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async getByDocGia(maDocGia) {
    return (await this.api.get(`/docgia/${maDocGia}`)).data;
  }

  async getBySach(maSach) {
    return (await this.api.get(`/sach/${maSach}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(maDocGia, maSach, data) {
    return (await this.api.put(`/docgia/${maDocGia}/sach/${maSach}`, data)).data;
  }

  async delete(maDocGia, maSach) {
    return (await this.api.delete(`/docgia/${maDocGia}/sach/${maSach}`)).data;
  }
}

export default new TheoDoiMuonSachService();