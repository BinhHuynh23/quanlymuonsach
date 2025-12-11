<template>
  <div class="card">
    <div class="card-header">
      <h3 class="mb-0">{{ isEditing ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên" }}</h3>
    </div>
    <div class="card-body">
      <Form @submit="submitNhanVien" :validation-schema="nhanVienFormSchema">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="MSNV" class="form-label">Mã Nhân Viên</label>
              <Field
                name="MSNV"
                type="text"
                class="form-control"
                v-model="nhanVienLocal.MSNV"
                :disabled="isEditing"
                placeholder="XXXX"
              />
              <ErrorMessage name="MSNV" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="hoTenNV" class="form-label">Họ Tên</label>
              <Field name="HoTenNV" type="text" class="form-control" v-model="nhanVienLocal.HoTenNV" />
              <ErrorMessage name="HoTenNV" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="password" class="form-label">Mật Khẩu</label>
              <Field name="Password" type="password" class="form-control" v-model="nhanVienLocal.Password" />
              <ErrorMessage name="Password" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="chucVu" class="form-label">Chức Vụ</label>
              <Field name="ChucVu" type="text" v-model="nhanVienLocal.ChucVu" class="form-control">
              </Field>
              <ErrorMessage name="ChucVu" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="diaChi" class="form-label">Địa Chỉ</label>
              <Field name="DiaChi" type="text" class="form-control" v-model="nhanVienLocal.DiaChi" />
              <ErrorMessage name="DiaChi" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="dienThoai" class="form-label">Điện Thoại</label>
              <Field name="DienThoai" type="text" class="form-control" v-model="nhanVienLocal.DienThoai" />
              <ErrorMessage name="DienThoai" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-success me-2">
            <i class="bi bi-save me-1"></i> Lưu
          </button>
          <button v-if="isEditing" type="button" class="btn btn-danger me-2" @click="deleteNhanVien">
            <i class="bi bi-trash me-1"></i> Xóa
          </button>
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            <i class="bi bi-x-circle me-1"></i> Thoát
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import NhanVienService from "@/services/nhanvien.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:nhanVien", "delete:nhanVien", "saved"],
  props: { nhanVien: { type: Object, required: false, default: null } },
  data() {
    const nhanVienFormSchema = yup.object().shape({
      MSNV: yup.string().required("Mã Nhân Viên là bắt buộc"),
      HoTenNV: yup
        .string()
        .required("Họ Tên là bắt buộc")
        .min(2, "Họ Tên ít nhất 2 ký tự")
        .max(100, "Họ Tên tối đa 100 ký tự"),
      Password: yup
        .string()
        .required("Mật Khẩu là bắt buộc")
        .min(4, "Mật Khẩu ít nhất 4 ký tự"),
      ChucVu: yup
        .string()
        .required("Chức Vụ là bắt buộc"),
      DiaChi: yup
        .string()
        .required("Địa Chỉ là bắt buộc")
        .min(5, "Địa Chỉ ít nhất 5 ký tự")
        .max(100, "Địa Chỉ tối đa 100 ký tự"),
      DienThoai: yup
        .string()
        .required("Điện Thoại là bắt buộc")
        .matches(/^[0-9]{10}$/, "Điện Thoại phải là số và có đúng 10 chữ số"),
    });

    return {
      nhanVienLocal: {
        MSNV: "",
        HoTenNV: "",
        Password: "",
        ChucVu: "",
        DiaChi: "",
        DienThoai: "",
      },
      nhanVienFormSchema,
      isEditing: false,
    };
  },
  watch: {
    nhanVien: {
      handler(newValue) {
        if (newValue) {
          this.nhanVienLocal = { ...newValue };
          this.isEditing = true;
        } else {
          this.nhanVienLocal = {
            MSNV: "",
            HoTenNV: "",
            Password: "",
            ChucVu: "",
            DiaChi: "",
            DienThoai: "",
          };
          this.isEditing = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async submitNhanVien() {
      try {
        if (this.isEditing) {
          await NhanVienService.update(this.nhanVienLocal.MSNV, this.nhanVienLocal);
        } else {
          await NhanVienService.create(this.nhanVienLocal);
        }
        this.$emit("saved");
      } catch (error) {
        console.error("Lỗi khi lưu nhân viên:", error);
        alert(error.message);
      }
    },
    deleteNhanVien() {
      this.$emit("delete:nhanVien", this.nhanVienLocal.MSNV);
    },
  },
};
</script>

<style scoped>
.card-header {
  background-color: #3498db;
  color: #fff;
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