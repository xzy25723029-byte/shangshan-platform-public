<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  loadModels, saveModels, getActiveModel, setActiveModel,
  MODEL_PROVIDERS, recommendFor, testModelConnection,
} from "../../utils/aiMentor";
import SectionTitle from "../../components/common/SectionTitle.vue";
import { Plus, Trash, PencilSimple, CaretRight } from "@/icons";

/* AI 导师设置：多模型自定义配置中心
   学生 API Key 只存本机浏览器 localStorage，绝不上传服务器 */

const models = ref([]);
const dialog = ref(false);
const editing = ref(null); // null=新增, {id}=编辑
const form = ref({ name: "", provider: "硅基流动（推荐）", baseUrl: "https://api.siliconflow.cn/v1", model: "", apiKey: "", note: "", scene: "" });
const testingId = ref("");
const recommend = ref(null);
const pickedScene = ref("通用");

onMounted(() => {
  models.value = loadModels();
  recommend.value = recommendFor("通用");
});

function pickScene(scene) {
  pickedScene.value = scene;
  recommend.value = recommendFor(scene);
}

function openAdd() {
  editing.value = null;
  form.value = { name: "", provider: "硅基流动（推荐）", baseUrl: "https://api.siliconflow.cn/v1", model: "", apiKey: "", note: "", scene: "" };
  dialog.value = true;
}

function openEdit(m) {
  editing.value = { id: m.id };
  form.value = { name: m.name, provider: m.provider, baseUrl: m.baseUrl, model: m.model, apiKey: m.apiKey, note: m.note || "", scene: m.scene || "" };
  dialog.value = true;
}

function onProviderChange() {
  const p = MODEL_PROVIDERS.find((x) => x.name === form.value.provider);
  if (p) form.value.baseUrl = p.baseUrl;
}

function saveModel() {
  if (!form.value.name.trim() || !form.value.model.trim() || !form.value.apiKey.trim()) {
    ElMessage({ message: "名称、模型 ID 与 API Key 为必填", type: "warning" });
    return;
  }
  if (!/^https?:\/\//.test(form.value.baseUrl)) {
    ElMessage({ message: "Base URL 需以 http(s):// 开头", type: "warning" });
    return;
  }
  const id = editing.value ? editing.value.id : "custom-" + Date.now();
  const cfg = {
    id,
    name: form.value.name.trim(),
    provider: form.value.provider,
    baseUrl: form.value.baseUrl.trim(),
    model: form.value.model.trim(),
    apiKey: form.value.apiKey.trim(),
    note: form.value.note.trim(),
    scene: form.value.scene.trim(),
    builtin: Boolean(editing.value && models.value.find((m) => m.id === id)?.builtin),
    enabled: true,
  };
  const idx = models.value.findIndex((m) => m.id === id);
  if (idx >= 0) models.value[idx] = cfg;
  else models.value.push(cfg);
  saveModels(models.value);
  dialog.value = false;
  ElMessage({ message: editing.value ? "模型配置已更新" : "模型已添加，可在对话中选择使用", type: "success" });
}

function removeModel(id) {
  models.value = models.value.filter((m) => m.id !== id);
  saveModels(models.value);
  ElMessage({ message: "模型已移除", type: "info" });
}

function toggleEnabled(m) {
  m.enabled = !m.enabled;
  saveModels(models.value);
}

function activate(m) {
  setActiveModel(m.id);
  activeId.value = m.id;
  ElMessage({ message: `当前对话将使用 ${m.name}`, type: "success" });
}

async function testModel(m) {
  if (!m.apiKey) {
    ElMessage({ message: "请先为这个模型配置 API Key", type: "warning" });
    return;
  }
  testingId.value = m.id;
  try {
    await testModelConnection(m);
    ElMessage({ message: `${m.name} 连接成功 ✓`, type: "success" });
  } catch (e) {
    ElMessage({ message: `${m.name} 连接失败：${e.message.slice(0, 60)}`, type: "warning" });
  } finally {
    testingId.value = "";
  }
}

const activeId = ref(getActiveModel()?.id || "");
</script>

