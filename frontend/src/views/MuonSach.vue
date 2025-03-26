<template>
  <div class="container mt-5">
    <h1>Gửi Yêu Cầu Mượn Sách</h1>
    <MuonSachForm @saved="refresh" />
  </div>
</template>

<script>
import MuonSachForm from "@/components/MuonSachForm.vue";

export default {
  components: { MuonSachForm },
  methods: {
    refresh() {
      // Có thể làm mới hoặc chuyển hướng nếu cần
    },
  },
};
</script>