<script setup>
import { ref } from "vue";

/* 自查清单：可勾选，但不勾也可提交 */
const props = defineProps({
  items: { type: Array, default: () => [] },
});

const checked = ref(props.items.map(() => false));
</script>

<template>
  <div class="checklist">
    <label v-for="(x, i) in items" :key="x">
      <input v-model="checked[i]" type="checkbox" />
      <span>{{ x }}</span>
    </label>
    <p v-if="!items.length" class="checklist-empty">自查清单正在补充中</p>
  </div>
</template>

<style scoped>
.checklist label { display: inline-flex; width: 49%; gap: 7px; margin: 12px 0; font-size: 12px; color: #3d5560; }
.checklist input { accent-color: var(--teal); margin: 0; }
.checklist-empty { font-size: 11px; color: #8a9ba2; }
</style>
