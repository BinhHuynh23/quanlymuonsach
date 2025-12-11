import createApiClient from "./api.service";

class SachService {
    constructor(baseUrl = "/api/sach") {
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

    async get(maSach) {
        return (await this.api.get(`/${maSach}`)).data
    }

    async update(maSach, data) {
        return (await this.api.put(`/${maSach}`, data)).data;
    }

    async delete(maSach) {
        return (await this.api.delete(`/${maSach}`)).data;
    }
}

 export default new SachService();