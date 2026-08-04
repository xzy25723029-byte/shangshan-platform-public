<script setup>
/* 啃硬骨头记录：四种结局完全平权（仍在啃 / 啃下来了 / 换路子 / 放弃了）
   同尺寸、同字号、同视觉权重，不评价、不惩罚 */
defineProps({
  record: { type: Object, required: true },
});
</script>

<template>
  <article class="hard-bone card">
    <div class="hb-head">
      <span class="hb-outcome" :class="record.outcome">{{ record.outcome }}</span>
      <small>{{ record.date }}</small>
    </div>
    <p>{{ record.content }}</p>
  </article>
</template>

<style scoped>
.hard-bone { padding: 14px; display: grid; gap: 8px; }
.hb-head { display: flex; align-items: center; justify-content: space-between; }
.hb-outcome {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #edf3f4;
  color: #5f7781;
}
/* 四种结局平权：同尺寸同字号，仅用中性色区分，不用鲜红、不用奖励色 */
.hb-outcome.仍在啃 { background: #eef4f0; color: #4a7a55; }
.hb-outcome.啃下来了 { background: var(--state-ok-bg); color: var(--state-ok); }
.hb-outcome.换路子 { background: #f2f0ea; color: #7a6f4a; }
.hb-outcome.放弃了 { background: var(--state-warm-bg); color: var(--state-warm); }
.hard-bone small { font-size: 10px; color: #8a9ba2; }
.hard-bone p { margin: 0; font-size: 12px; line-height: 1.7; color: #4a5f68; }
</style>