<template>
  <div class="as-page">
    <div class="page-banner">
      <div>
        <h1>AI 导师设置</h1>
        <p>多模型自定义配置——自主添加大模型，对话时自由选择</p>
      </div>
      <span class="pill">API Key 只存本机浏览器</span>
    </div>

    <!-- 硅基流动优选说明 -->
    <div class="card as-recommend">
      <SectionTitle title="优选平台 · 硅基流动 SiliconFlow" />
      <div class="rec-grid">
        <div class="rec-item"><b>一个 Key 用全部模型</b><p>DeepSeek / Qwen / GLM 等主流模型聚合，无需分别注册</p></div>
        <div class="rec-item"><b>有免费模型</b><p>如 Qwen2.5-7B 可免费调用，适合起步体验</p></div>
        <div class="rec-item"><b>OpenAI 兼容</b><p>Base URL：api.siliconflow.cn/v1，模型 ID 直接作为 model 参数</p></div>
        <a class="rec-site" href="https://cloud.siliconflow.cn" target="_blank" rel="noopener">前往注册获取 Key <CaretRight :size="13" /></a>
      </div>
    </div>

    <!-- 场景推荐 -->
    <div class="card as-pick">
      <SectionTitle title="场景推荐" note="不知道选哪个？按你的用途选" />
      <div class="pick-grid">
        <button class="pick-card" :class="{ picked: pickedScene === '通用' }" @click="pickScene('通用')">
          <b>日常问答 / 写作</b><span>→ DeepSeek-V3（通用主力）</span>
        </button>
        <button class="pick-card" :class="{ picked: pickedScene === '推理' }" @click="pickScene('推理')">
          <b>机理分析 / 科研思辨</b><span>→ DeepSeek-R1（深度推理）</span>
        </button>
        <button class="pick-card" :class="{ picked: pickedScene === '免费' }" @click="pickScene('免费')">
          <b>起步体验 / 轻量</b><span>→ Qwen2.5-7B（免费）</span>
        </button>
      </div>
      <p v-if="recommend" class="pick-answer">
        推荐：<b>{{ recommend.name }}</b> —— {{ recommend.reason }}
        <button class="btn ghost" @click="activate({ id: recommend.id })">设为当前模型</button>
      </p>
    </div>

    <!-- 模型列表 -->
    <div class="card as-models">
      <div class="as-models-head">
        <SectionTitle :title="`我的模型（${models.length}）`" note="未配置 Key 的模型不可用于对话" />
        <button class="btn" @click="openAdd"><Plus :size="15" />添加自定义模型</button>
      </div>
      <div class="model-grid">
        <article v-for="m in models" :key="m.id" class="model-card" :class="{ disabled: !m.enabled }">
          <header>
            <div>
              <h3>{{ m.name }} <em v-if="m.builtin" class="pill">内置推荐</em><em v-else class="pill custom">自定义</em></h3>
              <span>{{ m.provider }} · {{ m.model }}</span>
            </div>
            <label class="toggle" :title="m.enabled ? '点击停用' : '点击启用'">
              <input type="checkbox" :checked="m.enabled" @change="toggleEnabled(m)" />
              <i></i>
            </label>
          </header>
          <p class="model-note">{{ m.note || "—" }}<small v-if="m.scene">　适用：{{ m.scene }}</small></p>
          <p class="model-key" :class="{ set: m.apiKey }">{{ m.apiKey ? "✓ 已配置 Key" : "未配置 Key" }}</p>
          <footer>
            <button class="btn ghost small" :disabled="!m.apiKey" @click="testModel(m)">{{ testingId === m.id ? "测试中…" : "测试连接" }}</button>
            <button class="btn ghost small" :disabled="!m.apiKey" @click="activate(m)">设为当前</button>
            <button class="btn ghost small" @click="openEdit(m)"><PencilSimple :size="13" />编辑</button>
            <button v-if="!m.builtin" class="btn ghost small danger" @click="removeModel(m.id)"><Trash :size="13" /></button>
          </footer>
        </article>
      </div>
      <p class="models-tip">
        当前对话模型：<b>{{ models.find((m) => m.id === activeId)?.name || "本地引导（未配置 Key）" }}</b>　
        <router-link class="tip-link" to="/student/ai-mentor">在右下角「AI 导师」对话框中也可随时切换</router-link>
      </p>
    </div>

    <!-- 配置弹窗 -->
    <el-dialog v-model="dialog" :title="editing ? '编辑模型配置' : '添加自定义模型'" width="520px">
      <div class="cfg-form">
        <div class="cfg-grid">
          <label>名称 *<input v-model="form.name" placeholder="如：我的 DeepSeek" /></label>
          <label>平台
            <select v-model="form.provider" @change="onProviderChange">
              <option v-for="p in MODEL_PROVIDERS" :key="p.name" :value="p.name">{{ p.name }}</option>
            </select>
          </label>
        </div>
        <label>Base URL *<input v-model="form.baseUrl" placeholder="https://api.siliconflow.cn/v1" /></label>
        <label>模型 ID *<input v-model="form.model" placeholder="如：deepseek-ai/DeepSeek-V3（平台模型广场复制完整 ID）" /></label>
        <label>API Key *<input v-model="form.apiKey" type="password" placeholder="sk-…（仅保存在本机浏览器）" /></label>
        <div class="cfg-grid">
          <label>备注<input v-model="form.note" placeholder="如：通用主力" /></label>
          <label>适用场景<input v-model="form.scene" placeholder="如：日常问答 / 写作" /></label>
        </div>
        <p class="cfg-tip">提示：硅基流动的模型 ID 需在模型广场复制完整名称（如 deepseek-ai/DeepSeek-V3）。</p>
      </div>
      <template #footer>
        <button class="btn ghost" @click="dialog = false">取消</button>
        <button class="btn" @click="saveModel">保存配置</button>
      </template>
    </el-dialog>

    <!-- 安全说明 -->
    <div class="card as-safe">
      <SectionTitle title="安全与使用说明" />
      <ul>
        <li>API Key 只保存在<b>本机浏览器</b>（localStorage），绝不上传服务器</li>
        <li>不配置任何 Key 也能使用「水问」：本地反问引导完全可用</li>
        <li>平台级密钥（如需免配置使用）由导师通过 Edge Function 提供，学生无需填写</li>
        <li>「测试连接」会向该平台发送一条最小请求验证配置，不产生计费文本</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.as-recommend, .as-pick, .as-models, .as-safe { padding: 18px 22px; margin-bottom: 14px; }
