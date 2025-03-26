<template>
  <div class="container mt-5">
    <div v-if="!isAuthenticated">
      <p class="text-danger">Bạn cần đăng nhập để truy cập trang này.</p>
    </div>
    <div v-else>
      <NhaXuatBanList ref="nhaXuatBanList" @show-form="showForm" @delete="refreshNhaXuatBan" />
      <div v-if="isFormVisible" class="mt-4">
        <NhaXuatBanForm
          :nhaXuatBan="selectedNhaXuatBan"
          @saved="refreshNhaXuatBan"
          @close="isFormVisible = false"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NhaXuatBanList from "@/components/NhaXuatBanList.vue";
import NhaXuatBanForm from "@/components/NhaXuatBanForm.vue";

export default {
  components: { NhaXuatBanList, NhaXuatBanForm },
  data() {
    return {
      isFormVisible: false,
      selectedNhaXuatBan: null,
      isAuthenticated: false,
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      this.isAuthenticated = true;
    }
  },
  methods: {
    showForm(nhaXuatBan) {
      this.selectedNhaXuatBan = nhaXuatBan;
      this.isFormVisible = true;
    },
    async refreshNhaXuatBan() {
      this.isFormVisible = false;
      await this.$refs.nhaXuatBanList.fetchNhaXuatBan();
    },
    async handleDelete(maNXB) {
      if (confirm("Bạn có chắc muốn xóa nhà xuất bản này?")) {
        await this.$refs.nhaXuatBanList.deleteNhaXuatBan(maNXB);
        this.isFormVisible = false;
      }
    },
  },
};
</script>