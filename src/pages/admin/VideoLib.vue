<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { api } from "../../api";

import { MagnifyingGlass, Plus, LinkSimple, PlayCircle } from "@/icons";

/* 内容管理 · 视频资源：5-8 条以内/模块，分必看/需要时再看，失效自动隐藏 */

const MODULE_NAMES = {
  chuxintang: "初心堂",
  "lab-safety": "实验室安全",
  "literature-search": "文献检索",
  zotero: "Zotero 文献管理",
  "paper-figure": "论文绘图",
  "blender-3d": "Blender 建模",
  "paper-writing": "论文写作",
  "git-basics": "Git 基础",
  A1: "A1 XRD 物相",
  A2: "A2 XPS 表面",
  B3: "B3 EIS 阻抗",
  C1: "C1 三维荧光",
  E1: "E1 COMSOL 仿真",
  F2: "F2 生命周期评价",
};
const moduleName = (k) => MODULE_NAMES[k] || k;

const videos = ref([]);
const drawer = ref(false);
const form = ref({ title: "", module: "", level: "必看", time: "", url: "" });

onMounted(async () => {
  videos.value = await api.getVideos();
});

async function createVideo() {
  if (!form.value.title || !form.value.module || !form.value.url) {
    ElMessage({ message: "标题、模块与链接为必填", type: "warning" });
    return;
  }
  await api.saveVideo({ ...form.value, status: "有效" });
  videos.value = await api.getVideos();
  drawer.value = false;
  form.value = { title: "", module: "", level: "必看", time: "", url: "" };
  ElMessage({ message: "视频已保存（仅存链接，不下载转存）", type: "success" });
}

/* 批量检测链接（演示）：失效待检 → 有效，返回统计 */
async function bulkCheckLinks() {
  const before = videos.value.filter((v) => v.status === "失效待检").length;
  for (const v of videos.value) {
    if (v.status === "失效待检") v.status = "有效";
  }
  ElMessage({
    message: `链接检测完成：${videos.value.length} 条全部有效${before ? `（${before} 条已恢复）` : ""}（演示）`,
    type: "success",
  });
}
</script>

<template>
  <div class="vl-page">
    <div class="admin-head">
      <h1>视频资源</h1>
      <p>每条 5-8 分钟级资源，分「必看 / 需要时再看」，只存链接、定期检测有效性</p>
    </div>

    <div class="card vl-table">
      <div class="vl-toolbar">
        <div class="tabs">
          <router-link to="/admin/people">人物库</router-link>
          <button class="active">视频资源</button>
          <router-link to="/admin/modules">模块配置</router-link>
        </div>
        <button class="btn" @click="drawer = true"><Plus :size="15" />新增视频</button>
        <button class="btn ghost" @click="bulkCheckLinks"><LinkSimple :size="15" />批量检测链接</button>
      </div>
      <div class="table-filters">
        <label><MagnifyingGlass :size="15" /><input placeholder="搜索视频标题、所属模块" /></label>
        <select><option>全部模块</option></select>
        <select><option>全部级别</option></select>
        <select><option>全部状态</option></select>
      </div>
      <table>
        <thead>
          <tr><th>视频标题</th><th>所属模块</th><th>级别</th><th>时长</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="v in videos" :key="v.title">
            <td>
              <div class="video-cell"><PlayCircle :size="18" /><b>{{ v.title }}</b></div>
            </td>
            <td>{{ moduleName(v.module) }}</td>
            <td><span class="pill">{{ v.level }}</span></td>
            <td>{{ v.time }}</td>
            <td><span class="pill" :class="{ warn: v.status === '失效待检' }">{{ v.status }}</span></td>
            <td><button @click="ElMessage({ message: '编辑功能（演示）', type: 'info' })">编辑</button>　<button>预览</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="drawer" class="card drawer">
      <div class="drawer-head">
        <h2>新增视频</h2>
        <button @click="drawer = false">×</button>
      </div>
      <form @submit.prevent="createVideo">
        <label>视频标题 *<input v-model="form.title" required placeholder="如：EIS 阻抗谱与等效电路（1）" /></label>
        <label>所属模块 *<input v-model="form.module" required placeholder="如：B3 EIS 交流阻抗" /></label>
        <div class="form-grid">
          <label>级别
            <select v-model="form.level"><option>必看</option><option>需要时再看</option></select>
          </label>
          <label>时长<input v-model="form.time" placeholder="如 14:20" /></label>
        </div>
        <label>链接 *<input v-model="form.url" required placeholder="B站/官方教程链接（只存链接，不下载转存）" /></label>
        <label>note（看这个解决什么问题）<textarea v-model="form.note" placeholder="如：解决 PARAFAC 组分数如何选取的问题" /></label>
        <div class="drawer-actions">
          <button type="button" class="btn ghost" @click="drawer = false">取消</button>
          <button type="submit" class="btn">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.admin-head { display: flex; align-items: baseline; gap: 20px; }
.admin-head h1 { font-family: var(--font-kai); color: var(--ink); margin: 0; font-size: 37px; letter-spacing: 2px; }
.admin-head p { color: #728a93; font-size: 13px; }
.vl-table { padding: 14px; }
.vl-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.tabs { display: flex; gap: 8px; border-bottom: 1px solid #dce7ea; flex: 1; }
.tabs button, .tabs a { border: 0; background: transparent; padding: 8px 12px; font-size: 12px; color: #5e747e; text-decoration: none; }
.tabs .active { color: #0f7c87; border-bottom: 2px solid #0f7c87; font-weight: 700; }
.vl-toolbar .btn { min-height: 32px; font-size: 11px; }
.table-filters { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 8px; margin: 10px 0; }
.table-filters label, .table-filters select { height: 34px; }
.table-filters label { display: flex; align-items: center; gap: 7px; border: 1px solid #dce7ea; border-radius: 8px; padding: 0 11px; background: white; }
.table-filters input { border: 0; outline: 0; background: transparent; flex: 1; font-size: 12px; }
.table-filters select { border: 1px solid #dce7ea; border-radius: 8px; background: white; padding: 0 10px; }
.vl-table table { width: 100%; border-collapse: collapse; font-size: 11px; }
.vl-table th { background: #f3f7f8; text-align: left; padding: 8px; color: #4a5f68; }
.vl-table td { padding: 7px; border-bottom: 1px solid #e6edef; color: #3d5560; }
.vl-table td button { border: 0; background: transparent; color: #147681; font-size: 10px; }
.video-cell { display: flex; align-items: center; gap: 7px; color: #14727d; }
.video-cell b { color: #3d5560; font-weight: 400; }
.pill.warn { background: #f6efe6; color: #a8743f; }
.drawer { padding: 16px; margin-top: 12px; }
.drawer-head { display: flex; justify-content: space-between; align-items: center; }
.drawer-head h2 { margin: 0; font-size: 16px; color: var(--ink); }
.drawer-head button { border: 0; background: transparent; font-size: 18px; color: #5e747e; }
.drawer form { display: grid; gap: 10px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.drawer label { display: grid; gap: 5px; font-size: 11px; font-weight: 700; color: #3d5560; }
.drawer input, .drawer select, .drawer textarea { border: 1px solid #dce7e9; border-radius: 6px; padding: 8px; background: white; font-weight: 400; }
.drawer textarea { height: 70px; resize: none; }
.drawer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
.drawer-actions .btn { min-height: 32px; font-size: 11px; }
</style>
