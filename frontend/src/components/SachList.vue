<template>
  <div class="card">
    <div v-if="isAdmin" class="card-header d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Danh Sách Sách</h2>
      <button class="btn btn-primary" @click="addSach">
        <i class="bi bi-plus-circle me-2"></i> Thêm Sách
      </button>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <div class="row">
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm sách..."
              v-model="searchQuery"
              @input="filterSachs"
            />
          </div>
          <div class="col-md-4">
            <select class="form-control" v-model="filterTacGia" @change="filterSachs">
              <option value="">Tất cả tác giả</option>
              <option v-for="tacGia in uniqueTacGia" :key="tacGia" :value="tacGia">
                {{ tacGia }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-control" v-model="filterNXB" @change="filterSachs">
              <option value="">Tất cả nhà xuất bản</option>
              <option v-for="nxb in nhaXuatBanList" :key="nxb.MaNXB" :value="nxb.MaNXB">
                {{ nxb.TenNXB }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Mã Sách</th>
            <th>Tên Sách</th>
            <th>Tác Giả</th>
            <th>Nhà Xuất Bản</th>
            <th>Đơn Giá</th>
            <th>Số Quyển</th>
            <th>Năm Xuất Bản</th>
            <th v-if="isAdmin">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sach in paginatedSachs" :key="sach.MaSach">
            <td>{{ sach.MaSach }}</td>
            <td>{{ sach.TenSach }}</td>
            <td>{{ sach.TacGia }}</td>
            <td>{{ getTenNXB(sach.MaNXB) }}</td>
            <td>{{ sach.DonGia.toLocaleString("vi-VN") }} VNĐ</td>
            <td>{{ sach.SoQuyen }}</td>
            <td>{{ sach.NamXuatBan }}</td>
            <td v-if="isAdmin">
              <button class="btn btn-warning btn-sm me-2" @click="editSach(sach)">
                <i class="bi bi-pencil"></i> Sửa
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteSach(sach.MaSach)">
                <i class="bi bi-trash"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--">&laquo;</button>
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
            <button class="page-link" @click="currentPage++">&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  data() {
    return {
      sachs: [],
      filteredSachs: [],
      nhaXuatBanList: [],
      searchQuery: "",
      filterTacGia: "",
      filterNXB: "",
      currentPage: 1,
      itemsPerPage: 5,
      isAdmin: false,
    };
  },
  computed: {
    paginatedSachs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSachs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredSachs.length / this.itemsPerPage);
    },
    uniqueTacGia() {
      return [...new Set(this.sachs.map((sach) => sach.TacGia))].sort();
    },
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      this.isAdmin = true;
    }
    this.fetchSach();
    this.fetchNhaXuatBan();
  },
  methods: {
    async fetchSach() {
      try {
        this.sachs = await SachService.getAll();
        this.filterSachs();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        alert(error.message);
      }
    },
    async fetchNhaXuatBan() {
      try {
        this.nhaXuatBanList = await NhaXuatBanService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách NXB:", error);
      }
    },
    getTenNXB(maNXB) {
      const nxb = this.nhaXuatBanList.find((nxb) => nxb.MaNXB === maNXB);
      return nxb ? nxb.TenNXB : maNXB;
    },
    filterSachs() {
      let result = [...this.sachs];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          (sach) =>
            sach.TenSach.toLowerCase().includes(query) ||
            sach.MaSach.toLowerCase().includes(query) ||
            sach.TacGia.toLowerCase().includes(query)
        );
      }

      if (this.filterTacGia) {
        result = result.filter((sach) => sach.TacGia === this.filterTacGia);
      }

      if (this.filterNXB) {
        result = result.filter((sach) => sach.MaNXB === this.filterNXB);
      }

      this.filteredSachs = result;
      this.currentPage = 1;
    },
    addSach() {
      this.$emit("show-form", null);
    },
    editSach(sach) {
      this.$emit("show-form", sach);
    },
    async deleteSach(maSach) {
      try {
        if (confirm("Bạn có chắc muốn xóa sách này?")) {
          await SachService.delete(maSach);
          await this.fetchSach();
          this.$emit("delete", maSach);
        }
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        alert(error.message);
      }
    },
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