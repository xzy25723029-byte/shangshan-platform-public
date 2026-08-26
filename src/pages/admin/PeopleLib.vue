<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { mockApi } from "../../api";

import {
  UsersThree, VideoCamera, FileText, BookOpen,
  MagnifyingGlass, Plus, DownloadSimple, ListBullets, LinkSimple, X, UploadSimple,
} from "@/icons";

/* 内容管理 · 人物库：表格 + 新增人物抽屉（原型 admin 页移植） */

const persons = ref([]);
const drawer = ref(false);
const step = ref(1);
const currentPage = ref(1);
const selected = ref(new Set());
const form = ref({ name: "", category: "本学科先辈", subject: "环境科学与工程", unit: "", title: "", bio: "", markdown: "" });
const stats = { people: 1246, videos: 3682, cases: 2158, papers: 1024 };
const totalPages = 63;

onMounted(async () => {
  persons.value = await mockApi.getPersons();
});

function toggleSelect(name) {
  const s = new Set(selected.value);
  s.has(name) ? s.delete(name) : s.add(name);
  selected.value = s;
}

/* 批量导入（演示）：模拟 CSV 导入，新增 3 条示例人物 */
async function bulkImport() {
  try {
    await ElMessageBox.confirm(
      "批量导入需要 CSV 文件（姓名,单位,研究方向）。演示环境将模拟导入 3 条示例数据，是否继续？",
      "批量导入",
      { confirmButtonText: "模拟导入", cancelButtonText: "取消", type: "info" },
    );
    const samples = [
      { name: "导入示例一", unit: "示例单位 A", direction: "水处理工艺", status: "已发布" },
      { name: "导入示例二", unit: "示例单位 B", direction: "环境监测", status: "审核中" },
      { name: "导入示例三", unit: "示例单位 C", direction: "固废资源化", status: "审核中" },
    ];
    for (const s of samples) {
      await mockApi.savePerson({ ...s, subject: "环境科学与工程", avatar: `avatar-${(persons.value.length % 8) + 1}.png`, videos: 0, cases: 0, papers: 0 });
    }
    persons.value = await mockApi.getPersons();
    ElMessage({ message: `批量导入完成：新增 ${samples.length} 条（演示）`, type: "success" });
  } catch {
    /* 用户取消 */
  }
}

/* 批量操作：对勾选行执行（演示：标记为已发布） */
async function bulkAction() {
  const names = [...selected.value];
  if (!names.length) {
    ElMessage({ message: "请先勾选要操作的行", type: "warning" });
    return;
  }
  try {
    await ElMessageBox.confirm(`将对勾选的 ${names.length} 行执行「标记为已发布」，是否继续？`, "批量操作", {
      confirmButtonText: "执行",
      cancelButtonText: "取消",
      type: "info",
    });
    for (const p of persons.value) {
      if (names.includes(p.name)) p.status = "已发布";
    }
    ElMessage({ message: `已对 ${names.length} 行执行批量操作（演示）`, type: "success" });
  } catch {
    /* 用户取消 */
  }
}

/* 批量检测链接：模拟检测，返回结果统计 */
async function bulkCheckLinks() {
  ElMessage({ message: "链接检测完成：全部有效（演示）", type: "success" });
}

/* 分页（演示）：切换当前页高亮 */
const pageNumbers = computed(() => {
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage.value) <= 2) pages.push(p);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return pages;
});
function goPage(p) {
  if (typeof p !== "number") return;
  if (p < 1 || p > totalPages) {
    ElMessage({ message: p < 1 ? "已在第一页" : "已是最后一页", type: "info" });
    return;
  }
  if (p === currentPage.value) {
    ElMessage({ message: `已在第 ${p} 页`, type: "info" });
    return;
  }
  currentPage.value = p;
}

