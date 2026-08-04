<script setup>
import { ref } from "vue";
import { UploadSimple } from "@/icons";

/* 文件上传框：可多选，本地演示（接入后走 Edge Function 预签名上传） */
const props = defineProps({
  accept: { type: String, default: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB" },
  multiple: { type: Boolean, default: false },
  tall: { type: Boolean, default: false },
});

const emit = defineEmits(["change"]);
const inputRef = ref(null);
const files = ref([]);

function pick() {
  inputRef.value?.click();
}

function onChange(e) {
  const list = Array.from(e.target.files || []);
  files.value = props.multiple ? [...files.value, ...list] : list;
  emit("change", files.value);
  e.target.value = "";
}
</script>

<template>
  <div class="upload" :class="{ tall }" role="button" tabindex="0" @click="pick" @keyup.enter="pick">
    <UploadSimple :size="34" />
    <b>{{ files.length ? `已选择 ${files.length} 个文件` : "点击或拖拽文件到此处上传" }}</b>
    <span>{{ accept }}</span>
    <input ref="inputRef" type="file" :multiple="multiple" hidden @change="onChange" />
  </div>
</template>

<style scoped>
.upload {
  min-height: 120px;
  border: 1px dashed #72bdc7;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #247985;
  text-align: center;
  cursor: pointer;
}
.upload.tall { min-height: 145px; }
.upload span { font-size: 10px; color: #899ba3; }
</style>
