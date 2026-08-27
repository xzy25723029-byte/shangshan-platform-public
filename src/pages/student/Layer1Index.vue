<script setup>
import { ref, onMounted } from "vue";
import { api } from "../../api";
import ModuleCard from "../../components/common/ModuleCard.vue";

/* 第1层 · 基础底座（新兵连）
   模块可以多，但每个都要小、可完成、有实物产出 */

const modules = ref([]);

onMounted(async () => {
  modules.value = await api.getModules();
});
</script>

<template>
  <div class="l1-page">
    <div class="page-banner">
      <div>
        <h1>第1层 · 基础底座</h1>
        <p>新兵连：11 个模块，每个都要亲手做出一个实物</p>
      </div>
      <span class="pill">共 {{ modules.length }} 个模块</span>
    </div>

    <div class="card l1-principle">
      <b>这一层的原则</b>
      <p>
        目标是掌握进入科研训练的基础动作，不是产出论文。每个模块都小、可完成、有实物验收；
        AI 导师从第0层「水问反问」切换为「助教模式」——可以给步骤提示、检查错误，但不能代做、代写、代生成。
      </p>
    </div>

    <div class="l1-grid">
      <ModuleCard
        v-for="m in modules"
        :key="m.id"
        :id="m.id"
        :name="m.name"
        :code="m.code"
        :type="m.type"
        :hours="m.hours"
        :acceptance="m.acceptance"
        :tag="m.tag"
      />
    </div>
  </div>
</template>

<style scoped>
.l1-principle { padding: 16px 22px; margin-bottom: 14px; }
.l1-principle b { font-size: 13px; color: #0d5e68; }
.l1-principle p { margin: 6px 0 0; font-size: 12px; line-height: 1.9; color: #4a5f68; }
.l1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
</style>
