<!-- views/HomeView.vue -->
<template>
  <div class="home-view">
    <!-- Tiêu đề trang chủ -->
    <div class="text-center mb-5">
      <h1 class="display-4">Chào Mừng Đến Với Hệ Thống Quản Lý Mượn Sách</h1>
      <p class="lead text-muted">Quản lý độc giả, sách, nhà xuất bản, và theo dõi mượn sách một cách dễ dàng.</p>
    </div>

    <!-- Nội dung cho admin -->
    <div v-if="isAdmin">
      <!-- Thống kê tổng quan -->
      <div class="row mb-5">
        <div class="col-md-4 mb-4">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <i class="bi bi-person display-4 text-primary mb-3"></i>
              <h5 class="card-title">Số Độc Giả</h5>
              <p class="card-text display-6">{{ docGiaCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <i class="bi bi-book display-4 text-primary mb-3"></i>
              <h5 class="card-title">Số Sách</h5>
              <p class="card-text display-6">{{ sachCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <i class="bi bi-list-check display-4 text-primary mb-3"></i>
              <h5 class="card-title">Số Lượt Mượn</h5>
              <p class="card-text display-6">{{ muonSachCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liên kết nhanh -->
      <div class="row">
        <div class="col-md-4 mb-4">
          <router-link to="/docgia" class="text-decoration-none">
            <div class="card quick-link shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-person display-4 text-success mb-3"></i>
                <h5 class="card-title">Quản Lý Độc Giả</h5>
                <p class="card-text text-muted">Xem và quản lý danh sách độc giả.</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-md-4 mb-4">
          <router-link to="/sach" class="text-decoration-none">
            <div class="card quick-link shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-book display-4 text-success mb-3"></i>
                <h5 class="card-title">Quản Lý Sách</h5>
                <p class="card-text text-muted">Xem và quản lý danh sách sách.</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-md-4 mb-4">
          <router-link to="/nhaxuatban" class="text-decoration-none">
            <div class="card quick-link shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-building display-4 text-success mb-3"></i>
                <h5 class="card-title">Quản Lý Nhà Xuất Bản</h5>
                <p class="card-text text-muted">Xem và quản lý danh sách nhà xuất bản.</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-md-4 mb-4">
          <router-link to="/theodoimuonsach" class="text-decoration-none">
            <div class="card quick-link shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-list-check display-4 text-success mb-3"></i>
                <h5 class="card-title">Theo Dõi Mượn Sách</h5>
                <p class="card-text text-muted">Quản lý các lượt mượn và trả sách.</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-md-4 mb-4">
          <router-link to="/nhanvien" class="text-decoration-none">
            <div class="card quick-link shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-person-badge display-4 text-success mb-3"></i>
                <h5 class="card-title">Quản Lý Nhân Viên</h5>
                <p class="card-text text-muted">Xem và quản lý danh sách nhân viên.</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Nội dung cho user -->
    <div v-else class="alert alert-info text-center">
      <p>
        Xin chào, {{ userName }}! Bạn có thể
        <router-link to="/sach" class="alert-link">xem danh sách sách</router-link>
        và
        <router-link to="/muonsach" class="alert-link">gửi yêu cầu mượn sách</router-link>.
      </p>
    </div>
  </div>
</template>

<script>
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
  data() {
    return {
      docGiaCount: 0,
      sachCount: 0,
      muonSachCount: 0,
      isAdmin: false,
      userName: '',
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      this.isAdmin = true;
    }
    this.userName = user ? (user.hoTen || user.HoTenNV || 'Người dùng') : 'Khách';
    if (this.isAdmin) {
      this.fetchStats();
    }
  },
  methods: {
    async fetchStats() {
      try {
        const docGias = await DocGiaService.getAll();
        this.docGiaCount = docGias.length;

        const sachs = await SachService.getAll();
        this.sachCount = sachs.length;

        const muonSach = await TheoDoiMuonSachService.getAll();
        this.muonSachCount = muonSach.length;
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        alert(error.message);
      }
    },
  },
};
</script>

<style scoped>
.home-view {
  padding: 20px 0;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.lead {
  font-size: 1.2rem;
}

.card {
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.quick-link {
  background-color: #fff;
  border: 1px solid #ddd;
}

.quick-link:hover {
  background-color: #f8f9fa;
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
}

.card-text {
  font-size: 1rem;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b8daff;
  color: #004085;
}

.alert-link {
  color: #003087;
  text-decoration: underline;
}

.alert-link:hover {
  color: #0056b3;
}
</style>