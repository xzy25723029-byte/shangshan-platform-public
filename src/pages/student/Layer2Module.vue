<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { mockApi } from "../../api";
import ModuleDetailTemplate from "../../components/module/ModuleDetailTemplate.vue";

/* 第2层模块详情：统一 ModuleDetailTemplate（六段式），
   eyebrow 按模块群动态显示 */

const route = useRoute();
const mod = ref(null);

onMounted(async () => {
  mod.value = await mockApi.getLayer2Module(route.params.id);
});
</script>

<template>
  <div v-if="mod" class="module-page">
    <div class="module-head">
      <img src="/assets/module-hero.png" alt="模块示意图" />
      <div>
        <span class="eyebrow">第2层 · 专业基础　›　{{ mod.code }} {{ mod.name }}</span>
        <h1>{{ mod.name }}</h1>
        <p>{{ mod.acceptance }}</p>
        <div class="tags">
          <span>{{ mod.type }}</span>
          <span>{{ mod.hours }}</span>
          <span>{{ mod.tag }}</span>
        </div>
      </div>
      <div class="card module-state">
        <b>尚未开始学习</b>
        <p>按自己的节奏完成学习与提交，这里没有倒计时，也不催促。</p>
      </div>
    </div>

    <ModuleDetailTemplate :module="mod" />
  </div>
</template>

<style scoped>
.module-head {
  display: grid;
  grid-template-columns: 210px 1fr 300px;
  gap: 24px;
  align-items: center;
  margin-bottom: 18px;
}
.module-head > img { width: 198px; height: 144px; object-fit: cover; border-radius: 12px; }
.module-head h1 { margin: 6px 0 8px; font-size: 27px; color: #0d5e68; }
.module-head p { margin: 0 0 13px; color: #5e747e; line-height: 1.7; font-size: 13px; }
.tags { display: flex; gap: 8px; }
.eyebrow { font-size: 12px; color: #728991; }
.module-state { padding: 22px; }
.module-state b { font-size: 16px; color: #157381; }
.module-state p { color: #7a8d95; font-size: 12px; line-height: 1.7; margin: 8px 0 0; }
</style>
