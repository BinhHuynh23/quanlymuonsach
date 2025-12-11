<template>
  <div class="card">
    <h2 class="card-title">{{ isEditing ? "Cập Nhật Sách" : "Thêm Sách" }}</h2>
    <div class="card-body">
      <Form @submit="submitSach" :validation-schema="sachFormSchema">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="maSach" class="form-label">Mã Sách</label>
              <Field
                name="MaSach"
                type="text"
                class="form-control"
                v-model="sachLocal.MaSach"
                :disabled="isEditing"
                placeholder="XXXX"
              />
              <ErrorMessage name="MaSach" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="tenSach" class="form-label">Tên Sách</label>
              <Field name="TenSach" type="text" class="form-control" v-model="sachLocal.TenSach" />
              <ErrorMessage name="TenSach" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="tacGia" class="form-label">Tác Giả</label>
              <Field name="TacGia" type="text" class="form-control" v-model="sachLocal.TacGia" />
              <ErrorMessage name="TacGia" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="donGia" class="form-label">Đơn Giá (VNĐ)</label>
              <Field name="DonGia" type="number" class="form-control" v-model.number="sachLocal.DonGia" />
              <ErrorMessage name="DonGia" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="soQuyen" class="form-label">Số Quyển</label>
              <Field name="SoQuyen" type="number" class="form-control" v-model.number="sachLocal.SoQuyen" />
              <ErrorMessage name="SoQuyen" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="namXuatBan" class="form-label">Năm Xuất Bản</label>
              <Field name="NamXuatBan" type="number" class="form-control" v-model.number="sachLocal.NamXuatBan" />
              <ErrorMessage name="NamXuatBan" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="maNXB" class="form-label">Nhà Xuất Bản</label>
          <Field as="select" name="MaNXB" v-model="sachLocal.MaNXB" class="form-control">
            <option value="" disabled>Chọn Nhà Xuất Bản</option>
            <option v-for="nxb in nxbList" :key="nxb.MaNXB" :value="nxb.MaNXB">
              {{ nxb.TenNXB }}
            </option>
          </Field>
          <ErrorMessage name="MaNXB" class="error-feedback" />
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-success me-2">
            <i class="bi bi-save me-1"></i> Lưu
          </button>
          <button v-if="isEditing" type="button" class="btn btn-danger me-2" @click="deleteSach">
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
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:sach", "delete:sach", "saved"],
  props: { sach: { type: Object, required: false, default: null } },
  data() {
    const sachFormSchema = yup.object().shape({
      MaSach: yup.string().required("Mã Sách là bắt buộc"),
      TenSach: yup
        .string()
        .required("Tên Sách là bắt buộc")
        .min(2, "Tên Sách ít nhất 2 ký tự")
        .max(100, "Tên Sách tối đa 100 ký tự"),
      TacGia: yup.string().required("Tác Giả là bắt buộc").max(50, "Tên Tác Giả tối đa 50 ký tự"),
      DonGia: yup
        .number()
        .required("Đơn Giá là bắt buộc")
        .min(0, "Đơn Giá phải lớn hơn hoặc bằng 0"),
      SoQuyen: yup
        .number()
        .required("Số Quyển là bắt buộc")
        .min(0, "Số Quyển phải lớn hơn hoặc bằng 0"),
      NamXuatBan: yup
        .number()
        .required("Năm Xuất Bản là bắt buộc")
        .min(1900, "Năm Xuất Bản phải từ 1900 trở lên")
        .max(new Date().getFullYear(), `Năm Xuất Bản không được lớn hơn ${new Date().getFullYear()}`),
      MaNXB: yup.string().required("Vui lòng chọn Nhà Xuất Bản"),
    });

    return {
      sachLocal: {
        MaSach: "",
        TenSach: "",
        TacGia: "",
        DonGia: 0,
        SoQuyen: 0,
        NamXuatBan: 0,
        MaNXB: "",
      },
      sachFormSchema,
      nxbList: [],
      isEditing: false,
    };
  },
  watch: {
    sach: {
      handler(newValue) {
        if (newValue) {
          this.sachLocal = { ...newValue };
          this.isEditing = true;
        } else {
          this.sachLocal = {
            MaSach: "",
            TenSach: "",
            TacGia: "",
            DonGia: 0,
            SoQuyen: 0,
            NamXuatBan: 0,
            MaNXB: "",
          };
          this.isEditing = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async fetchNXB() {
      try {
        this.nxbList = await NhaXuatBanService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách NXB:", error);
      }
    },
    async submitSach() {
      try {
        if (this.isEditing) {
          await SachService.update(this.sachLocal.MaSach, this.sachLocal);
        } else {
          await SachService.create(this.sachLocal);
        }
        this.$emit("saved");
      } catch (error) {
        console.error("Lỗi khi lưu sách:", error);
        alert(error.message);
      }
    },
    deleteSach() {
      this.$emit("delete:sach", this.sachLocal.MaSach);
    },
  },
  mounted() {
    this.fetchNXB();
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