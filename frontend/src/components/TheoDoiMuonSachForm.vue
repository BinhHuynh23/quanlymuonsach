<template>
  <div class="card">
    <h2 class="card-title">{{ isEditing ? "Cập Nhật Theo Dõi Mượn Sách" : "Thêm Theo Dõi Mượn Sách" }}</h2>
    <div class="card-body">
      <Form @submit="submitTheoDoi" :validation-schema="theoDoiFormSchema">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="maDocGia" class="form-label">Độc Giả</label>
              <Field as="select" name="MaDocGia" v-model="theoDoiLocal.MaDocGia" class="form-control">
                <option value="" disabled>Chọn Độc Giả</option>
                <option v-for="docGia in docGias" :key="docGia.MaDocGia" :value="docGia.MaDocGia">
                  {{ docGia.HoLot }} {{ docGia.Ten }} ({{ docGia.MaDocGia }})
                </option>
              </Field>
              <ErrorMessage name="MaDocGia" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="maSach" class="form-label">Sách</label>
              <Field as="select" name="MaSach" v-model="theoDoiLocal.MaSach" class="form-control">
                <option value="" disabled>Chọn Sách</option>
                <option v-for="sach in sachs" :key="sach.MaSach" :value="sach.MaSach">
                  {{ sach.TenSach }} ({{ sach.MaSach }})
                </option>
              </Field>
              <ErrorMessage name="MaSach" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="ngayMuon" class="form-label">Ngày Mượn</label>
              <Field name="NgayMuon" type="date" class="form-control" v-model="theoDoiLocal.NgayMuon" />
              <ErrorMessage name="NgayMuon" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="ngayTra" class="form-label">Ngày Trả</label>
              <Field name="NgayTra" type="date" class="form-control" v-model="theoDoiLocal.NgayTra" />
              <ErrorMessage name="NgayTra" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-success me-2">
            <i class="bi bi-save me-1"></i> Lưu
          </button>
          <button v-if="isEditing" type="button" class="btn btn-danger me-2" @click="deleteTheoDoi">
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
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:theoDoi", "saved"],
  data() {
    const theoDoiFormSchema = yup.object().shape({
      MaDocGia: yup.string().required("Vui lòng chọn Độc Giả"),
      MaSach: yup.string().required("Vui lòng chọn Sách"),
      NgayMuon: yup
        .date()
        .required("Ngày Mượn là bắt buộc")
        .max(new Date(), "Ngày Mượn không được lớn hơn ngày hiện tại"),
      NgayTra: yup
        .date()
        .nullable()
        .min(yup.ref("NgayMuon"), "Ngày Trả phải lớn hơn hoặc bằng Ngày Mượn"),
    });

    return {
      theoDoiLocal: {
        MaDocGia: "",
        MaSach: "",
        NgayMuon: "",
        NgayTra: null,
      },
      theoDoiFormSchema,
      docGias: [],
      sachs: [],
      isEditing: false,
    };
  },
  methods: {
    async fetchDocGia() {
      try {
        this.docGias = await DocGiaService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách độc giả:", error);
      }
    },
    async fetchSach() {
      try {
        this.sachs = await SachService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },
    async submitTheoDoi() {
      try {
        if (this.isEditing) {
          await TheoDoiMuonSachService.update(this.theoDoiLocal.MaDocGia, this.theoDoiLocal);
        } else {
          await TheoDoiMuonSachService.create(this.theoDoiLocal);
        }
        this.$emit("saved");
      } catch (error) {
        console.error("Lỗi khi lưu bản ghi mượn sách:", error);
        alert(error.message);
      }
    },
    deleteTheoDoi() {
      this.$emit("delete:theoDoi", this.theoDoiLocal.MaDocGia);
    },
  },
  mounted() {
    this.fetchDocGia();
    this.fetchSach();
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