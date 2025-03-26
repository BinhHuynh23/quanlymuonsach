<template>
  <div class="container mt-5">
    <div v-if="!isAuthenticated">
      <p class="text-danger">Bạn cần đăng nhập để truy cập trang này.</p>
    </div>
    <div v-else-if="!isAdmin">
      <p class="text-danger">Bạn không có quyền truy cập trang này.</p>
    </div>
    <div v-else>
      <NhanVienList ref="nhanVienList" @show-form="showForm" @delete="refreshNhanVien" />
      <div v-if="isFormVisible">
        <NhanVienForm
          :nhanVien="selectedNhanVien"
          @saved="refreshNhanVien"
          @close="isFormVisible = false"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NhanVienList from "@/components/NhanVienList.vue";
import NhanVienForm from "@/components/NhanVienForm.vue";

export default {
  components: { NhanVienList, NhanVienForm },
  data() {
    return {
      isFormVisible: false,
      selectedNhanVien: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      this.isAuthenticated = true;
      this.isAdmin = user.role === "admin";
    }
  },
  methods: {
    showForm(nhanVien) {
      this.selectedNhanVien = nhanVien;
      this.isFormVisible = true;
    },
    async refreshNhanVien() {
      this.isFormVisible = false;
      await this.$refs.nhanVienList.fetchNhanVien();
    },
    async handleDelete(maNhanVien) {
      if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
        await this.$refs.nhanVienList.deleteNhanVien(maNhanVien);
        this.isFormVisible = false;
      }
    },
  },
};
</script>