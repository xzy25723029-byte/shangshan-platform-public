<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../api";
import ModuleCard from "../../components/common/ModuleCard.vue";
import { WarningCircle } from "@/icons";

/* 第2层 · 专业基础
   六群模块：材料表征 / 电化学 / 水质 / 机理与计算 / 过程模拟 / 环境与经济
   贯穿主题：结果可不可信——拟合得好 ≠ 结果对 */

const groups = ref([]);
const topics = ref([]);

onMounted(async () => {
  [groups.value, topics.value] = await Promise.all([mockApi.getLayer2Groups(), mockApi.getTrustTopics()]);
});
</script>

<template>
  <div class="l2-page">
    <div class="page-banner">
      <div>
        <h1>第2层 · 专业基础</h1>
        <p>从通用科研动作进入专业工具与专业判断——环境工程软件与专业训练</p>
      </div>
      <span class="pill">六群 · {{ groups.reduce((n, g) => n + g.modules.length, 0) }} 个模块</span>
    </div>

    <div class="card l2-principle">
      <b>这一层的原则</b>
      <p>
        第2层不是「更高等级」，而是进入专业工具与专业判断。每一个模块都要亲手做出一个可判断的结果；
        贯穿全层的主题只有一个——<b>结果可不可信</b>：拟合得好 ≠ 结果对。
      </p>
    </div>

    <section v-for="g in groups" :key="g.key" class="l2-group">
      <div class="l2-group-head">
        <span class="l2-key">{{ g.key }}</span>
        <div>
          <h3>{{ g.name }}</h3>
          <p>回答：{{ g.question }}</p>
        </div>
        <span class="pill l2-status">{{ g.status }}</span>
      </div>
      <div class="l2-grid">
        <ModuleCard
          v-for="m in g.modules"
          :key="m.id"
          layer="layer2"
          :id="m.id"
          :name="m.name"
          :code="m.code || m.id"
          :type="m.type"
          :hours="m.hours"
          :acceptance="m.acceptance"
          :tag="g.name"
        />
      </div>
    </section>

    <section class="card l2-topics">
      <div class="l2-topics-head">
        <WarningCircle :size="18" />
        <h3>结果可不可信 · 贯穿专题</h3>
      </div>
      <p class="l2-topics-sub">这七个坑跨模块通用——先知道坑在哪，再动手做。</p>
      <div class="l2-topics-grid">
        <div v-for="t in topics" :key="t.title" class="topic-card">
          <b>{{ t.title }}</b>
          <p>{{ t.body }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.l2-principle { padding: 16px 22px; margin-bottom: 14px; }
.l2-principle b { font-size: 13px; color: #0d5e68; }
.l2-principle p { margin: 6px 0 0; font-size: 12px; line-height: 1.9; color: #4a5f68; }

.l2-group { margin-bottom: 18px; }
.l2-group-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.l2-key {
  width: 34px; height: 34px; border-radius: 10px;
  display: grid; place-items: center;
  background: #e3f4f4; color: #0d7d88;
  font-weight: 800; font-size: 14px;
}
.l2-group-head h3 { margin: 0; font-size: 15px; color: #0d5e68; }
.l2-group-head p { margin: 2px 0 0; font-size: 11px; color: #7a8d95; }
.l2-status { margin-left: auto; }

.l2-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

.l2-topics { padding: 18px 22px; margin-top: 6px; border-color: #bcd8dd; background: linear-gradient(160deg, #fbfefe, #f2fafb); }
.l2-topics-head { display: flex; align-items: center; gap: 8px; }
.l2-topics-head h3 { margin: 0; font-size: 14px; color: #0d5e68; }
.l2-topics-sub { margin: 6px 0 12px; font-size: 11px; color: #6f8791; }
.l2-topics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.topic-card { border: 1px solid #d9e9ec; border-radius: 10px; padding: 10px 12px; background: #fff; }
.topic-card b { font-size: 12px; color: #12606c; }
.topic-card p { margin: 5px 0 0; font-size: 11px; line-height: 1.7; color: #5e747e; }

@media (max-width: 1300px) {
  .l2-grid { grid-template-columns: repeat(2, 1fr); }
  .l2-topics-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
