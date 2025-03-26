<template>
  <div class="card">
    <div class="card-header">
      <h3 class="mb-0">{{ isEditing ? "Cập Nhật Độc Giả" : "Thêm Độc Giả" }}</h3>
    </div>
    <div class="card-body">
      <Form @submit="submitDocGia" :validation-schema="docGiaFormSchema">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="maDocGia" class="form-label">Mã Độc Giả</label>
              <Field
                name="MaDocGia"
                type="text"
                class="form-control"
                v-model="docGiaLocal.MaDocGia"
                :disabled="isEditing"
                placeholder="XXXX"
              />
              <ErrorMessage name="MaDocGia" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="hoLot" class="form-label">Họ Lót</label>
              <Field name="HoLot" type="text" class="form-control" v-model="docGiaLocal.HoLot" />
              <ErrorMessage name="HoLot" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="ten" class="form-label">Tên</label>
              <Field name="Ten" type="text" class="form-control" v-model="docGiaLocal.Ten" />
              <ErrorMessage name="Ten" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="ngaySinh" class="form-label">Ngày Sinh</label>
              <Field name="NgaySinh" type="date" class="form-control" v-model="docGiaLocal.NgaySinh" />
              <ErrorMessage name="NgaySinh" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="phai" class="form-label">Phái</label>
              <Field as="select" name="Phai" v-model="docGiaLocal.Phai" class="form-control">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </Field>
              <ErrorMessage name="Phai" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="diaChi" class="form-label">Địa Chỉ</label>
              <Field name="DiaChi" type="text" class="form-control" v-model="docGiaLocal.DiaChi" />
              <ErrorMessage name="DiaChi" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="dienThoai" class="form-label">Điện Thoại</label>
          <Field name="DienThoai" type="text" class="form-control" v-model="docGiaLocal.DienThoai" />
          <ErrorMessage name="DienThoai" class="error-feedback" />
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-success me-2">
            <i class="bi bi-save me-1"></i> Lưu
          </button>
          <button v-if="isEditing" type="button" class="btn btn-danger me-2" @click="deleteDocGia">
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
import DocGiaService from "@/services/docgia.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:docGia", "delete:docGia", "saved"],
  props: { docGia: { type: Object, required: false, default: null } },
  data() {
    const docGiaFormSchema = yup.object().shape({
      MaDocGia: yup.string().required("Mã Độc Giả là bắt buộc"),
      HoLot: yup
        .string()
        .required("Họ Lót là bắt buộc")
        .min(2, "Họ Lót ít nhất 2 ký tự")
        .max(50, "Họ Lót tối đa 50 ký tự"),
      Ten: yup
        .string()
        .required("Tên là bắt buộc")
        .min(2, "Tên ít nhất 2 ký tự")
        .max(50, "Tên tối đa 50 ký tự"),
      NgaySinh: yup
        .date()
        .required("Ngày Sinh là bắt buộc")
        .max(new Date(), "Ngày Sinh không được lớn hơn ngày hiện tại"),
      Phai: yup.string().required("Phái là bắt buộc").oneOf(["Nam", "Nữ"], "Phái phải là Nam hoặc Nữ"),
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
      docGiaLocal: {
        MaDocGia: "",
        HoLot: "",
        Ten: "",
        NgaySinh: "",
        Phai: "Nam",
        DiaChi: "",
        DienThoai: "",
      },
      docGiaFormSchema,
      isEditing: false,
    };
  },
  watch: {
    docGia: {
      handler(newValue) {
        if (newValue) {
          this.docGiaLocal = { ...newValue };
          this.isEditing = true;
        } else {
          this.docGiaLocal = {
            MaDocGia: "",
            HoLot: "",
            Ten: "",
            NgaySinh: "",
            Phai: "Nam",
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
    async submitDocGia() {
      try {
        if (this.isEditing) {
          await DocGiaService.update(this.docGiaLocal.MaDocGia, this.docGiaLocal);
        } else {
          await DocGiaService.create(this.docGiaLocal);
        }
        this.$emit("saved");
      } catch (error) {
        console.error("Lỗi khi lưu độc giả:", error);
        alert(error.message);
      }
    },
    deleteDocGia() {
      this.$emit("delete:docGia", this.docGiaLocal.MaDocGia);
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