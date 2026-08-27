<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { api } from "../../../api";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import FileUploadBox from "../../../components/common/FileUploadBox.vue";
import { graduationSections } from "../../../data/projects";
import { ArrowLeft, ArrowRight } from "@/icons";

/* 毕设各阶段页骨架（选题调研/开题/实验记录/中期/论文写作/答辩/归档）
   数据来自 graduation 数据模型，可记录卡点（卡点与顺利记录同样式） */

const route = useRoute();
const g = ref(null);

onMounted(async () => {
  g.value = await api.getGraduation();
});

const sectionId = computed(() => route.params.section || "overview");
const meta = computed(() => graduationSections.find((s) => s.id === sectionId.value));
const index = computed(() => graduationSections.findIndex((s) => s.id === sectionId.value));
const prev = computed(() => (index.value > 0 ? graduationSections[index.value - 1] : null));
const next = computed(() => (index.value < graduationSections.length - 1 ? graduationSections[index.value + 1] : null));

const cardPoints = ref("");
const cardType = ref("顺利");

async function addCard() {
  if (!cardPoints.value.trim()) {
    ElMessage({ message: "先写一句记录", type: "warning" });
    return;
  }
  g.value = await api.updateGraduation({
    experimentLogs: [
      ...(g.value.experimentLogs || []),
      { date: new Date().toISOString().slice(0, 10), type: cardType.value === "顺利" ? "实验" : "异常", content: cardPoints.value.trim() },
    ],
  });
  cardPoints.value = "";
  ElMessage({ message: "已记录（卡点与顺利记录同样式，不催促、不警告）", type: "success" });
}
</script>

