<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { mockApi } from "../../api";
import { BookOpen, ChartLine, Flask, Atom, ShieldCheck, Target, Gear, Sparkle, Notebook, FileText, Code, Cpu } from "@/icons";

/* 学习地图：以水为脉的水流路径
   不用阶梯、关卡、锁头；第1层模块节点 + 第2层群节点 + 第3层方向节点 */

const layer1 = ref([]);
const layer2 = ref([]);
const layer3 = ref([]);
const router = useRouter();

onMounted(async () => {
  [layer1.value, layer2.value, layer3.value] = await Promise.all([
    mockApi.getModules(),
    mockApi.getLayer2Groups(),
    mockApi.getLayer3Directions(),
  ]);
});

const nodeIcons = [BookOpen, ChartLine, Flask, Atom, ShieldCheck, Target];
const dirIcons = { FileText, ShieldCheck, Code, Cpu };

/* 第2层节点：群字母 + 短名 */
const layer2Nodes = computed(() =>
  layer2.value.map((g) => ({
    key: g.key,
    name: { A: "材料表征", B: "电化学", C: "水质", D: "机理计算", E: "过程模拟", F: "环境经济" }[g.key] || g.name,
    count: g.modules.length,
  })),
);

const moduleTotal = computed(() => layer1.value.length + layer2.value.reduce((n, g) => n + g.modules.length, 0));
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
      <span><Notebook :size="16" />{{ moduleTotal }} 个模块已开启</span>
      <span><ChartLine />3 条主线：练动作 → 学专业 → 做真的</span>
      <span><Sparkle />按需选路，不是一条道走到黑</span>
    </div>

    <div class="map-canvas" style="background-image: url(/assets/learning-river-map.png)">
      <div class="layer layer-1">
        <h3>第1层　基础底座</h3>
        <p>新兵连 · 夯实科研基本功（{{ layer1.length }} 个模块）</p>
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

      <button
        v-for="(g, i) in layer2Nodes"
        :key="g.key"
        class="map-node l2-node"
        :class="`l2-node-${i + 1}`"
        @click="router.push('/student/layer2')"
      >
        <span>{{ g.key }}</span>
        {{ g.name }}
      </button>

      <button
        v-for="(d, i) in layer3"
        :key="d.id"
        class="map-node l3-node"
        :class="`l3-node-${i + 1}`"
        @click="router.push(`/student/layer3/${d.id}`)"
      >
        <span><component :is="dirIcons[d.icon] || FileText" weight="duotone" /></span>
        {{ d.name }}
      </button>
    </div>

    <div class="card map-advice">
      <Sparkle :size="20" />
      <strong>学习建议</strong>
      <span>第1层从「实验室安全」与「AI 交互力」开始；第2层从材料表征与电化学入手，边做边问「结果可不可信」；第3层择一方向，做出真实交付物。</span>
      <router-link class="btn ghost" to="/student/layer1">进入第1层</router-link>
    </div>
  </div>
</template>

<style scoped>
.map-title { display: flex; justify-content: space-between; align-items: flex-start; }
.map-title h1 { font-family: var(--font-kai); color: var(--ink); margin: 0; font-size: 37px; letter-spacing: 2px; }
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
  cursor: pointer;
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
/* 第2层：群节点（沿水流路径，进入第2层页） */
.l2-node span {
  width: 46px; height: 46px;
  border: 3px solid #8fc7cf;
  background: rgba(244, 252, 250, 0.95);
  font-size: 15px; font-weight: 800; color: #12606c;
}
.l2-node { font-size: 11px; gap: 4px; }
.l2-node-1 { left: 20%; top: 38%; }
.l2-node-2 { left: 34%; top: 62%; }
.l2-node-3 { left: 47%; top: 30%; }
.l2-node-4 { left: 58%; top: 55%; }
.l2-node-5 { left: 70%; top: 24%; }
.l2-node-6 { left: 84%; top: 48%; }
/* 第3层：方向节点（进入对应方向） */
.l3-node span {
  width: 52px; height: 52px;
  border: 3px solid #f0b95c;
  background: rgba(255, 252, 243, 0.95);
}
.l3-node { font-size: 11px; gap: 4px; }
.l3-node-1 { left: 78%; top: 12%; }
.l3-node-2 { left: 90%; top: 30%; }
.l3-node-3 { left: 75%; top: 62%; }
.l3-node-4 { left: 89%; top: 80%; }
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
