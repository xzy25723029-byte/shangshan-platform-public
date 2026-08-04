<script setup>
import { CaretRight } from "@/icons";

defineProps({
  n: { type: [Number, String], default: null },
  icon: { type: String, default: "" },
  title: { type: String, required: true },
  action: { type: String, default: "" },
  note: { type: String, default: "" },
});

const emit = defineEmits(["action-click"]);
</script>

<template>
  <div class="section-title">
    <b v-if="n">{{ n }}</b>
    <h3>{{ title }} <small v-if="note">{{ note }}</small></h3>
    <button v-if="action" @click="emit('action-click')">{{ action }} <CaretRight :size="14" /></button>
  </div>
</template>

<style scoped>
.section-title { display: flex; align-items: center; gap: 8px; min-height: 34px; color: #125664; }
.section-title b {
  width: 24px; height: 24px; border-radius: 50%;
  display: grid; place-items: center;
  background: #1a929b; color: white; font-size: 12px;
}
.section-title h3 { font-size: 16px; margin: 0; display: flex; align-items: center; gap: 6px; }
.section-title small { font-weight: 400; color: #7e929a; }
.section-title > button { margin-left: auto; border: 0; background: transparent; color: var(--teal); display: flex; align-items: center; }
</style>
