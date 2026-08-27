<script setup>
import { ref, onMounted } from "vue";
import { api } from "../../api";
import SectionTitle from "../../components/common/SectionTitle.vue";
import { MagnifyingGlass, Funnel, FileText, DownloadSimple, File } from "@/icons";

/* 批阅工作台：待批阅/已批阅/全部；反馈只有「通过 / 请再想想」
   不用「未通过」，不用鲜红失败状态 */

const queue = ref([]);
const selectedId = ref("");
const current = ref(null);
const reply = ref("");
const statusMsg = ref("");
const tab = ref("待批阅");

onMounted(async () => {
  queue.value = await api.getReviewQueue();
  if (queue.value.length) select(queue.value[0].id);
});

const filtered = () =>
  tab.value === "全部" ? queue.value : queue.value.filter((r) => r.status === tab.value);

async function select(id) {
  selectedId.value = id;
  current.value = await api.getReview(id);
  reply.value = current.value.feedback || "";
  statusMsg.value = "";
}

async function submit(verdict) {
  if (verdict === "warm" && !reply.value.trim()) {
    statusMsg.value = "请先填写具体反馈，再请学生再想想";
    return;
  }
  await api.submitReview(current.value.id, { verdict, feedback: reply.value.trim() });
  const updated = await api.getReviewQueue();
  queue.value = updated;
  current.value = await api.getReview(current.value.id);
  statusMsg.value = verdict === "ok" ? "已通过" : "已请学生再想想";
}
</script>

