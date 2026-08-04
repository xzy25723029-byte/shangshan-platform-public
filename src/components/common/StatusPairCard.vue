<script setup>
import { Check, CircleDashed } from "@/icons";

/* 平权状态卡：成功与「请再想想 / 继续打磨」同尺寸、同字号、同视觉权重
   props.items: [{ title, body, kind: 'ok' | 'warm' }] */
defineProps({
  items: { type: Array, required: true },
  okLabel: { type: String, default: "顺利的部分" },
  warmLabel: { type: String, default: "请再想想的部分" },
});
</script>

<template>
  <div class="state-pair">
    <div v-for="(item, i) in items" :key="i" class="state-cell" :class="item.kind === 'ok' ? 'ok' : 'warm'">
      <h4><component :is="item.kind === 'ok' ? Check : CircleDashed" :size="15" weight="bold" />{{ item.kind === 'ok' ? okLabel : warmLabel }}</h4>
      <p>{{ item.body }}</p>
    </div>
  </div>
</template>

<style scoped>
.state-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.state-cell { padding: 12px; border-radius: 8px; background: #f7fafb; border: 1px solid #e2ecef; }
.state-cell.ok { background: var(--state-ok-bg); border-color: #bfe3e1; }
.state-cell.warm { background: var(--state-warm-bg); border-color: #e7d5bc; }
.state-cell h4 { display: flex; align-items: center; gap: 5px; margin: 0 0 8px; font-size: 13px; color: #155c68; }
.state-cell.warm h4 { color: #7c5a30; }
.state-cell p { margin: 0; font-size: 11px; line-height: 1.7; color: #5e747e; }
</style>
