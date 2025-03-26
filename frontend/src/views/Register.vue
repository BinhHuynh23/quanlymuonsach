<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <h2 class="card-title">Đăng Ký</h2>
          <div class="card-body">
            <Form @submit="handleRegister" :validation-schema="registerSchema">
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
                  <i class="bi bi-person-plus me-1"></i> Đăng Ký
                </button>
                <router-link to="/login" class="btn btn-link">Đã có tài khoản? Đăng nhập</router-link>
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
    const registerSchema = yup.object().shape({
      username: yup.string().required("Tên đăng nhập là bắt buộc").min(3, "Tối thiểu 3 ký tự"),
      password: yup.string().required("Mật khẩu là bắt buộc").min(6, "Tối thiểu 6 ký tự"),
    });

    return {
      form: {
        username: "",
        password: "",
        role: "user",
      },
      registerSchema,
      message: "",
      success: false,
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await AuthService.register(this.form);
        this.message = response.message;
        this.success = true;
        setTimeout(() => this.$router.push("/login"), 2000);
      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi khi đăng ký";
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