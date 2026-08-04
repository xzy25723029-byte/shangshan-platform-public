<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getLocalAiKey, aiKeyStorage, aiModeLabel } from "../../utils/aiMentor";
import SectionTitle from "../../components/common/SectionTitle.vue";

/* AI 导师设置：学生 API Key 只存本地浏览器，不上传服务器 */

const key = ref(getLocalAiKey());
const saved = ref(false);

function save() {
  const k = key.value.trim();
  if (k) {
    localStorage.setItem(aiKeyStorage, k);
    ElMessage({ message: "已保存到本机浏览器（不上传服务器）", type: "success" });
  } else {
    localStorage.removeItem(aiKeyStorage);
    ElMessage({ message: "已清除本地 Key", type: "info" });
  }
  saved.value = true;
}

function clearKey() {
  key.value = "";
  localStorage.removeItem(aiKeyStorage);
  ElMessage({ message: "已清除本地 Key", type: "info" });
}
</script>

<template>
  <div class="as-page">
    <div class="page-banner">
      <div>
        <h1>AI 导师设置</h1>
        <p>水问的模式与密钥配置</p>
      </div>
    </div>

    <div class="card as-block">
      <SectionTitle title="模式说明" />
      <dl class="as-modes">
        <div><dt>初心堂 · {{ aiModeLabel.socratic }}</dt><dd>只反问、不下结论、不替学生写、不判断对错，不影响评价或准入。</dd></div>
        <div><dt>第1层起 · {{ aiModeLabel.assistant }}</dt><dd>给步骤提示、帮检查、帮追问；不代做、不代写、不代生成。</dd></div>
      </dl>
    </div>

    <div class="card as-block">
      <SectionTitle title="API Key（可选）" note="只存本机浏览器 localStorage，绝不上传服务器" />
      <p class="as-tip">
        不配置 Key 也可以使用「水问」：本地反问引导足够你完成初心堂的思考。
        配置自己的模型 Key 后，对话将通过 Edge Function 代理（密钥在函数环境变量中），平台不接触你的 Key。
      </p>
      <label class="as-field">
        <span>模型 API Key</span>
        <input v-model="key" type="password" placeholder="sk-…（仅保存在本机）" />
      </label>
      <div class="as-actions">
        <button class="btn" @click="save">保存设置</button>
        <button v-if="key" class="btn ghost" @click="clearKey">清除 Key</button>
      </div>
      <p v-if="saved" class="as-saved">设置已保存。密钥只存在于这台设备的浏览器中。</p>
    </div>
  </div>
</template>

<style scoped>
.as-block { padding: 18px 22px; margin-bottom: 14px; }
.as-modes { margin: 12px 0 0; }
.as-modes div { padding: 10px 0; border-bottom: 1px solid #e7eef0; }
.as-modes dt { font-size: 13px; font-weight: 700; color: #0d5e68; }
.as-modes dd { margin: 4px 0 0; font-size: 12px; line-height: 1.7; color: #5e747e; }
.as-tip { font-size: 12px; line-height: 1.9; color: #5e747e; }
.as-field { display: grid; gap: 6px; margin-top: 12px; }
.as-field span { font-size: 12px; font-weight: 700; color: #44616b; }
.as-field input {
  height: 40px; border: 1px solid #dce8eb; border-radius: 8px; padding: 0 12px;
  max-width: 460px;
}
.as-actions { display: flex; gap: 8px; margin-top: 12px; }
.as-saved { margin: 10px 0 0; font-size: 11px; color: #16848a; }
</style>
