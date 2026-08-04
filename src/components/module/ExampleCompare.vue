<script setup>
/* 好坏对照：正例与反例并排，同尺寸同权重，只指出问题，不评价作者 */
defineProps({
  good: { type: Object, default: null },
  bad: { type: Object, default: null },
});
</script>

<template>
  <div class="example-compare">
    <template v-if="good && bad">
      <figure class="mini-chart">
        <figcaption>{{ good.title }}</figcaption>
        <img :src="`/assets/${good.img}`" :alt="good.title" />
        <p>{{ good.copy }}</p>
      </figure>
      <figure class="mini-chart">
        <figcaption>{{ bad.title }}</figcaption>
        <img :src="`/assets/${bad.img}`" :alt="bad.title" />
        <p>{{ bad.copy }}</p>
      </figure>
    </template>
    <p v-else class="compare-empty">正反示例正在补充中</p>
  </div>
</template>

<style scoped>
.example-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.mini-chart { margin: 0; background: #fafcfd; border: 1px solid #e3edef; border-radius: 8px; padding: 8px; }
.mini-chart figcaption { text-align: center; margin: 0 0 4px; font-size: 12px; color: #4a5f68; font-weight: 700; }
.mini-chart img { width: 100%; height: 135px; object-fit: cover; border-radius: 5px; }
.mini-chart p { margin: 6px 0 0; font-size: 11px; color: #667f89; text-align: center; }
.compare-empty { font-size: 11px; color: #8a9ba2; }
</style>
