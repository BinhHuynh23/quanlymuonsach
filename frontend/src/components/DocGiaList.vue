<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Danh Sách Độc Giả</h2>
      <button class="btn btn-primary" @click="addDocGia">
        <i class="bi bi-plus-circle me-2"></i> Thêm Độc Giả
      </button>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm độc giả..."
          v-model="searchQuery"
          @input="filterDocGias"
        />
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Mã Độc Giả</th>
            <th>Họ Tên</th>
            <th>Ngày Sinh</th>
            <th>Phái</th>
            <th>Địa Chỉ</th>
            <th>Điện Thoại</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="docGia in paginatedDocGias" :key="docGia.MaDocGia">
            <td>{{ docGia.MaDocGia }}</td>
            <td>{{ docGia.HoLot }} {{ docGia.Ten }}</td>
            <td>{{ docGia.NgaySinh }}</td>
            <td>{{ docGia.Phai }}</td>
            <td>{{ docGia.DiaChi }}</td>
            <td>{{ docGia.DienThoai }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="editDocGia(docGia)">
                <i class="bi bi-pencil"></i> Sửa
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteDocGia(docGia.MaDocGia)">
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
import DocGiaService from "@/services/docgia.service";

export default {
  data() {
    return {
      docGias: [],
      filteredDocGias: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    paginatedDocGias() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDocGias.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredDocGias.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchDocGia() {
      try {
        this.docGias = await DocGiaService.getAll();
        this.filteredDocGias = [...this.docGias];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách độc giả:", error);
        alert(error.message);
      }
    },
    filterDocGias() {
      const query = this.searchQuery.toLowerCase();
      this.filteredDocGias = this.docGias.filter(
        (docGia) =>
          `${docGia.HoLot} ${docGia.Ten}`.toLowerCase().includes(query) ||
          docGia.MaDocGia.toLowerCase().includes(query)
      );
      this.currentPage = 1;
    },
    addDocGia() {
      this.$emit("show-form", null);
    },
    editDocGia(docGia) {
      this.$emit("show-form", docGia);
    },
    async deleteDocGia(maDocGia) {
      try {
        if (confirm("Bạn có chắc muốn xóa độc giả này?")) {
          await DocGiaService.delete(maDocGia);
          await this.fetchDocGia();
          this.$emit("delete", maDocGia);
        }
      } catch (error) {
        console.error("Lỗi khi xóa độc giả:", error);
        alert(error.message);
      }
    },
  },
  mounted() {
    this.fetchDocGia();
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
</style>