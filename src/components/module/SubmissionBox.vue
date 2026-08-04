<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import FileUploadBox from "../common/FileUploadBox.vue";

/* 提交验收：不显示提交次数，不做排名，不设「未通过」
   交互：可上传文件、可保存草稿、提交后只回一句「已收到」 */
defineProps({
  desc: { type: String, default: "" },
  accept: { type: String, default: "" },
});

const files = ref([]);
const submitted = ref(false);

function submit() {
  if (!files.value.length) {
    ElMessage({ message: "先上传验收物，或者先保存草稿", type: "warning" });
    return;
  }
  submitted.value = true;
  ElMessage({ message: "已提交，导师会在 3 个工作日内给出反馈", type: "success" });
}
</script>

<template>
  <div class="submission">
    <p class="sub-desc">{{ desc }}</p>
    <FileUploadBox :accept="accept" @change="(f) => (files = f)" />
    <div class="button-row">
      <button class="btn" :disabled="submitted" @click="submit">{{ submitted ? "已提交" : "提交验收" }}</button>
      <button class="btn ghost" @click="ElMessage({ message: '草稿已保存', type: 'info' })">保存草稿</button>
    </div>
    <p v-if="submitted" class="sub-done">已收到你的提交。这里不显示次数、不做排名——导师反馈会在 3 个工作日内回来。</p>
  </div>
</template>

<style scoped>
.sub-desc { margin: 0 0 10px; font-size: 12px; color: #5e747e; }
.button-row { display: flex; gap: 9px; margin-top: 12px; }
.sub-done { margin: 10px 0 0; font-size: 11px; color: #16848a; }
</style>
