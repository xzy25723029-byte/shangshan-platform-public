<script setup>
/* 能力标签：只能展示系统授予 / 导师认证 / 同伴致谢来源，不可自封 */
defineProps({
  label: { type: String, required: true },
  source: { type: String, default: "" },
});
</script>

<template>
  <span class="skill-tag" :title="source ? `来源：${source}` : '能力标签'">
    {{ label }}
    <i v-if="source">{{ source }}</i>
  </span>
</template>

<style scoped>
.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e9f7f5;
  color: #14727d;
  font-size: 11px;
  font-weight: 700;
}
.skill-tag i {
  font-style: normal;
  font-size: 9px;
  font-weight: 400;
  color: #7a8d95;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  padding: 1px 6px;
}
</style>
