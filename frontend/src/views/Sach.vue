<template>
  <div class="container mt-5">
    <div v-if="!isAdmin && !canView">
      <p class="text-danger">Bạn không có quyền truy cập trang này.</p>
    </div>
    <div v-else>
      <SachList ref="sachList" @show-form="showForm" />
      <div v-if="isFormVisible">
        <SachForm :sach="selectedSach" @saved="refreshSach" @close="isFormVisible = false" />
      </div>
    </div>
  </div>
</template>

<script>
import SachList from "@/components/SachList.vue";
import SachForm from "@/components/SachForm.vue";

export default {
  components: { SachList, SachForm },
  data() {
    return {
      isFormVisible: false,
      selectedSach: null,
      isAdmin: false,
      canView: false,
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.isAdmin = user.role === "admin";
      this.canView = true; // Người dùng đăng nhập có thể xem danh sách sách
    }
  },
  methods: {
    showForm(sach) {
      if (!this.isAdmin) return; // Chỉ admin mới được thêm/sửa sách
      this.selectedSach = sach;
      this.isFormVisible = true;
    },
    async refreshSach() {
      this.isFormVisible = false;
      await this.$refs.sachList.fetchSach();
    },
  },
};
</script>