async function createPerson() {
  if (!form.value.name || !form.value.markdown) {
    ElMessage({ message: "姓名与人物简介（Markdown）为必填", type: "warning" });
    return;
  }
  await mockApi.savePerson({
    ...form.value,
    avatar: `avatar-${(persons.value.length % 8) + 1}.png`,
    videos: 0,
    cases: 0,
    papers: 0,
    status: "审核中",
  });
  persons.value = await mockApi.getPersons();
  drawer.value = false;
  step.value = 1;
  form.value = { name: "", category: "本学科先辈", subject: "环境科学与工程", unit: "", title: "", bio: "", markdown: "" };
  ElMessage({ message: "人物已保存（演示环境）", type: "success" });
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-head">
      <h1>内容管理后台</h1>
      <p>统一管理平台内容资源，保障资源质量与合规</p>
    </div>

    <div class="admin-stats">
      <div v-for="(v, key) in stats" :key="key" class="card">
        <div>
          <span>{{ { people: "人物库", videos: "视频资源", cases: "范例库", papers: "复现论文池" }[key] }}</span>
          <b>{{ v.toLocaleString() }}</b>
          <small>较昨日稳定更新</small>
        </div>
        <component :is="key === 'people' ? UsersThree : key === 'videos' ? VideoCamera : key === 'cases' ? FileText : BookOpen" :size="54" weight="duotone" />
      </div>
    </div>

    <div class="admin-work">
      <div class="card admin-table">
        <div class="tabs">
          <button class="active">人物库</button>
          <router-link to="/admin/videos">视频资源</router-link>
          <router-link to="/admin/modules">模块配置</router-link>
        </div>
        <div class="table-filters">
          <label><MagnifyingGlass :size="15" /><input placeholder="搜索人物姓名、研究方向、关键词" /></label>
          <select><option>全部学科</option></select>
          <select><option>全部类别</option></select>
          <select><option>全部状态</option></select>
        </div>
        <div class="table-actions">
          <button class="btn" @click="drawer = true"><Plus :size="15" />新增人物</button>
          <button class="btn ghost" @click="bulkImport"><DownloadSimple :size="15" />批量导入</button>
          <button class="btn ghost" @click="bulkAction"><ListBullets :size="15" />批量操作</button>
          <button class="btn ghost" @click="bulkCheckLinks"><LinkSimple :size="15" />批量检测链接</button>
        </div>
        <table>
          <thead>
            <tr>
              <th></th><th>人物信息</th><th>所属学科</th><th>研究方向</th><th>视频资源</th><th>关联内容</th><th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in persons" :key="p.name">
              <td><input type="checkbox" :checked="selected.has(p.name)" @change="toggleSelect(p.name)" /></td>
              <td>
                <div class="person-cell">
                  <img :src="`/assets/${p.avatar}`" :alt="p.name" />
                  <span><b>{{ p.name }}</b><small>{{ p.unit }}</small></span>
                </div>
              </td>
              <td>{{ p.subject }}</td>
              <td>{{ p.direction }}</td>
              <td>{{ p.videos }}</td>
              <td>范例 {{ p.cases }}　论文 {{ p.papers }}</td>
              <td><span class="pill">{{ p.status }}</span></td>
              <td><button>编辑</button>　<button>预览</button></td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <span>共 1,246 条</span>
          <button @click="goPage(currentPage - 1)" :disabled="currentPage <= 1">‹</button>
          <button v-for="p in pageNumbers" :key="p" :class="{ current: p === currentPage }" @click="goPage(p)">{{ p }}</button>
          <button @click="goPage(currentPage + 1)" :disabled="currentPage >= totalPages">›</button>
        </div>
      </div>

      <div v-if="drawer" class="card drawer">
        <div class="drawer-head">
          <h2>新增人物</h2>
          <button @click="drawer = false"><X :size="18" /></button>
        </div>
        <div class="form-progress">
          <span :class="{ active: step === 1 }">1 基本信息</span>
          <span :class="{ active: step === 2 }">2 研究与成果</span>
          <span :class="{ active: step === 3 }">3 关联资源</span>
          <span :class="{ active: step === 4 }">4 预览与发布</span>
        </div>
        <form @submit.prevent="createPerson">
          <div class="form-grid">
            <label>姓名 *<input v-model="form.name" required placeholder="请输入真实姓名" /></label>
            <label>类别 *
              <select v-model="form.category" required>
                <option value="">请选择人物类别</option>
                <option v-for="c in ['革命先辈与战略思想', '功勋科学家', '当代模范', '本学科先辈']" :key="c">{{ c }}</option>
              </select>
            </label>
            <label>所属学科 *<select v-model="form.subject"><option>环境科学与工程</option></select></label>
            <label>职称<input v-model="form.title" placeholder="如：教授、研究员" /></label>
          </div>
          <label>所属单位<input v-model="form.unit" placeholder="请输入所属单位" /></label>
          <label>头像<span class="avatar-upload"><UploadSimple :size="20" />点击上传<small>支持 JPG/PNG，建议尺寸 512×512px</small></span></label>
          <label>个人简介<textarea v-model="form.bio" placeholder="请简要介绍个人学术背景与研究方向…" /></label>
          <label>人物简介（Markdown）*<textarea v-model="form.markdown" required placeholder="请上传或粘贴人物详细介绍，支持 Markdown 格式…" /></label>
          <div class="drawer-actions">
            <button type="button" class="btn ghost" @click="drawer = false">取消</button>
            <button type="button" class="btn ghost">保存草稿</button>
            <button type="submit" class="btn">下一步</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-head { display: flex; align-items: baseline; gap: 20px; }
.admin-head h1 { font-family: var(--font-kai); color: var(--ink); margin: 0; font-size: 37px; letter-spacing: 2px; }
.admin-head p { color: #728a93; font-size: 13px; }
.admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 12px 0; }
.admin-stats > .card { padding: 12px; display: flex; align-items: center; justify-content: space-between; }
.admin-stats span, .admin-stats b, .admin-stats small { display: block; }
.admin-stats span { font-size: 11px; color: #5e747e; }
.admin-stats b { font-size: 24px; color: #0c5965; margin: 2px 0; }
.admin-stats small { color: #6aa8ae; font-size: 10px; }
.admin-stats svg { color: #168b96; }
.admin-work { display: grid; grid-template-columns: minmax(0, 1fr) 440px; gap: 12px; }
.admin-table { padding: 14px; overflow: hidden; }
.tabs { display: flex; gap: 8px; border-bottom: 1px solid #dce7ea; }
.tabs button, .tabs a { border: 0; background: transparent; padding: 8px 12px; font-size: 12px; color: #5e747e; text-decoration: none; }
.tabs .active { color: #0f7c87; border-bottom: 2px solid #0f7c87; font-weight: 700; }
.table-filters { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 8px; margin: 8px 0; }
.table-filters label, .table-filters select { height: 34px; }
.table-filters label { display: flex; align-items: center; gap: 7px; border: 1px solid #dce7ea; border-radius: 8px; padding: 0 11px; background: white; }
.table-filters input { border: 0; outline: 0; background: transparent; flex: 1; font-size: 12px; }
.table-filters select { border: 1px solid #dce7ea; border-radius: 8px; background: white; padding: 0 10px; }
.table-actions { display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.table-actions .btn { min-height: 32px; font-size: 11px; }
.admin-table table { width: 100%; border-collapse: collapse; font-size: 10px; }
.admin-table th { background: #f3f7f8; text-align: left; padding: 6px; color: #4a5f68; }
.admin-table td { padding: 5px; border-bottom: 1px solid #e6edef; color: #3d5560; }
.admin-table td button { border: 0; background: transparent; color: #147681; font-size: 10px; }
.person-cell { display: flex; align-items: center; gap: 7px; }
.person-cell img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.person-cell b, .person-cell small { display: block; }
.person-cell small { color: #83979e; font-size: 9px; }
.pagination { display: flex; gap: 6px; align-items: center; padding-top: 7px; }
.pagination span { margin-right: auto; font-size: 10px; color: #5e747e; }
.pagination button { border: 0; background: white; padding: 6px 9px; border-radius: 5px; font-size: 11px; }
.pagination .current { background: #167f89; color: white; }
.drawer { padding: 15px; align-self: start; }
.drawer-head { display: flex; justify-content: space-between; align-items: center; }
.drawer-head h2 { margin: 0; font-size: 16px; color: var(--ink); }
.drawer-head button { border: 0; background: transparent; color: #5e747e; }
.form-progress { display: flex; justify-content: space-between; margin: 12px 0; font-size: 10px; }
.form-progress span { color: #95a5aa; }
.form-progress span.active { color: #087681; font-weight: 700; }
.drawer form { display: grid; gap: 8px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.drawer label { display: grid; gap: 5px; font-size: 11px; font-weight: 700; color: #3d5560; }
.drawer input, .drawer select, .drawer textarea { border: 1px solid #dce7e9; border-radius: 6px; padding: 7px; background: white; font-weight: 400; }
.drawer textarea { height: 66px; resize: none; font-size: 11px; }
.avatar-upload {
  width: 95px; height: 62px;
  border: 1px dashed #9ecbd0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #277984;
  font-weight: 400;
  gap: 2px;
}
.avatar-upload small { font-size: 8px; color: #9aabad; text-align: center; }
.drawer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
.drawer-actions .btn { min-height: 32px; font-size: 11px; }
</style>
