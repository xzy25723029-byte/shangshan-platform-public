<script setup>
import { ref, computed } from "vue";

/* 能量流物质流 · 系统边界交互动画
   一条进水、一座反应器、一条出水：质量与能量两本账实时可算
   交互动机：把「画边界、算两本账」变成可见的流动，而不是静态图示
   温和动效（流水/波纹/淡入），尊重 prefers-reduced-motion；不打分、不判对错 */

const Q = ref(500); // 进水流量 m³/d
const C = ref(200); // 进水浓度 mg/L
const eta = ref(85); // 去除率 %

const mIn = computed(() => +((Q.value * C.value) / 1000).toFixed(1)); // kg/d
const mRemoved = computed(() => +((mIn.value * eta.value) / 100).toFixed(1)); // kg/d
const mOut = computed(() => +(mIn.value - mRemoved.value).toFixed(1)); // kg/d
const eIn = computed(() => +((Q.value * 0.4).toFixed(1))); // kWh/d 泵送+曝气
const eRec = computed(() => +((Q.value * 0.12).toFixed(1))); // kWh/d 厌氧产甲烷回收
const eNet = computed(() => +(eIn.value - eRec.value).toFixed(1)); // kWh/d

/* 流速随流量变化：流量越大，水点跑得越快 */
const inDur = computed(() => `${+(3 - (2.4 * (Q.value - 200)) / 800).toFixed(2)}s`);
const eDur = computed(() => `${+(2.6 - (2.0 * (Q.value - 200)) / 800).toFixed(2)}s`);

function reset() {
  Q.value = 500;
  C.value = 200;
  eta.value = 85;
}
</script>

<template>
  <div class="ef-sim">
    <div class="ef-canvas">
      <svg viewBox="0 0 620 290" role="img" aria-label="质量流与能量流系统示意动画">
        <defs>
          <marker id="ef-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#7fb9c0" />
          </marker>
          <marker id="ef-arrow-e" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#d9a441" />
          </marker>
        </defs>

        <!-- 能量输入线（顶部） -->
        <line x1="30" y1="46" x2="590" y2="46" stroke="#e5d9bd" stroke-width="2" stroke-dasharray="5 5" />
        <circle class="ef-dot ef-dot-e" cx="40" cy="46" r="5" fill="#d9a441" :style="{ animationDuration: eDur }" />
        <text x="30" y="30" class="ef-tag">E_in {{ eIn.toFixed(0) }} kWh/d 输入</text>

        <!-- 进水管 -->
        <rect x="20" y="128" width="150" height="26" rx="13" fill="#dceef1" stroke="#9cc9cf" />
        <circle class="ef-dot" cx="36" cy="141" r="6" fill="#2e97a2" :style="{ animationDuration: inDur }" />
        <circle class="ef-dot" cx="36" cy="141" r="6" fill="#2e97a2" :style="{ animationDuration: inDur, animationDelay: '-0.8s' }" />
        <circle class="ef-dot" cx="36" cy="141" r="6" fill="#2e97a2" :style="{ animationDuration: inDur, animationDelay: '-1.6s' }" />
        <text x="20" y="115" class="ef-tag">进水 Q_in {{ Q }} m³/d · C_in {{ C }} mg/L</text>

        <!-- 反应器 -->
        <rect x="170" y="66" width="280" height="150" rx="18" fill="#f4fafb" stroke="#8fc6cc" stroke-width="2" />
        <circle class="ef-ripple" cx="310" cy="141" r="20" fill="none" stroke="#6fc3ca" stroke-width="2" />
        <circle class="ef-ripple" cx="310" cy="141" r="20" fill="none" stroke="#6fc3ca" stroke-width="2" :style="{ animationDelay: '-1.4s' }" />
        <text x="310" y="132" text-anchor="middle" class="ef-tag ef-title">反应器</text>
        <text x="310" y="150" text-anchor="middle" class="ef-tag">边界内转化与积累</text>

        <!-- 出水管 -->
        <rect x="450" y="128" width="150" height="26" rx="13" fill="#dceef1" stroke="#9cc9cf" />
        <circle class="ef-dot ef-dot-out" cx="466" cy="141" r="6" fill="#2e97a2" :style="{ animationDuration: inDur }" />
        <circle class="ef-dot ef-dot-out" cx="466" cy="141" r="6" fill="#2e97a2" :style="{ animationDuration: inDur, animationDelay: '-0.8s' }" />
        <circle class="ef-dot ef-dot-out" cx="466" cy="141" r="6" fill="#2e97a2" :style="{ animationDuration: inDur, animationDelay: '-1.6s' }" />
        <text x="450" y="115" class="ef-tag">出水 m_out {{ mOut }} kg/d</text>

        <!-- 去除物去向：沉淀/降解（垂直向下） -->
        <line x1="310" y1="216" x2="310" y2="252" stroke="#8fb9c9" stroke-width="3" marker-end="url(#ef-arrow)" />
        <text x="324" y="243" class="ef-tag">m_removed {{ mRemoved }} kg/d 转化或分离</text>

        <!-- 能量回收线（底部虚线） -->
        <line x1="320" y1="256" x2="580" y2="256" stroke="#e5d9bd" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#ef-arrow-e)" />
        <circle class="ef-dot ef-dot-e" cx="340" cy="256" r="5" fill="#d9a441" :style="{ animationDuration: eDur, animationDelay: '-1s' }" />
        <text x="340" y="276" class="ef-tag">E_rec {{ eRec.toFixed(0) }} kWh/d 回收（如厌氧产甲烷）</text>
      </svg>
      <p class="ef-hint">流动快慢随进水流量变化；数值按下面三个条件实时重算。</p>
    </div>

    <div class="ef-panel">
      <h4>调三个条件，看两本账怎么变</h4>
      <label class="ef-slider">
        <span>进水流量 Q_in <b>{{ Q }} m³/d</b></span>
        <input v-model.number="Q" type="range" min="200" max="1000" step="50" />
      </label>
      <label class="ef-slider">
        <span>进水浓度 C_in <b>{{ C }} mg/L</b></span>
        <input v-model.number="C" type="range" min="50" max="500" step="10" />
      </label>
      <label class="ef-slider">
        <span>去除率 η <b>{{ eta }}%</b></span>
        <input v-model.number="eta" type="range" min="40" max="95" step="5" />
      </label>

      <div class="ef-numbers">
        <div class="ef-num"><b>{{ mIn.toFixed(1) }}</b><span>质量入流 m_in kg/d</span></div>
        <div class="ef-num"><b>{{ mRemoved.toFixed(1) }}</b><span>转化/分离 kg/d</span></div>
        <div class="ef-num"><b>{{ mOut.toFixed(1) }}</b><span>质量出流 m_out kg/d</span></div>
        <div class="ef-num"><b>{{ eNet.toFixed(0) }}</b><span>净耗能 E_net kWh/d</span></div>
      </div>

      <p class="ef-note">
        这不是「答案」，只是把账算给你看。m_in = m_removed + m_out，能量同理——边界画清后，任何方案都要先过这一关。
      </p>
      <button class="btn ghost" @click="reset">恢复默认条件</button>
    </div>
  </div>
