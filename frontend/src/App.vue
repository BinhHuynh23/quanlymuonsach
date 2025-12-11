<template>
  <div id="app">
    <nav v-if="isAuthenticated" class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-book me-2"></i> Quản Lý Mượn Sách
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <!-- Hiển thị cho cả admin và user -->
            <li class="nav-item">
              <router-link class="nav-link" to="/sach">
                <i class="bi bi-book me-1"></i> Sách
              </router-link>
            </li>
            <!-- Chỉ hiển thị cho user -->
            <li v-if="!isAdmin" class="nav-item">
              <router-link class="nav-link" to="/muonsach">
                <i class="bi bi-bookmark me-1"></i> Mượn Sách
              </router-link>
            </li>
            <!-- Chỉ hiển thị cho admin -->
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" to="/docgia">
                <i class="bi bi-person me-1"></i> Độc Giả
              </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" to="/nhaxuatban">
                <i class="bi bi-building me-1"></i> Nhà Xuất Bản
              </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" to="/theodoimuonsach">
                <i class="bi bi-list-check me-1"></i> Theo Dõi Mượn Sách
              </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" to="/nhanvien">
                <i class="bi bi-person-badge me-1"></i> Nhân Viên
              </router-link>
            </li>
          </ul>
          <div class="navbar-nav">
            <button class="btn btn-outline-light" @click="logout">
              <i class="bi bi-box-arrow-right me-1"></i> Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false,
      isAdmin: false,
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      this.isAuthenticated = !!token && !!user;
      this.isAdmin = user && user.role === "admin";
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.isAuthenticated = false;
      this.isAdmin = false;
      this.$router.push("/login");
    },
  },
  watch: {
    $route() {
      this.checkAuth();
    },
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-link {
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ffd700 !important;
}

.container {
  max-width: 1200px;
}
</style>