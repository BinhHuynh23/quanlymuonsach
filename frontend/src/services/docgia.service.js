import createApiClient from "./api.service";

class DocGiaService {
    constructor(baseUrl = "/api/docgia") {
        this.api = createApiClient(baseUrl);
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

     async getAll() {
        return (await this.api.get("/")).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }

    async get(maDocGia) {
        return (await this.api.get(`/${maDocGia}`)).data
    }

    async update(maDocGia, data) {
        return (await this.api.put(`/${maDocGia}`, data)).data;
    }

    async delete(maDocGia) {
        return (await this.api.delete(`/${maDocGia}`)).data;
    }
}

 export default new DocGiaService();