</template>

<style scoped>
.ef-sim {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  align-items: stretch;
}
.ef-canvas {
  padding: 12px 8px 4px;
  border: 1px solid #e0eaec;
  border-radius: 12px;
  background: linear-gradient(180deg, #fbfefe, #f3f9fa);
}
.ef-canvas svg { width: 100%; height: auto; display: block; }
.ef-tag { font-size: 11px; fill: #4a6a75; }
.ef-title { font-weight: 700; fill: #0d5e68; }
.ef-hint { margin: 6px 4px 8px; font-size: 11px; color: #7a8d95; }

.ef-dot { animation: ef-flow 2.4s linear infinite; }
.ef-dot-out { animation-direction: reverse; animation-name: ef-flow-out; }
.ef-dot-e { animation-name: ef-flow-e; animation-duration: 2.2s; }
.ef-ripple { transform-box: fill-box; transform-origin: center; animation: ef-ripple 2.8s ease-out infinite; }

@keyframes ef-flow {
  0% { transform: translateX(-24px); opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { transform: translateX(118px); opacity: 0; }
}
@keyframes ef-flow-out {
  0% { transform: translateX(-24px); opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { transform: translateX(118px); opacity: 0; }
}
@keyframes ef-flow-e {
  0% { transform: translateX(-24px); opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { transform: translateX(540px); opacity: 0; }
}
@keyframes ef-ripple {
  0% { transform: scale(0.5); opacity: 0.55; }
  100% { transform: scale(2.1); opacity: 0; }
}

.ef-panel { padding: 16px 18px; border: 1px solid #e0eaec; border-radius: 12px; background: #fff; display: flex; flex-direction: column; gap: 12px; }
.ef-panel h4 { margin: 0; font-size: 13px; color: #0d5e68; }
.ef-slider { display: grid; gap: 6px; }
.ef-slider span { display: flex; justify-content: space-between; font-size: 12px; color: #4a5f68; }
.ef-slider b { color: #0d5e68; }
.ef-slider input[type="range"] {
  width: 100%;
  accent-color: #1a8993;
  cursor: pointer;
}
.ef-numbers { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ef-num { padding: 9px 11px; border-radius: 9px; background: #eef7f8; }
.ef-num b { display: block; font-size: 17px; color: #0d5e68; }
.ef-num span { font-size: 10px; color: #5e747e; }
.ef-note { margin: 0; font-size: 11px; line-height: 1.8; color: #5e747e; }
.ef-panel .btn { align-self: flex-start; }

@media (max-width: 900px) { .ef-sim { grid-template-columns: 1fr; } }

@media (prefers-reduced-motion: reduce) {
  .ef-dot, .ef-dot-e, .ef-ripple { animation: none; }
}
</style>
