<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { mockApi } from "../../api";
import { BookOpen, ChartLine, Flask, Atom, ShieldCheck, Target, Gear, Sparkle, Notebook } from "@/icons";

/* 学习地图：以水为脉的水流路径
   不用阶梯、关卡、锁头；远方模块标「尚未开启」 */

const layer1 = ref([]);
const router = useRouter();

onMounted(async () => {
  layer1.value = await mockApi.getModules();
});

const nodeIcons = [BookOpen, ChartLine, Flask, Atom, ShieldCheck, Target];
</script>

<template>
  <div class="map-page">
    <div class="map-title">
      <div>
        <h1>学习地图</h1>
        <p>以水为脉，贯通知识、方法与实践，构建科研成长路径</p>
      </div>
      <button class="btn ghost"><Gear :size="15" />地图设置</button>
    </div>

    <div class="map-stats">
      <span><Notebook :size="16" />28 个模块</span>
      <span><ChartLine />3 条主线：练动作 → 学专业 → 做真的</span>
      <span><Sparkle />按需选路，不是一条道走到黑</span>
    </div>

    <div class="map-canvas" style="background-image: url(/assets/learning-river-map.png)">
      <div class="layer layer-1">
        <h3>第1层　基础底座</h3>
        <p>新兵连 · 夯实科研基本功（{{ layer1.length }} 个模块已开启）</p>
      </div>
      <div class="layer layer-2">
        <h3>第2层　专业基础</h3>
        <p>专业工具与专业判断 · 结果可不可信</p>
      </div>
      <div class="layer layer-3">
        <h3>第3层　独立产出</h3>
        <p>真实交付物：论文 / 专利 / 软件 / 硬件</p>
      </div>

      <button
        v-for="(m, i) in layer1.slice(0, 6)"
        :key="m.id"
        class="map-node"
        :class="`node-${i + 1}`"
        @click="router.push(`/student/layer1/${m.id}`)"
      >
        <span><component :is="nodeIcons[i % nodeIcons.length]" weight="duotone" /></span>
        {{ m.name }}
      </button>

      <span class="not-open open-a">第2层 · 尚未开启</span>
      <span class="not-open open-b">第3层 · 尚未开启</span>
    </div>

    <div class="card map-advice">
      <Sparkle :size="20" />
      <strong>学习建议</strong>
      <span>第1层从「实验室安全」与「AI 交互力」开始，逐步掌握科研基本动作；远方模块尚未开启，不着急，水会流到那里。</span>
      <router-link class="btn ghost" to="/student/layer1">进入第1层</router-link>
    </div>
  </div>
</template>

<style scoped>
.map-title { display: flex; justify-content: space-between; align-items: flex-start; }
.map-title h1 { font-family: var(--font-kai); color: #0f5a65; margin: 0; font-size: 37px; letter-spacing: 2px; }
.map-title p { margin: 5px 0; color: #5c7882; }
.map-stats { display: flex; gap: 32px; margin: 16px 0; color: #183f4d; flex-wrap: wrap; }
.map-stats span { display: flex; align-items: center; gap: 7px; font-weight: 700; font-size: 13px; }
.map-canvas {
  height: 590px;
  border-radius: 14px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #dcebee;
  box-shadow: var(--shadow);
}
.layer { position: absolute; color: #153f4b; }
.layer h3 { margin: 0 0 3px; font-size: 16px; }
.layer p { margin: 0; font-size: 12px; }
.layer-1 { left: 5%; top: 28%; }
.layer-2 { left: 39%; top: 18%; }
.layer-3 { left: 68%; top: 7%; }
.map-node {
  position: absolute;
  border: 0;
  background: transparent;
  display: grid;
  justify-items: center;
  gap: 6px;
  font-weight: 700;
  color: #145d68;
  font-size: 12px;
}
.map-node span {
  width: 58px; height: 58px; border-radius: 50%;
  display: grid; place-items: center;
  background: rgba(255, 255, 255, 0.92);
  border: 3px solid #59c5d1;
  box-shadow: 0 7px 20px rgba(21, 137, 150, 0.22);
}
.map-node svg { width: 28px; height: 28px; }
.node-1 { left: 10%; top: 55%; }
.node-2 { left: 30%; top: 70%; }
.node-3 { left: 43%; top: 42%; }
.node-4 { left: 54%; top: 66%; }
.node-5 { left: 67%; top: 43%; }
.node-6 { left: 80%; top: 29%; }
.not-open {
  position: absolute;
  padding: 6px 12px;
  border-radius: 7px;
  background: #8ca2a7;
  color: white;
  font-size: 11px;
}
.open-a { left: 24%; top: 78%; }
.open-b { right: 10%; bottom: 11%; }
.map-advice {
  margin-top: 14px;
  min-height: 62px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.map-advice span { flex: 1; color: #607985; font-size: 13px; }
/* 防止底部「进入第1层」按钮被右下角 AI 导师 Dock 遮挡（原型同款修复） */
.map-advice { padding-right: 130px; }
</style>
