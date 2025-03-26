<template>
    <div class="container mt-5">
        <DocGiaList ref="docGiaList" @show-form="showForm" @delete="refreshDocGia" />
        <div v-if="isFormVisible">
            <DocGiaForm :docGia="selectedDocGia" @saved="refreshDocGia" @close="isFormVisible = false"
                @delete="handleDelete" />
        </div>
    </div>
</template>

<script>
import DocGiaList from "@/components/DocGiaList.vue";
import DocGiaForm from "@/components/DocGiaForm.vue";

export default {
    components: { DocGiaList, DocGiaForm },
    data() {
        return {
            isFormVisible: false,
            selectedDocGia: null,
        };
    },
    methods: {
        showForm(docGia) {
            this.selectedDocGia = docGia;
            this.isFormVisible = true;
        },
        async refreshDocGia() {
            this.isFormVisible = false;
            await this.$refs.docGiaList.fetchDocGia();
        },
        async handleDelete(maDocGia) {
            if (confirm("Bạn có chắc muốn xóa độc giả này?")) {
                await this.$refs.docGiaList.deleteDocGia(maDocGia);
                this.isFormVisible = false;
            }
        },
    },
};
</script>