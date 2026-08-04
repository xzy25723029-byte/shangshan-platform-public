<script setup>


/* 全站唯一里程碑时间线（大创 / 毕设 / 学习轨迹共用）
   不使用关卡、通关、等级、锁头；仅表达「已走过 / 正在走 / 尚在前方」 */
defineProps({
  items: { type: Array, required: true }, // [{ name, date, state: 'done' | 'current' | '' }]
});
</script>

<template>
  <div class="milestones">
    <div v-for="m in items" :key="m.name" :class="m.state">
      <span>{{ m.state === "done" ? "✓" : "·" }}</span>
      <b>{{ m.name }}</b>
      <small>{{ m.date }}</small>
    </div>
  </div>
</template>

<style scoped>
.milestones { display: flex; align-items: flex-start; justify-content: space-between; margin: 16px 30px 0; }
.milestones > div { width: 20%; display: grid; justify-items: center; position: relative; }
.milestones > div::after { content: ""; height: 2px; background: #c8dadd; position: absolute; top: 17px; left: 62%; width: 76%; }
.milestones > div:last-child::after { display: none; }
.milestones span {
  width: 34px; height: 34px; border-radius: 50%;
  display: grid; place-items: center;
  background: #edf3f4; color: #78949c; z-index: 1;
}
.milestones .done span, .milestones .current span { background: #e2f5f4; color: #16848a; }
.milestones .current span { box-shadow: 0 0 0 3px rgba(22, 132, 138, 0.18); }
.milestones b { font-size: 11px; margin-top: 5px; }
.milestones small { font-size: 9px; color: #899ca3; }
</style>
