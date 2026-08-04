<script setup>
import { PlayCircle } from "@/icons";

/* 视频列表：分「必看 / 需要时再看」，每条写 note：看这个解决什么问题 */
defineProps({
  must: { type: Array, default: () => [] },
  optional: { type: Array, default: () => [] },
});
</script>

<template>
  <div class="video-cols">
    <div>
      <h4>必看（建议按顺序观看）</h4>
      <div v-for="v in must" :key="v.title" class="video-row">
        <span class="thumb"><PlayCircle :size="18" weight="fill" /></span>
        <div class="video-copy">
          <b>{{ v.title }}</b>
          <span>{{ v.time }} · 看这个解决：{{ v.note }}</span>
        </div>
      </div>
      <p v-if="!must.length" class="video-empty">视频正在补充中</p>
    </div>
    <div>
      <h4>需要时再看（按需学习）</h4>
      <div v-for="v in optional" :key="v.title" class="video-row">
        <span class="thumb"><PlayCircle :size="18" weight="fill" /></span>
        <div class="video-copy">
          <b>{{ v.title }}</b>
          <span>{{ v.time }} · 看这个解决：{{ v.note }}</span>
        </div>
      </div>
      <p v-if="!optional.length" class="video-empty">视频正在补充中</p>
    </div>
  </div>
</template>

<style scoped>
.video-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.video-cols h4 { margin: 8px 0; padding: 7px; border-radius: 6px; background: #eef8f9; color: #14737e; font-size: 12px; }
.video-row { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid #edf2f4; }
.thumb {
  width: 58px; height: 36px; border-radius: 5px;
  background: linear-gradient(135deg, #3a697b, #a5d4dd);
  display: grid; place-items: center; color: white;
  flex: 0 0 auto;
}
.video-copy { min-width: 0; }
.video-row b, .video-row span { display: block; font-size: 11px; }
.video-row b { line-height: 1.5; }
.video-row span { color: #8799a0; margin-top: 3px; }
.video-empty { font-size: 11px; color: #8a9ba2; }
</style>
