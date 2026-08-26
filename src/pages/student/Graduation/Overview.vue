<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../../api";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import MilestoneTimeline from "../../../components/project/MilestoneTimeline.vue";
import { graduationSections } from "../../../data/projects";
import { ArrowRight, FileText } from "@/icons";

/* 毕设总览：题目/导师/方向/当前阶段/关键文件 + 里程碑 + 8 个阶段入口 + 关联第3层交付物 */

const g = ref(null);
const directions = ref([]);

onMounted(async () => {
  [g.value, directions.value] = await Promise.all([mockApi.getGraduation(), mockApi.getLayer3Directions()]);
});

async function linkDeliverable(d) {
  if (!g.value) return;
  g.value = await mockApi.linkDeliverable(d.id);
  ElMessage({ message: `已关联为第3层交付物（方向 ${d.id} · ${d.name}），不重复提交、不重复验收`, type: "success" });
}
</script>

<template>
  <div v-if="g" class="gd-page">
    <div class="page-banner">
      <div>
        <h1>毕业设计</h1>
        <p>可追踪、可反馈、可归档的科研训练过程——与第3层交付物数据打通</p>
      </div>
      <span class="pill">当前阶段 · {{ g.stage }}</span>
    </div>

    <div class="gd-head card">
      <div class="gd-title">
        <h2>{{ g.title }}</h2>
        <div class="gd-meta">
          <span><b>导师</b>{{ g.mentor }}</span>
          <span><b>研究方向</b>{{ g.direction }}</span>
          <span><b>当前阶段</b>{{ g.stage }}</span>
        </div>
      </div>
      <div class="gd-files">
        <SectionTitle title="关键文件" />
        <div v-for="f in g.files" :key="f" class="gd-file"><FileText :size="15" />{{ f }}</div>
      </div>
    </div>

    <div class="card gd-milestone">
      <SectionTitle title="毕设里程碑" note="已走过的路，正在走的路，尚在前方的路" />
      <MilestoneTimeline :items="g.milestones" />
    </div>

    <div class="gd-sections">
      <router-link
        v-for="s in graduationSections"
        :key="s.id"
        class="card gd-section"
        :to="`/student/graduation/${s.id}`"
      >
        <b>{{ s.name }}</b>
        <p>{{ s.desc }}</p>
        <span>进入 <ArrowRight :size="13" /></span>
      </router-link>
    </div>

    <div class="card gd-link">
      <SectionTitle title="与第3层打通" note="不重复提交、不重复验收" />
      <p>
        毕业论文、专利申请、软件工具、装置/传感器——毕设成果可以直接关联为第3层交付物。
        关联后同一份成果只提交一次、只验收一次。
      </p>
      <div class="gd-link-row">
        <span v-for="d in g.linkedDeliverables" :key="d" class="pill">{{ d }}</span>
      </div>
      <div class="gd-link-dirs">
        <button
          v-for="d in directions"
          :key="d.id"
          class="btn ghost"
          @click="linkDeliverable(d)"
        >
          方向 {{ d.id }} · {{ d.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gd-head { padding: 20px 24px; display: grid; grid-template-columns: 1fr 260px; gap: 20px; }
.gd-title h2 { margin: 0 0 12px; font-size: 20px; color: var(--ink); }
.gd-meta { display: flex; gap: 28px; flex-wrap: wrap; }
.gd-meta span { font-size: 12px; color: #3d5560; }
.gd-meta b { display: block; font-size: 10px; color: #8a9ba2; margin-bottom: 3px; }
.gd-file { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #3d5560; padding: 4px 0; }
.gd-milestone { padding: 18px 24px; margin-top: 14px; }
.gd-sections { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 14px; }
.gd-section { padding: 16px; display: flex; flex-direction: column; gap: 6px; text-decoration: none; }
.gd-section b { font-size: 14px; color: #0d5e68; }
.gd-section p { margin: 0; font-size: 11px; line-height: 1.7; color: #5e747e; flex: 1; }
.gd-section span { font-size: 11px; color: var(--teal); font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.gd-section:hover { border-color: #91d0d6; }
.gd-link { padding: 18px 24px; margin-top: 14px; }
.gd-link p { margin: 8px 0; font-size: 12px; line-height: 1.8; color: #4a5f68; }
.gd-link-row { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.gd-link-dirs { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
