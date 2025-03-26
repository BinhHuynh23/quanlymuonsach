<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <h2 class="card-title">Đăng Nhập</h2>
          <div class="card-body">
            <Form @submit="handleLogin" :validation-schema="loginSchema">
              <div class="mb-3">
                <label for="username" class="form-label">Tên Đăng Nhập</label>
                <Field
                  name="username"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên đăng nhập"
                  v-model="form.username"
                />
                <ErrorMessage name="username" class="error-feedback" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Mật Khẩu</label>
                <Field
                  name="password"
                  type="password"
                  class="form-control"
                  placeholder="Nhập mật khẩu"
                  v-model="form.password"
                />
                <ErrorMessage name="password" class="error-feedback" />
              </div>
              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-box-arrow-in-right me-2"></i> Đăng Nhập
                </button>
                <router-link to="/register" class="btn btn-link">Chưa có tài khoản? Đăng ký</router-link>
              </div>
            </Form>
            <div v-if="message" class="alert mt-3" :class="success ? 'alert-success' : 'alert-danger'">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import AuthService from "@/services/auth.service";

export default {
  components: { Form, Field, ErrorMessage },
  data() {
    const loginSchema = yup.object().shape({
      username: yup.string().required("Tên đăng nhập là bắt buộc"),
      password: yup.string().required("Mật khẩu là bắt buộc"),
    });

    return {
      form: {
        username: "",
        password: "",
      },
      loginSchema,
      message: "",
      success: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await AuthService.login(this.form);
        const { token, user } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        this.message = "Đăng nhập thành công!";
        this.success = true;
        setTimeout(() => this.$router.push("/"), 2000);
      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi đăng nhập";
        this.success = false;
      }
    },
  },
};
</script>

<style scoped>
.card-title {
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  margin: 0;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.error-feedback {
  color: #e74c3c;
  font-size: 14px;
}
</style>