<template>
  <div class="review-page">
    <div class="review-heading">
      <h1>批阅工作台</h1>
      <span>专注反馈，助力学生改进与成长</span>
    </div>

    <div class="review-layout">
      <div class="card review-queue">
        <div class="tabs">
          <button :class="{ active: tab === '待批阅' }" @click="tab = '待批阅'">待批阅（{{ queue.filter((r) => r.status === '待批阅').length }}）</button>
          <button :class="{ active: tab === '已批阅' }" @click="tab = '已批阅'">已批阅</button>
          <button :class="{ active: tab === '全部' }" @click="tab = '全部'">全部</button>
        </div>
        <label class="queue-search">
          <MagnifyingGlass :size="15" />
          <input placeholder="搜索学生姓名或课题" />
          <Funnel :size="15" />
        </label>
        <button
          v-for="r in filtered()"
          :key="r.id"
          class="review-item"
          :class="{ selected: selectedId === r.id }"
          @click="select(r.id)"
        >
          <img :src="`/assets/${r.avatar}`" :alt="r.student" />
          <span>
            <b>{{ r.student }}</b>
            <strong>{{ r.task }}</strong>
            <small>提交时间：{{ r.time }}</small>
          </span>
          <i>{{ r.status }}</i>
        </button>
      </div>

      <div v-if="current" class="review-document">
        <div class="student-head" style="background-image: url(/assets/hero-water-city.png)">
          <img :src="`/assets/${current.avatar}`" :alt="current.student" />
          <div>
            <h2>{{ current.student }}</h2>
            <span>水环境治理组　大三　学号 20221056</span>
            <p>提交任务：{{ current.task }}</p>
          </div>
        </div>
        <div class="card doc-viewer">
          <SectionTitle title="提交内容" />
          <div class="doc-toolbar">
            <FileText :size="15" />研究报告.pdf
            <span>－　100%　＋</span>
            <DownloadSimple :size="15" />
          </div>
          <article v-if="current.content">
            <template v-for="(s, i) in current.content.sections" :key="i">
              <h3 v-if="s.h">{{ s.h }}</h3>
              <h4 v-if="s.sub">{{ s.sub }}</h4>
              <p>{{ s.p }}</p>
            </template>
            <img :src="`/assets/${current.content.figure}`" alt="报告内研究图表" />
          </article>
        </div>
      </div>

      <aside v-if="current" class="review-side">
        <div class="card">
          <SectionTitle title="附件资料（{{ current.attachments?.length || 0 }}）" />
          <div v-for="f in current.attachments || []" :key="f" class="file-row">
            <File :size="15" />{{ f }}<DownloadSimple :size="14" />
          </div>
        </div>
        <div class="card">
          <SectionTitle title="学生备注" />
          <p>{{ current.note || "无备注" }}</p>
        </div>
        <div class="card feedback">
          <SectionTitle title="我的反馈" />
          <textarea v-model="reply" placeholder="请针对研究设计、数据处理、结果分析、讨论逻辑等方面给出具体修改建议…" />
          <div class="button-row">
            <button class="btn" @click="submit('ok')">通过</button>
            <button class="btn ghost" @click="submit('warm')">请再想想</button>
          </div>
          <p v-if="statusMsg" class="status-message">{{ statusMsg }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.review-heading { display: flex; gap: 18px; align-items: center; margin: 0 0 14px; }
.review-heading h1 { font-family: var(--font-kai); color: var(--ink); margin: 0; font-size: 37px; letter-spacing: 2px; }
.review-heading span { color: #7b9199; font-size: 13px; }
.review-layout { display: grid; grid-template-columns: 310px 1fr 420px; gap: 12px; }
.review-queue { padding: 12px; align-self: start; }
.tabs { display: flex; gap: 8px; border-bottom: 1px solid #dce7ea; }
.tabs button { border: 0; background: transparent; padding: 8px 12px; font-size: 12px; color: #5e747e; }
.tabs button.active { color: #0f7c87; border-bottom: 2px solid #0f7c87; font-weight: 700; }
.queue-search { display: flex; align-items: center; gap: 7px; border: 1px solid #dce7ea; border-radius: 8px; padding: 0 11px; background: white; height: 38px; margin: 12px 0; }
.queue-search input { border: 0; outline: 0; background: transparent; flex: 1; font-size: 12px; }
.review-item { width: 100%; display: grid; grid-template-columns: 45px 1fr auto; gap: 8px; text-align: left; padding: 10px; border: 1px solid #e0eaec; background: white; border-radius: 8px; margin-bottom: 7px; }
.review-item.selected { background: #eff9fa; border-color: #91d0d6; }
.review-item img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
.review-item b, .review-item strong, .review-item small { display: block; }
.review-item b { font-size: 12px; color: #0d5e68; }
.review-item strong { font-size: 11px; margin: 3px 0; color: #3d5560; font-weight: 400; }
.review-item small { font-size: 9px; color: #82969e; }
.review-item i { font-style: normal; font-size: 9px; color: #16808a; align-self: center; }
.student-head {
  height: 98px;
  background-size: cover;
  background-position: center right;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
}
.student-head img { width: 68px; height: 68px; border-radius: 50%; }
.student-head h2 { margin: 0; font-size: 20px; color: var(--ink); }
.student-head span, .student-head p { font-size: 11px; color: #3d5560; margin: 2px 0; }
.doc-viewer { padding: 13px; margin-top: 10px; }
.doc-toolbar { display: flex; align-items: center; gap: 7px; padding: 10px; border: 1px solid #e0e9ec; border-radius: 7px; font-size: 11px; color: #3d5560; margin-top: 10px; }
.doc-toolbar span { margin-left: auto; }
.doc-viewer article { height: 520px; overflow: auto; padding: 18px; background: white; font-family: serif; line-height: 1.8; }
.doc-viewer article h3 { font-size: 14px; }
.doc-viewer article h4 { font-size: 12px; }
.doc-viewer article p { font-size: 12px; }
.doc-viewer article img { width: 100%; height: 160px; object-fit: cover; }
.review-side { display: grid; gap: 10px; align-content: start; }
.review-side > .card { padding: 13px; }
.file-row { display: flex; align-items: center; gap: 7px; border-bottom: 1px solid #e7eef0; padding: 8px 0; font-size: 11px; color: #3d5560; }
.file-row svg:last-child { margin-left: auto; color: #7a8d95; }
.review-side p { font-size: 11px; line-height: 1.7; color: #4a5f68; }
.feedback { border-color: #45aeb7; }
.feedback textarea { width: 100%; height: 150px; resize: none; border: 1px solid #dbe8ea; border-radius: 7px; padding: 10px; font-size: 12px; }
.button-row { display: flex; gap: 9px; margin-top: 10px; }
.status-message { margin-top: 8px; padding: 8px; border-radius: 6px; background: #eaf6f5; color: #11757d; font-size: 11px; }
</style>
