import createApiClient from "./api.service";

class NhaXuatBanService {
    constructor(baseUrl = "/api/nhaxuatban") {
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

    async get(maNXB) {
        return (await this.api.get(`/${maNXB}`)).data
    }

    async update(maNXB, data) {
        return (await this.api.put(`/${maNXB}`, data)).data;
    }

    async delete(maNXB) {
        return (await this.api.delete(`/${maNXB}`)).data;
    }
}

 export default new NhaXuatBanService();