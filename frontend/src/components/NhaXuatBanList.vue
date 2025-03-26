<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Danh Sách Nhà Xuất Bản</h2>
      <button class="btn btn-primary" @click="addNhaXuatBan">
        <i class="bi bi-plus-circle me-2"></i> Thêm Nhà Xuất Bản
      </button>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm nhà xuất bản..."
          v-model="searchQuery"
          @input="filterNhaXuatBans"
        />
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa Chỉ</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nxb in paginatedNhaXuatBans" :key="nxb.MaNXB">
            <td>{{ nxb.MaNXB }}</td>
            <td>{{ nxb.TenNXB }}</td>
            <td>{{ nxb.DiaChi }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="editNhaXuatBan(nxb)">
                <i class="bi bi-pencil"></i> Sửa
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteNhaXuatBan(nxb.MaNXB)">
                <i class="bi bi-trash"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--">«</button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++">»</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  data() {
    return {
      nhaXuatBans: [],
      filteredNhaXuatBans: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    paginatedNhaXuatBans() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNhaXuatBans.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredNhaXuatBans.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchNhaXuatBan() {
      try {
        this.nhaXuatBans = await NhaXuatBanService.getAll();
        this.filteredNhaXuatBans = [...this.nhaXuatBans];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
        alert(error.message);
      }
    },
    filterNhaXuatBans() {
      const query = this.searchQuery.toLowerCase();
      this.filteredNhaXuatBans = this.nhaXuatBans.filter(
        (nxb) =>
          nxb.TenNXB.toLowerCase().includes(query) ||
          nxb.MaNXB.toLowerCase().includes(query)
      );
      this.currentPage = 1;
    },
    addNhaXuatBan() {
      this.$emit("show-form", null);
    },
    editNhaXuatBan(nxb) {
      this.$emit("show-form", nxb);
    },
    async deleteNhaXuatBan(maNXB) {
      try {
        if (confirm("Bạn có chắc muốn xóa nhà xuất bản này?")) {
          await NhaXuatBanService.delete(maNXB);
          await this.fetchNhaXuatBan();
          this.$emit("delete", maNXB);
        }
      } catch (error) {
        console.error("Lỗi khi xóa nhà xuất bản:", error);
        alert(error.message);
      }
    },
  },
  mounted() {
    this.fetchNhaXuatBan();
  },
};
</script>

<style scoped>
.card-header {
  background-color: #3498db;
  color: #fff;
}

.btn-warning {
  background-color: #f39c12;
  border-color: #f39c12;
}

.btn-danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

.table th,
.table td {
  vertical-align: middle;
}
</style>