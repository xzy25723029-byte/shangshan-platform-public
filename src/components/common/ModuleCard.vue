<script setup>
import { CaretRight } from "@/icons";

defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, default: "" },
  type: { type: String, default: "" },
  hours: { type: String, default: "" },
  acceptance: { type: String, default: "" },
  tag: { type: String, default: "" },
});
</script>

<template>
  <article class="module-card card">
    <div class="mc-top">
      <span v-if="code" class="mc-code">{{ code }}</span>
      <span v-if="tag" class="pill">{{ tag }}</span>
    </div>
    <h3>{{ name }}</h3>
    <p class="mc-meta"><span v-if="type">{{ type }}</span><span v-if="hours">{{ hours }}</span></p>
    <p class="mc-accept">验收物：{{ acceptance || "—" }}</p>
    <router-link class="mc-link" :to="`/student/layer1/${id}`">
      进入模块 <CaretRight :size="14" />
    </router-link>
  </article>
</template>

<style scoped>
.module-card { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.mc-top { display: flex; align-items: center; justify-content: space-between; }
.mc-code { font-size: 11px; color: #14727d; background: #e9f7f5; border-radius: 999px; padding: 3px 9px; font-weight: 700; }
.module-card h3 { margin: 0; font-size: 15px; color: #0d5e68; }
.mc-meta { margin: 0; display: flex; gap: 12px; font-size: 11px; color: #7a8d95; }
.mc-accept { margin: 0; font-size: 11px; color: #5e747e; line-height: 1.6; flex: 1; }
.mc-link { font-size: 12px; color: var(--teal); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; min-height: 32px; border: 1px solid #d3e9ec; border-radius: 999px; background: #f4fafb; align-self: flex-start; transition: background 0.3s, color 0.3s; }
.mc-link:hover { background: var(--teal); color: #fff; border-color: var(--teal); }
</style>
