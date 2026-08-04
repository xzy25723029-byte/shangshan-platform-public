<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../api";
import SectionTitle from "../../components/common/SectionTitle.vue";
import RadarProfile from "../../components/profile/RadarProfile.vue";
import { cognitiveAxes } from "../../data/chuxintang";

/* 认知侧写查看（导师端）
   必须标注：「不构成评价，不得作为筛选依据」 */

const profiles = ref([]);
const selected = ref(null);

onMounted(async () => {
  profiles.value = await mockApi.getStudentCognitiveProfiles();
  selected.value = profiles.value[0] || null;
});

function pick(i) {
  selected.value = profiles.value[i];
}
</script>

<template>
  <div class="cv-page">
    <div class="page-banner">
      <div>
        <h1>认知侧写查看</h1>
        <p>了解学生近期的倾向变化，用于指导沟通方向</p>
      </div>
      <span class="pill">不构成评价 · 不得作为筛选依据</span>
    </div>

    <p class="cv-notice">
      认知侧写是学生「自己 vs 自己」的倾向记录，不是考试分数。
      它不用于任何评价、筛选、准入或排名；只用于帮助你更好地理解学生当下的状态，调整指导方式。
    </p>

    <div class="cv-layout" v-if="selected">
      <div class="cv-list card">
        <button
          v-for="(p, i) in profiles"
          :key="p.student"
          class="cv-item"
          :class="{ selected: selected.student === p.student }"
          @click="pick(i)"
        >
          <img :src="`/assets/${p.avatar}`" :alt="p.student" />
          <span><b>{{ p.student }}</b><small>最近更新 · 2026-07-28</small></span>
        </button>
      </div>

      <div class="card cv-radar">
        <SectionTitle title="六轴倾向" note="实线：现在 · 虚线：入学基线（自己 vs 自己）" />
        <RadarProfile
          :axes="cognitiveAxes"
          :scores="selected.scores"
          :baseline="selected.baseline"
        />
        <p class="cv-guide">
          观察要点：哪些轴有变化、哪些轴仍低——结合学生最近的记录与对话来理解，不要单独据此做任何判断。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cv-notice {
  margin: 0 0 14px;
  padding: 12px 16px;
  border: 1px solid #e2d9c4;
  border-radius: 10px;
  background: #faf6ec;
  font-size: 12px;
  line-height: 1.8;
  color: #7c5a30;
}
.cv-layout { display: grid; grid-template-columns: 300px 1fr; gap: 14px; }
.cv-list { padding: 12px; align-self: start; }
.cv-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e0eaec;
  background: white;
  border-radius: 8px;
  margin-bottom: 7px;
  text-align: left;
}
.cv-item.selected { background: #eff9fa; border-color: #91d0d6; }
.cv-item img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.cv-item b, .cv-item small { display: block; }
.cv-item b { font-size: 12px; color: #0d5e68; }
.cv-item small { font-size: 9px; color: #82969e; margin-top: 3px; }
.cv-radar { padding: 18px 22px; }
.cv-guide {
  margin: 14px 0 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f7fafb;
  font-size: 11px;
  line-height: 1.8;
  color: #5e747e;
}
</style>
