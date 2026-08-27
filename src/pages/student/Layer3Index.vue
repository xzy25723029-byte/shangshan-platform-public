<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "../../api";
import { FileText, ShieldCheck, Code, Cpu, ArrowRight, Sparkle } from "@/icons";

/* 第3层 · 独立产出
   四个方向择一深入，允许更换，不记录更换次数；
   交付物就是大创/毕设的产出，不额外增加一套任务 */

const directions = ref([]);
const router = useRouter();

const icons = { FileText, ShieldCheck, Code, Cpu };

onMounted(async () => {
  directions.value = await api.getLayer3Directions();
});
</script>

<template>
  <div class="l3-page">
    <div class="page-banner">
      <div>
        <h1>第3层 · 独立产出</h1>
        <p>从「练」进入「做真的」——交付物就是你的大创或毕设成果</p>
      </div>
      <span class="pill">四个方向 · 择一深入</span>
    </div>

    <div class="card l3-principle">
      <b>这一层的原则</b>
      <p>
        第3层不是更高级的身份，只是任务性质变成了真实产出。四个方向择一深入，<b>允许更换，不记录更换次数</b>；
        交付物应当就是你大创或毕设的产出，不额外增加一套任务、不重复提交、不重复验收。
      </p>
    </div>

    <div class="l3-grid">
      <article v-for="d in directions" :key="d.id" class="card l3-card">
        <div class="l3-card-head">
          <span class="l3-icon"><component :is="icons[d.icon] || FileText" :size="22" weight="duotone" /></span>
          <span class="l3-dir">方向 {{ d.id }}</span>
        </div>
        <h3>{{ d.name }}</h3>
        <p class="l3-deliverable">交付物：{{ d.deliverable }}</p>
        <p class="l3-base">依托：{{ d.base }}</p>
        <p class="l3-body">{{ d.body }}</p>
        <button class="btn" @click="router.push(`/student/layer3/${d.id}`)">
          进入方向 <ArrowRight :size="14" />
        </button>
      </article>
    </div>

    <div class="card l3-optional">
      <Sparkle :size="18" />
      <div>
        <b>完整工作复现（选做）</b>
        <p>实验复现成本高、周期长，不应变成筛选机制——选做，不做不影响评价。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l3-principle { padding: 16px 22px; margin-bottom: 14px; }
.l3-principle b { font-size: 13px; color: #0d5e68; }
.l3-principle p { margin: 6px 0 0; font-size: 12px; line-height: 1.9; color: #4a5f68; }

.l3-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.l3-card { padding: 18px; display: flex; flex-direction: column; gap: 8px; }
.l3-card-head { display: flex; align-items: center; justify-content: space-between; }
.l3-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: grid; place-items: center;
  background: #e3f4f4; color: #0d7d88;
}
.l3-dir { font-size: 11px; color: #14727d; background: #e9f7f5; border-radius: 999px; padding: 3px 9px; font-weight: 700; }
.l3-card h3 { margin: 2px 0 0; font-size: 17px; color: var(--ink); }
.l3-deliverable { margin: 0; font-size: 12px; color: #12606c; font-weight: 700; }
.l3-base { margin: 0; font-size: 11px; color: #8a9ba2; }
.l3-body { margin: 0; font-size: 12px; line-height: 1.8; color: #4a5f68; flex: 1; }
.l3-card .btn { align-self: flex-start; }

.l3-optional {
  margin-top: 14px; padding: 14px 20px;
  display: flex; align-items: center; gap: 12px;
  border-style: dashed;
}
.l3-optional b { font-size: 13px; color: #0d5e68; }
.l3-optional p { margin: 3px 0 0; font-size: 11px; color: #6f8791; }
</style>
