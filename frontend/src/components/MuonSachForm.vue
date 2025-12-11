<template>
  <div class="card">
    <h2 class="card-title">Gửi Yêu Cầu Mượn Sách</h2>
    <div class="card-body">
      <Form @submit="submitMuonSach" :validation-schema="muonSachSchema">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="maDocGia" class="form-label">Mã Độc Giả</label>
              <Field name="MaDocGia" type="text" class="form-control" v-model="muonSach.MaDocGia" />
              <ErrorMessage name="MaDocGia" class="error-feedback" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="maSach" class="form-label">Sách</label>
              <Field as="select" name="MaSach" v-model="muonSach.MaSach" class="form-control">
                <option value="" disabled>Chọn Sách</option>
                <option v-for="sach in sachs" :key="sach.MaSach" :value="sach.MaSach">
                  {{ sach.TenSach }} ({{ sach.MaSach }})
                </option>
              </Field>
              <ErrorMessage name="MaSach" class="error-feedback" />
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <button class="btn btn-success me-2">
            <i class="bi bi-save me-1"></i> Gửi Yêu Cầu
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
import SachService from "@/services/sach.service";

export default {
  components: { Form, Field, ErrorMessage },
  emits: ["submit:muonSach", "saved"],
  data() {
    const muonSachSchema = yup.object().shape({
      MaDocGia: yup.string().required("Vui lòng nhập Mã Độc Giả"),
      MaSach: yup.string().required("Vui lòng chọn Sách"),
    });

    return {
      muonSach: {
        MaDocGia: "",
        MaSach: "",
        NgayMuon: new Date().toISOString().split("T")[0], // Ngày mượn mặc định là hôm nay
        NgayTra: null, // Để trống
      },
      muonSachSchema,
      sachs: [],
    };
  },
  methods: {
    async fetchSach() {
      try {
        this.sachs = await SachService.getAll();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },
    async submitMuonSach() {
      try {
        await TheoDoiMuonSachService.create(this.muonSach);
        this.$emit("saved");
        alert("Yêu cầu mượn sách đã được gửi thành công!");
        this.muonSach.MaDocGia = "";
        this.muonSach.MaSach = "";
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu mượn sách:", error);
        alert("Có lỗi xảy ra: " + error.message);
      }
    },
  },
  mounted() {
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