.rec-grid { display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 12px; margin-top: 12px; align-items: center; }
.rec-item { padding: 12px 14px; background: #eef7f8; border: 1px solid #d3e9ec; border-radius: 10px; }
.rec-item b { display: block; font-size: 13px; color: #0d5e68; }
.rec-item p { margin: 5px 0 0; font-size: 11px; line-height: 1.7; color: #4a5f68; }
.rec-site { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #0f7c87; font-weight: 700; text-decoration: none; white-space: nowrap; }
.pick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
.pick-card { text-align: left; padding: 12px 14px; border: 1px solid #e0eaec; border-radius: 10px; background: #fafdfd; transition: 0.2s; }
.pick-card:hover { border-color: #91d0d6; }
.pick-card.picked { border-color: #1a8993; background: #eef7f8; box-shadow: 0 2px 8px rgba(26, 137, 147, 0.14); }
.pick-card b { display: block; font-size: 12px; color: #0d5e68; }
.pick-card span { display: block; margin-top: 5px; font-size: 11px; color: #14727d; }
.pick-answer { margin: 12px 0 0; padding: 10px 14px; background: #f2fafb; border-radius: 8px; font-size: 12px; color: #245260; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pick-answer .btn { min-height: 30px; font-size: 11px; margin-left: auto; }
.as-models-head { display: flex; justify-content: space-between; align-items: center; }
.model-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }
.model-card { padding: 14px; border: 1px solid #e0eaec; border-radius: 10px; background: #fafdfd; display: flex; flex-direction: column; gap: 8px; }
.model-card.disabled { opacity: 0.55; }
.model-card header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.model-card h3 { margin: 0; font-size: 14px; color: var(--ink); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.model-card h3 em { font-style: normal; font-size: 9px; }
.model-card h3 .pill.custom { background: #f0f2f4; color: #5f7781; }
.model-card header span { display: block; margin-top: 3px; font-size: 10px; color: #7a8d95; }
.toggle { position: relative; width: 34px; height: 18px; flex: 0 0 auto; }
.toggle input { opacity: 0; width: 100%; height: 100%; position: absolute; margin: 0; cursor: pointer; z-index: 1; }
.toggle i { position: absolute; inset: 0; border-radius: 999px; background: #cfdadd; transition: 0.25s; }
.toggle i::after { content: ""; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: white; top: 2px; left: 2px; transition: 0.25s; }
.toggle input:checked + i { background: #1a8993; }
.toggle input:checked + i::after { left: 18px; }
.model-note { margin: 0; font-size: 11px; line-height: 1.6; color: #4a5f68; }
.model-note small { color: #8a9ba2; }
.model-key { margin: 0; font-size: 10px; }
.model-key.set { color: #16848a; }
.model-key:not(.set) { color: #a8743f; }
.model-card footer { display: flex; gap: 6px; flex-wrap: wrap; margin-top: auto; }
.model-card .btn.small { min-height: 28px; padding: 0 10px; font-size: 10px; }
.model-card .btn.danger { color: #a8743f; border-color: #e0c9a8; }
.models-tip { margin: 14px 0 0; font-size: 11px; color: #5e747e; }
.tip-link { color: #0f7c87; text-decoration: none; }
.cfg-form { display: grid; gap: 12px; }
.cfg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cfg-form label { display: grid; gap: 5px; font-size: 11px; font-weight: 700; color: #3d5560; }
.cfg-form input, .cfg-form select { height: 36px; border: 1px solid #dce7ea; border-radius: 8px; padding: 0 10px; background: white; font-weight: 400; }
.cfg-tip { margin: 0; font-size: 10px; color: #8a9ba2; }
.as-safe ul { margin: 10px 0 0; padding-left: 18px; font-size: 11px; line-height: 2.3; color: #4a5f68; }
</style>
