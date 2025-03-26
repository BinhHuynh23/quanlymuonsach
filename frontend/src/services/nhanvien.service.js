import createApiClient from "./api.service";

class NhanVienService {
    constructor(baseUrl = "/api/nhanvien") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async get(maNhanVien) {
        return (await this.api.get(`/${maNhanVien}`)).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async update(maNhanVien, data) {
        return (await this.api.put(`/${maNhanVien}`, data)).data;
    }

    async delete(maNhanVien) {
        return (await this.api.delete(`/${maNhanVien}`)).data;
    }

    async authenticate(credentials) {
        return (await this.api.post("/login", credentials)).data;
    }
}

export default new NhanVienService();