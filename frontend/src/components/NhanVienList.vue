<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Danh Sách Nhân Viên</h2>
      <button class="btn btn-primary" @click="addNhanVien">
        <i class="bi bi-plus-circle me-2"></i> Thêm Nhân Viên
      </button>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm nhân viên..."
          v-model="searchQuery"
          @input="filterNhanViens"
        />
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Mã Nhân Viên</th>
            <th>Họ Tên</th>
            <th>Chức Vụ</th>
            <th>Địa Chỉ</th>
            <th>Số Điện Thoại</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nhanVien in paginatedNhanViens" :key="nhanVien.MSNV">
            <td>{{ nhanVien.MSNV }}</td>
            <td>{{ nhanVien.HoTenNV }}</td>
            <td>{{ nhanVien.ChucVu }}</td>
            <td>{{ nhanVien.DiaChi }}</td>
            <td>{{ nhanVien.SoDienThoai }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="editNhanVien(nhanVien)">
                <i class="bi bi-pencil"></i> Sửa
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteNhanVien(nhanVien.MSNV)">
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
import NhanVienService from "@/services/nhanvien.service";

export default {
  data() {
    return {
      nhanViens: [],
      filteredNhanViens: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    paginatedNhanViens() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNhanViens.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredNhanViens.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchNhanVien() {
      try {
        this.nhanViens = await NhanVienService.getAll();
        this.filteredNhanViens = [...this.nhanViens];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
        alert(error.message);
      }
    },
    filterNhanViens() {
      const query = this.searchQuery.toLowerCase();
      this.filteredNhanViens = this.nhanViens.filter(
        (nhanVien) =>
          nhanVien.HoTenNV.toLowerCase().includes(query) ||
          nhanVien.MSNV.toLowerCase().includes(query)
      );
      this.currentPage = 1;
    },
    addNhanVien() {
      this.$emit("show-form", null);
    },
    editNhanVien(nhanVien) {
      this.$emit("show-form", nhanVien);
    },
    async deleteNhanVien(MSNV) {
      try {
        if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
          await NhanVienService.delete(MSNV);
          await this.fetchNhanVien();
          this.$emit("delete", MSNV);
        }
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        alert(error.message);
      }
    },
  },
  mounted() {
    this.fetchNhanVien();
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