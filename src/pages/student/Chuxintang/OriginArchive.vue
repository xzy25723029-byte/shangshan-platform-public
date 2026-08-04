<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../../api";

import { LockSimple, Timer } from "@/icons";

/* 初心档案：封存大一初心，四年后归还
   不做排名，不做评分 */

const archive = ref(null);
const content = ref("");
const sealing = ref(false);

async function load() {
  archive.value = await mockApi.getArchive();
  if (archive.value) content.value = archive.value.content;
}
onMounted(load);

async function seal() {
  if (!content.value.trim()) {
    ElMessage({ message: "写点什么再封存吧——哪怕只有一句话", type: "warning" });
    return;
  }
  sealing.value = true;
  archive.value = await mockApi.sealArchive({ content: content.value.trim() });
  sealing.value = false;
  ElMessage({ message: "初心已封存。四年后，我们在这里等你回来。", type: "success" });
}
</script>

<template>
  <div class="oa-page">
    <div class="page-banner">
      <div>
        <h1>初心档案</h1>
        <p>封存大一初心，四年后归还——你的科研成长档案</p>
      </div>
    </div>

    <div v-if="!archive" class="card oa-seal">
      <div class="oa-icon"><LockSimple :size="40" weight="duotone" /></div>
      <h2>给四年后的自己写封信</h2>
      <p>
        写下你此刻为什么来、想成为什么样的人、最想守住什么。写完后封存——
        四年间不展示、不评分、不排名；毕业时原样归还给你。
      </p>
      <textarea v-model="content" placeholder="写下你的初心…" />
      <button class="btn" :disabled="sealing" @click="seal">封存初心</button>
    </div>

    <div v-else class="card oa-sealed">
      <div class="oa-icon"><Timer :size="40" weight="duotone" /></div>
      <h2>初心已封存</h2>
      <dl>
        <div><dt>封存时间</dt><dd>{{ archive.sealedAt }}</dd></div>
        <div><dt>归还时间</dt><dd>毕业时（不早于四年后）</dd></div>
      </dl>
      <p class="oa-preview">{{ archive.content }}</p>
      <p class="oa-note">档案已封存，仅你本人与系统可见，不参与任何比较。</p>
    </div>
  </div>
</template>

<style scoped>
.oa-seal, .oa-sealed { max-width: 720px; margin: 0 auto; padding: 34px 40px; text-align: center; }
.oa-icon { color: #1b93a0; }
.oa-seal h2, .oa-sealed h2 { font-family: var(--font-kai); letter-spacing: 2px; color: #0d5e68; margin: 10px 0 8px; }
.oa-seal p { font-size: 12px; line-height: 1.9; color: #5e747e; margin: 0 0 16px; }
.oa-seal textarea {
  width: 100%; height: 170px; resize: none;
  border: 1px solid #dce8eb; border-radius: 10px; padding: 14px;
  font-size: 13px; line-height: 1.9;
}
.oa-seal .btn { margin-top: 14px; }
.oa-sealed dl { display: flex; justify-content: center; gap: 48px; margin: 14px 0 18px; }
.oa-sealed dl div { text-align: center; }
.oa-sealed dt { font-size: 11px; color: #8a9ba2; }
.oa-sealed dd { margin: 4px 0 0; font-size: 14px; font-weight: 700; color: #0f7c87; }
.oa-preview {
  padding: 16px;
  border: 1px dashed #9bcbd1;
  border-radius: 10px;
  background: #f4fbfc;
  font-family: var(--font-kai);
  font-size: 15px;
  line-height: 2;
  color: #245260;
  white-space: pre-wrap;
  text-align: left;
}
.oa-note { margin: 12px 0 0; font-size: 11px; color: #8a9ba2; }
</style>
