<template>
  <div class="container mt-5">
    <div v-if="!isAdmin && !canView">
      <p class="text-danger">Bạn không có quyền truy cập trang này.</p>
    </div>
    <div v-else>
      <TheoDoiMuonSachList ref="theoDoiMuonSachList" @show-form="showForm" />
      <div v-if="isFormVisible">
        <TheoDoiMuonSachForm :theoDoi="selectedTheoDoi" @saved="refreshTheoDoi" @close="isFormVisible = false" />
      </div>
    </div>
  </div>
</template>

<script>
import TheoDoiMuonSachList from "@/components/TheoDoiMuonSachList.vue";
import TheoDoiMuonSachForm from "@/components/TheoDoiMuonSachForm.vue";

export default {
  components: { TheoDoiMuonSachList, TheoDoiMuonSachForm },
  data() {
    return {
      isFormVisible: false,
      selectedTheoDoi: null,
      isAdmin: false,
      canView: false,
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.isAdmin = user.role === "admin";
      this.canView = true; // Người dùng đăng nhập có thể xem danh sách theo dõi mượn sách
    }
  },
  methods: {
    showForm(theoDoi) {
      if (!this.isAdmin) return; // Chỉ admin mới được thêm/sửa theo dõi mượn sách
      this.selectedTheoDoi = theoDoi;
      this.isFormVisible = true;
    },
    async refreshTheoDoi() {
      this.isFormVisible = false;
      await this.$refs.theoDoiMuonSachList.fetchTheoDoi();
    },
  },
};
</script>

<style scoped>
.card-header {
  background-color: #3498db;
  color: #fff;
}

.error-feedback {
  color: #e74c3c;
  font-size: 14px;
}
</style>