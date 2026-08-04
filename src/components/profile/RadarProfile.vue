<script setup>
import { computed } from "vue";

/* 六轴认知侧写雷达图（自绘 SVG，不引入重型图表库）
   props.scores: { curiosity, rigor, critique, hands, express, persist }
   props.baseline: 可选，入学基线（自己 vs 自己，只与自己比较） */
const props = defineProps({
  scores: { type: Object, required: true },
  baseline: { type: Object, default: null },
  axes: { type: Array, required: true }, // [{ key, label }]
  size: { type: Number, default: 300 },
});

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const R = computed(() => props.size / 2 - 38);

function point(angle, ratio) {
  const r = R.value * Math.max(0.02, Math.min(1, ratio));
  return [cx.value + r * Math.cos(angle), cy.value + r * Math.sin(angle)];
}

function axisAngle(i) {
  return -Math.PI / 2 + (2 * Math.PI * i) / props.axes.length;
}

const polygon = computed(() =>
  props.axes
    .map((a, i) => point(axisAngle(i), (props.scores[a.key] || 0) / 100))
    .map((p) => p.join(","))
    .join(" "),
);

const baselinePolygon = computed(() => {
  if (!props.baseline) return "";
  return props.axes
    .map((a, i) => point(axisAngle(i), (props.baseline[a.key] || 0) / 100))
    .map((p) => p.join(","))
    .join(" ");
});

const gridLevels = [0.25, 0.5, 0.75, 1];
const labels = computed(() =>
  props.axes.map((a, i) => {
    const [x, y] = point(axisAngle(i), 1.18);
    return { ...a, x, y };
  }),
);
</script>

<template>
  <div class="radar-wrap">
    <svg :width="size" :height="size" viewBox="0 0 300 300" role="img" aria-label="六轴认知倾向图">
      <!-- 网格 -->
      <polygon
        v-for="lv in gridLevels"
        :key="lv"
        :points="axes.map((a, i) => point(axisAngle(i), lv).join(',')).join(' ')"
        fill="none"
        stroke="#dbe9ed"
        stroke-width="1"
      />
      <!-- 轴线 -->
      <line
        v-for="(a, i) in axes"
        :key="a.key"
        :x1="cx" :y1="cy"
        :x2="point(axisAngle(i), 1)[0]" :y2="point(axisAngle(i), 1)[1]"
        stroke="#dbe9ed"
        stroke-width="1"
      />
      <!-- 入学基线（虚线，仅自己 vs 自己） -->
      <polygon
        v-if="baselinePolygon"
        :points="baselinePolygon"
        fill="rgba(160, 190, 197, 0.18)"
        stroke="#9db8be"
        stroke-width="1.5"
        stroke-dasharray="5 4"
      />
      <!-- 当前倾向 -->
      <polygon :points="polygon" fill="rgba(30, 159, 174, 0.22)" stroke="#1e9fae" stroke-width="2" />
      <circle
        v-for="(a, i) in axes"
        :key="'d' + i"
        :cx="point(axisAngle(i), (scores[a.key] || 0) / 100)[0]"
        :cy="point(axisAngle(i), (scores[a.key] || 0) / 100)[1]"
        r="3"
        fill="#1e9fae"
      />
      <!-- 轴标签 -->
      <text
        v-for="lb in labels"
        :key="lb.key"
        :x="lb.x" :y="lb.y"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="11"
        fill="#44616b"
      >{{ lb.label }}</text>
    </svg>
    <div v-if="baseline" class="radar-legend">
      <span class="lg now">现在的我</span>
      <span class="lg base">入学时的我</span>
      <p>倾向不是评分：它只用于「自己 vs 自己」，不与他人比较。</p>
    </div>
  </div>
</template>

<style scoped>
.radar-wrap { display: grid; justify-items: center; gap: 8px; }
.radar-legend { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
.radar-legend .lg { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: #5e747e; }
.radar-legend .lg::before { content: ""; width: 14px; height: 3px; border-radius: 2px; }
.radar-legend .lg.now::before { background: #1e9fae; }
.radar-legend .lg.base::before { background: #9db8be; }
.radar-legend p { width: 100%; text-align: center; margin: 2px 0 0; font-size: 10px; color: #8a9ba2; }
</style>
