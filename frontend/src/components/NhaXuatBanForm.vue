<template>
  <div class="card">
    <div class="card-header">
      <h3 class="mb-0">{{ isEditing ? "Cập Nhật Nhà Xuất Bản" : "Thêm Nhà Xuất Bản" }}</h3>
    </div>
    <div class="card-body">
      <Form @submit="submitNhaXuatBan" :validation-schema="nhaXuatBanFormSchema">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="maNXB" class="form-label">Mã NXB</label>
              <Field
                name="MaNXB"
                type="text"
                class="form-control"
                v-model="nhaXuatBanLocal.MaNXB"
                :disabled="isEditing"
                placeholder="XXXX"
              />
              <ErrorMessage name="MaNXB" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="tenNXB" class="form-label">Tên NXB</label>
              <Field name="TenNXB" type="text" class="form-control" v-model="nhaXuatBanLocal.TenNXB" />
              <ErrorMessage name="TenNXB" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="diaChi" class="form-label">Địa Chỉ</label>
          <Field name="DiaChi" type="text" class="form-control" v-model="nhaXuatBanLocal.DiaChi" />
          <ErrorMessage name="DiaChi" class="error-feedback" />
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-success me-2">
            <i class="bi bi-save me-1"></i> Lưu
          </button>
          <button v-if="isEditing" type="button" class="btn btn-danger me-2" @click="deleteNhaXuatBan">
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
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:nhaXuatBan", "delete:nhaXuatBan", "saved"],
  props: { nhaXuatBan: { type: Object, required: false, default: null } },
  data() {
    const nhaXuatBanFormSchema = yup.object().shape({
      MaNXB: yup.string().required("Mã NXB là bắt buộc"),
      TenNXB: yup
        .string()
        .required("Tên NXB là bắt buộc")
        .min(2, "Tên NXB ít nhất 2 ký tự")
        .max(100, "Tên NXB tối đa 100 ký tự"),
      DiaChi: yup
        .string()
        .required("Địa Chỉ là bắt buộc")
        .min(5, "Địa Chỉ ít nhất 5 ký tự")
        .max(100, "Địa Chỉ tối đa 100 ký tự"),
    });

    return {
      nhaXuatBanLocal: {
        MaNXB: "",
        TenNXB: "",
        DiaChi: "",
      },
      nhaXuatBanFormSchema,
      isEditing: false,
    };
  },
  watch: {
    nhaXuatBan: {
      handler(newValue) {
        if (newValue) {
          this.nhaXuatBanLocal = { ...newValue };
          this.isEditing = true;
        } else {
          this.nhaXuatBanLocal = {
            MaNXB: "",
            TenNXB: "",
            DiaChi: "",
          };
          this.isEditing = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async submitNhaXuatBan() {
      try {
        if (this.isEditing) {
          await NhaXuatBanService.update(this.nhaXuatBanLocal.MaNXB, this.nhaXuatBanLocal);
        } else {
          await NhaXuatBanService.create(this.nhaXuatBanLocal);
        }
        this.$emit("saved");
      } catch (error) {
        console.error("Lỗi khi lưu nhà xuất bản:", error);
        alert(error.message);
      }
    },
    deleteNhaXuatBan() {
      this.$emit("delete:nhaXuatBan", this.nhaXuatBanLocal.MaNXB);
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