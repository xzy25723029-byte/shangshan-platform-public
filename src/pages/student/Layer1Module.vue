<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../api";
import ModuleDetailTemplate from "../../components/module/ModuleDetailTemplate.vue";
import { ArrowLeft } from "@/icons";

/* 第1层模块详情：统一 ModuleDetailTemplate（科技论文绘图为完整示例，其余数据驱动） */

const route = useRoute();
const router = useRouter();
const mod = ref(null);

onMounted(async () => {
  mod.value = await api.getModule(route.params.id);
});

/* 返回上一层（学习地图/第1层列表），保留浏览器滚动记忆 */
function goBack() {
  if (window.history.length > 1) router.back();
  else router.push("/student/layer1");
}
</script>

<template>
  <div v-if="mod" class="module-page">
    <div class="module-head">
      <button class="back-btn" aria-label="返回上一级" @click="goBack"><ArrowLeft :size="16" />返回上一级</button>
      <img src="/assets/module-hero.png" alt="模块示意图" />
      <div>
        <span class="eyebrow">第1层 · 基础底座　›　模块详情</span>
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
  position: relative;
  display: grid;
  grid-template-columns: 210px 1fr 300px;
  gap: 24px;
  align-items: center;
  margin-bottom: 18px;
}
.back-btn {
  position: absolute;
  top: -14px;
  left: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #d5e6e9;
  background: rgba(255, 255, 255, 0.96);
  color: #14727d;
  font-size: 11px;
  border-radius: 999px;
  padding: 5px 12px;
  cursor: pointer;
  transition: background 0.25s, color 0.25s;
}
.back-btn:hover { background: #14727d; color: #fff; border-color: #14727d; }
.module-head > img { width: 198px; height: 144px; object-fit: cover; border-radius: 12px; }
.module-head h1 { margin: 6px 0 8px; font-size: 27px; color: var(--ink); }
.module-head p { margin: 0 0 13px; color: #5e747e; line-height: 1.7; font-size: 13px; }
.tags { display: flex; gap: 8px; }
.eyebrow { font-size: 12px; color: #728991; }
.module-state { padding: 22px; }
.module-state b { font-size: 16px; color: #157381; }
.module-state p { color: #7a8d95; font-size: 12px; line-height: 1.7; margin: 8px 0 0; }
</style>
