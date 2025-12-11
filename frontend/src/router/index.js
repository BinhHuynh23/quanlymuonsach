import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Sach from "@/views/Sach.vue";
import DocGia from "@/views/DocGia.vue";
import NhaXuatBan from "@/views/NhaXuatBan.vue";
import TheoDoiMuonSach from "@/views/TheoDoiMuonSach.vue";
import NhanVien from "@/views/NhanVien.vue";
import MuonSach from "@/views/MuonSach.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }, // Yêu cầu đăng nhập để truy cập trang chủ
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/sach",
    name: "Sach",
    component: Sach,
    meta: { requiresAuth: true },
  },
  {
    path: "/docgia",
    name: "DocGia",
    component: DocGia,
    meta: { requiresAuth: true },
  },
  {
    path: "/nhaxuatban",
    name: "NhaXuatBan",
    component: NhaXuatBan,
    meta: { requiresAuth: true },
  },
  {
    path: "/theodoimuonsach",
    name: "TheoDoiMuonSach",
    component: TheoDoiMuonSach,
    meta: { requiresAuth: true },
  },
  {
    path: "/nhanvien",
    name: "NhanVien",
    component: NhanVien,
    meta: { requiresAuth: true },
  },

  {
  path: "/muonsach",
  name: "MuonSach",
  component: MuonSach,
  meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard để kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  } else if (to.path === "/login" && isAuthenticated) {
    next("/"); // Chuyển hướng đến trang chủ nếu đã đăng nhập
  } else if (to.path === "/register" && isAuthenticated) {
    next("/"); // Chuyển hướng đến trang chủ nếu đã đăng nhập
  } else {
    next();
  }
});

export default router;