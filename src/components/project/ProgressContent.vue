<script setup>
defineProps({ record: { type: Object, required: true } });
</script>

<template>
  <dl class="progress-content">
    <dt>已完成工作</dt>
    <dd>{{ record.summary }}</dd>
    <template v-if="record.challenges">
      <dt>遇到的问题</dt>
      <dd>{{ record.challenges }}</dd>
    </template>
    <dt>下一步计划</dt>
    <dd>{{ record.nextSteps }}</dd>
  </dl>
</template>

<style scoped>
.progress-content { margin: 12px 0; }
.progress-content dt { font-weight: 600; }
.progress-content dd { margin: 4px 0 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
</style>