<template>
  <div v-if="g" class="gd-section-page">
    <div class="page-banner">
      <div>
        <h1>{{ meta ? meta.name : "毕业设计" }}</h1>
        <p>{{ meta ? meta.desc : "" }}</p>
      </div>
      <router-link class="btn ghost" to="/student/graduation">‹ 毕设总览</router-link>
    </div>

    <!-- 选题与调研 -->
    <template v-if="sectionId === 'topic'">
      <div class="card gd-block">
        <SectionTitle title="选题来源" />
        <p>选题来源：{{ g.topic.source }}</p>
        <p class="gd-quote">原话墙关联：{{ g.topic.voiceId }}　{{ g.topic.interview }}</p>
      </div>
      <div class="card gd-block">
        <SectionTitle title="文献调研" />
        <p>{{ g.topic.literature }}</p>
        <router-link class="btn ghost" to="/student/voice">去原话墙找线索</router-link>
      </div>
    </template>

    <!-- 开题任务 -->
    <template v-else-if="sectionId === 'proposal'">
      <div class="card gd-block">
        <SectionTitle title="研究问题与技术路线" />
        <ul class="gd-list">
          <li v-for="q in g.proposal.questions" :key="q">{{ q }}</li>
        </ul>
      </div>
      <div class="card gd-block">
        <SectionTitle title="风险点" note="写出来就是进展" />
        <ul class="gd-list">
          <li v-for="r in g.proposal.risks" :key="r">{{ r }}</li>
        </ul>
      </div>
      <div class="card gd-block">
        <SectionTitle title="开题材料" />
        <FileUploadBox accept="支持 PDF / DOCX，单个文件 ≤ 50MB" @change="() => {}" />
      </div>
    </template>

    <!-- 实验/计算记录 -->
    <template v-else-if="sectionId === 'experiment'">
      <div class="card gd-block">
        <SectionTitle title="记录一条" note="卡点记录与顺利记录同样式" />
        <div class="gd-log-form">
          <select v-model="cardType">
            <option>顺利</option>
            <option>卡点</option>
            <option>异常</option>
          </select>
          <input v-model="cardPoints" placeholder="记下做了什么、观察到什么、卡在哪里…" />
          <button class="btn" @click="addCard">保存</button>
        </div>
      </div>
      <div class="gd-logs">
        <article v-for="log in g.experimentLogs" :key="log.date + log.content" class="card gd-log">
          <header>
            <b>{{ log.date }}</b>
            <span class="pill">{{ log.type }}</span>
          </header>
          <p>{{ log.content }}</p>
        </article>
      </div>
    </template>

    <!-- 中期检查 -->
    <template v-else-if="sectionId === 'midterm'">
      <div class="card gd-block">
        <SectionTitle title="阶段成果" />
        <p>当前处于「{{ g.stage }}」阶段。中期检查材料将在推进中自动汇总：实验记录、图表、导师意见、下一步计划。</p>
      </div>
      <div class="card gd-block">
        <SectionTitle title="导师意见" />
        <p>{{ g.topic.literature }}</p>
      </div>
      <div class="card gd-block">
        <SectionTitle title="下一步计划" />
        <FileUploadBox accept="支持 PDF / DOCX / PPT，单个文件 ≤ 50MB" @change="() => {}" />
      </div>
    </template>

    <!-- 论文写作 -->
    <template v-else-if="sectionId === 'writing'">
      <div class="card gd-block">
        <SectionTitle title="章节草稿" />
        <div class="gd-chapters">
          <span v-for="c in g.writing.chapters" :key="c.name" :class="{ pending: c.state === '尚未开启' }">
            {{ c.name }} · {{ c.state }}
          </span>
        </div>
      </div>
      <div class="card gd-block">
        <SectionTitle title="图表与引用" />
        <p v-for="f in g.writing.figures" :key="f">{{ f }}</p>
        <p class="gd-note">引用走 Zotero 条目管理，见第1层「文献管理 Zotero」模块。</p>
      </div>
    </template>

    <!-- 答辩准备 -->
    <template v-else-if="sectionId === 'defense'">
      <div class="card gd-block">
        <SectionTitle title="答辩材料" />
        <p>PPT：{{ g.defense.ppt }}　讲稿：{{ g.defense.speech }}</p>
      </div>
      <div class="card gd-block">
        <SectionTitle title="可能被问的问题" />
        <ul class="gd-list">
          <li v-for="q in g.defense.questions" :key="q">{{ q }}</li>
        </ul>
      </div>
    </template>

    <!-- 归档封存 -->
    <template v-else-if="sectionId === 'archive'">
      <div class="card gd-block">
        <SectionTitle title="归档封存" />
        <p>{{ g.archive.note }}</p>
        <p class="gd-note">导师评价：{{ g.archive.mentorComment }}</p>
      </div>
      <div class="card gd-block">
        <SectionTitle title="归档清单" />
        <ul class="gd-list">
          <li>最终论文（PDF）</li>
          <li>实验/仿真原始数据</li>
          <li>代码与图表文件</li>
          <li>导师评价记录</li>
        </ul>
      </div>
    </template>

    <div class="gd-pager">
      <router-link v-if="prev" class="btn ghost" :to="`/student/graduation/${prev.id}`"><ArrowLeft :size="14" />{{ prev.name }}</router-link>
      <router-link v-if="next" class="btn ghost" :to="`/student/graduation/${next.id}`">{{ next.name }}<ArrowRight :size="14" /></router-link>
    </div>
  </div>
</template>

<style scoped>
.gd-block { padding: 18px 22px; margin-bottom: 14px; }
.gd-block p { margin: 8px 0 0; font-size: 12px; line-height: 1.9; color: #4a5f68; }
.gd-quote {
  padding: 10px 14px;
  background: #f2fafb;
  border-left: 3px solid #59c5d1;
  border-radius: 0 8px 8px 0;
}
.gd-list { margin: 10px 0 0; padding-left: 18px; font-size: 12px; line-height: 2.2; color: #4a5f68; }
.gd-log-form { display: flex; gap: 8px; margin-top: 10px; }
.gd-log-form select { border: 1px solid #dce7ea; border-radius: 8px; background: white; padding: 0 10px; }
.gd-log-form input { flex: 1; height: 38px; border: 1px solid #dce8eb; border-radius: 8px; padding: 0 12px; }
.gd-logs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.gd-log { padding: 14px; }
.gd-log header { display: flex; justify-content: space-between; align-items: center; }
.gd-log b { font-size: 11px; color: #3d5560; }
.gd-log p { margin: 8px 0 0; font-size: 11px; line-height: 1.8; color: #4a5f68; }
.gd-chapters { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.gd-chapters span {
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #eef8f9;
  color: #14727d;
  border: 1px solid #d3e9ec;
}
.gd-chapters span.pending { background: #f1f4f5; color: #7a8d95; border-color: #e2e7e9; }
.gd-note { font-size: 11px; color: #8a9ba2; }
.gd-pager { display: flex; justify-content: space-between; margin-top: 6px; }
</style>
