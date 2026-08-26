<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../../api";
import { ArrowRight } from "@/icons";

const projects = ref([]);

onMounted(async () => {
  projects.value = await mockApi.getProjects();
});
</script>

<template>
  <div class="pc-list">
    <div class="page-banner">
      <div>
        <h1>大创中心</h1>
        <p>把第0层的战略判断、第1层的基础能力、第2层的专业分析、第3层的真实产出串起来</p>
      </div>
    </div>

    <div class="card pc-prereq">
      <b>立项前建议先完成：</b>
      <span>至少一次产业调研记录</span>
      <span>至少一条原话墙来源</span>
      <span>能量流物质流六问初步回答</span>
    </div>

    <div class="pc-grid">
      <article v-for="p in projects" :key="p.id" class="card pc-card">
        <header>
          <span class="pill">{{ p.type }}</span>
          <em>{{ p.status }}</em>
        </header>
        <h2>{{ p.name }}</h2>
        <p>{{ p.abstract }}</p>
        <dl>
          <div><dt>负责人</dt><dd>{{ p.owner }}</dd></div>
          <div><dt>立项日期</dt><dd>{{ p.start }}</dd></div>
          <div><dt>所属领域</dt><dd>{{ p.field }}</dd></div>
        </dl>
        <router-link class="btn" :to="`/student/project/${p.id}`">进入课题 <ArrowRight :size="14" /></router-link>
      </article>
    </div>
  </div>
</template>

<style scoped>
.pc-prereq {
  padding: 14px 20px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.pc-prereq b { font-size: 13px; color: #0d5e68; }
.pc-prereq span {
  font-size: 11px;
  color: #14727d;
  background: #eef8f9;
  border: 1px solid #d3e9ec;
  border-radius: 999px;
  padding: 5px 12px;
}
.pc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.pc-card { padding: 20px 24px; display: flex; flex-direction: column; gap: 10px; }
.pc-card header { display: flex; justify-content: space-between; align-items: center; }
.pc-card em { font-style: normal; font-size: 11px; color: #168678; background: #e7f6f2; border-radius: 12px; padding: 4px 9px; }
.pc-card h2 { margin: 0; font-size: 18px; color: var(--ink); }
.pc-card p { margin: 0; font-size: 12px; line-height: 1.8; color: #5e747e; flex: 1; }
.pc-card dl { margin: 0; display: flex; gap: 22px; }
.pc-card dt { font-size: 10px; color: #8a9ba2; }
.pc-card dd { margin: 3px 0 0; font-size: 12px; font-weight: 700; color: #3d5560; }
.pc-card .btn { align-self: flex-start; text-decoration: none; }
</style>
