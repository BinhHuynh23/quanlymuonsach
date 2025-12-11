<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Danh Sách Mượn Sách</h2>
      <button class="btn btn-primary" @click="addTheoDoi">
        <i class="bi bi-plus-circle me-2"></i> Thêm Mượn Sách
      </button>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm mượn sách..."
          v-model="searchQuery"
          @input="filterTheoDoi"
        />
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Mã Độc Giả</th>
            <th>Tên Độc Giả</th>
            <th>Mã Sách</th>
            <th>Tên Sách</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="theoDoi in paginatedTheoDoi" :key="`${theoDoi.MaDocGia}-${theoDoi.MaSach}`">
            <td>{{ theoDoi.MaDocGia }}</td>
            <td>{{ getTenDocGia(theoDoi.MaDocGia) }}</td>
            <td>{{ theoDoi.MaSach }}</td>
            <td>{{ getTenSach(theoDoi.MaSach) }}</td>
            <td>{{ theoDoi.NgayMuon }}</td>
            <td>{{ theoDoi.NgayTra || "Chưa trả" }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="deleteTheoDoi(theoDoi.MaDocGia, theoDoi.MaSach)">
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
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";

export default {
  data() {
    return {
      theoDoiList: [],
      filteredTheoDoi: [],
      docGias: [],
      sachs: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    paginatedTheoDoi() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTheoDoi.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTheoDoi.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchTheoDoi() {
      try {
        this.theoDoiList = await TheoDoiMuonSachService.getAll();
        this.filteredTheoDoi = [...this.theoDoiList];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mượn sách:", error);
        alert(error.message);
      }
    },
    async fetchDocGia() {
      try {
        this.docGias = await DocGiaService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách độc giả:", error);
      }
    },
    async fetchSach() {
      try {
        this.sachs = await SachService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },
    getTenDocGia(maDocGia) {
      const docGia = this.docGias.find((dg) => dg.MaDocGia === maDocGia);
      return docGia ? `${docGia.HoLot} ${docGia.Ten}` : maDocGia;
    },
    getTenSach(maSach) {
      const sach = this.sachs.find((s) => s.MaSach === maSach);
      return sach ? sach.TenSach : maSach;
    },
    filterTheoDoi() {
      const query = this.searchQuery.toLowerCase();
      this.filteredTheoDoi = this.theoDoiList.filter(
        (theoDoi) =>
          theoDoi.MaDocGia.toLowerCase().includes(query) ||
          theoDoi.MaSach.toLowerCase().includes(query) ||
          this.getTenDocGia(theoDoi.MaDocGia).toLowerCase().includes(query) ||
          this.getTenSach(theoDoi.MaSach).toLowerCase().includes(query)
      );
      this.currentPage = 1;
    },
    addTheoDoi(){
      this.$emit("show-form", null);
    },
    async deleteTheoDoi(maDocGia, maSach) {
  console.log("maDocGia:", maDocGia, "maSach:", maSach);
  try {
    if (confirm("Bạn có chắc muốn xóa bản ghi mượn sách này?")) {
      await TheoDoiMuonSachService.delete(maDocGia, maSach);
      await this.fetchTheoDoi();
      this.$emit("delete", { maDocGia, maSach });
    }
  } catch (error) {
    console.error("Lỗi khi xóa bản ghi mượn sách:", error);
    alert(error.message);
  }
}
  },
  mounted() {
    this.fetchTheoDoi();
    this.fetchDocGia();
    this.fetchSach();
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