<script setup>
import { ref } from "vue";
import { PlayCircle, ArrowSquareOut, X } from "@/icons";

/* 视频列表：分「必看 / 需要时再看」，每条写 note：看这个解决什么问题
   点击「播放」在页面内展开 B 站内嵌播放器（电脑/手机浏览器直接看，无需跳转、无需装 App）
   需要弹幕/倍速等完整功能时再点「B站打开」新标签跳转 */

defineProps({
  must: { type: Array, default: () => [] },
  optional: { type: Array, default: () => [] },
});

const playing = ref(null); // 当前展开播放的 { url, title } 或 null

const embedUrl = (url) => {
  const m = String(url).match(/\/video\/(BV[0-9A-Za-z]+)/);
  return m ? `https://player.bilibili.com/player.html?bvid=${m[1]}&autoplay=1` : url;
};
</script>

<template>
  <div class="video-cols">
    <div>
      <h4>必看（建议按顺序观看）</h4>
      <div v-for="v in must" :key="v.title" class="video-row">
        <button class="video-link" @click="playing = v">
          <span class="thumb"><PlayCircle :size="18" weight="fill" /></span>
          <span class="video-copy">
            <b>{{ v.title }}</b>
            <span>{{ v.time }} · 看这个解决：{{ v.note }}</span>
          </span>
        </button>
        <a class="video-out" :href="v.url" target="_blank" rel="noopener">B站打开 <ArrowSquareOut :size="11" /></a>
      </div>
      <p v-if="!must.length" class="video-empty">视频正在补充中</p>
    </div>
    <div>
      <h4>需要时再看（按需学习）</h4>
      <div v-for="v in optional" :key="v.title" class="video-row">
        <button class="video-link" @click="playing = v">
          <span class="thumb"><PlayCircle :size="18" weight="fill" /></span>
          <span class="video-copy">
            <b>{{ v.title }}</b>
            <span>{{ v.time }} · 看这个解决：{{ v.note }}</span>
          </span>
        </button>
        <a class="video-out" :href="v.url" target="_blank" rel="noopener">B站打开 <ArrowSquareOut :size="11" /></a>
      </div>
      <p v-if="!optional.length" class="video-empty">视频正在补充中</p>
    </div>

    <!-- 页面内播放器（点任意视频展开，无需跳转 B 站） -->
    <div v-if="playing" class="video-player">
      <div class="player-head">
        <b>{{ playing.title }}</b>
        <button aria-label="关闭播放器" @click="playing = null"><X :size="15" /></button>
      </div>
      <iframe
        :src="embedUrl(playing.url)"
        scrolling="no"
        frameborder="no"
        allowfullscreen
        allow="autoplay; fullscreen"
        title="视频播放"
      ></iframe>
      <p class="player-note">如页面内播放受限（浏览器拦截第三方播放器），请点「B站打开」在新标签观看。</p>
    </div>
  </div>
</template>

<style scoped>
.video-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.video-cols h4 { margin: 8px 0; padding: 7px; border-radius: 6px; background: #eef8f9; color: #14737e; font-size: 12px; }
.video-row { padding: 6px 0; border-bottom: 1px solid #edf2f4; display: flex; align-items: center; gap: 6px; }
.video-link {
  flex: 1; min-width: 0;
  display: flex; gap: 8px; text-align: left;
  text-decoration: none; color: inherit;
  border: 0; background: transparent;
  border-radius: 8px; padding: 4px;
  cursor: pointer;
  transition: background 0.25s;
}
.video-link:hover { background: #f2fafb; }
.video-link:hover b { color: #0d7d88; }
.thumb {
  width: 58px; height: 36px; border-radius: 5px;
  background: linear-gradient(135deg, #3a697b, #a5d4dd);
  display: grid; place-items: center; color: white;
  flex: 0 0 auto;
}
.video-copy { min-width: 0; display: block; }
.video-row b, .video-row span { display: block; font-size: 11px; }
.video-row b { line-height: 1.5; transition: color 0.25s; }
.video-row span { color: #8799a0; margin-top: 3px; }
.video-out {
  flex: 0 0 auto;
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10px; color: #16848a; text-decoration: none;
  border: 1px solid #d3e9ec; border-radius: 999px;
  padding: 4px 9px;
  transition: background 0.25s, color 0.25s;
}
.video-out:hover { background: #16848a; color: #fff; }
.video-empty { font-size: 11px; color: #8a9ba2; }
.video-player {
  grid-column: 1 / -1;
  margin-top: 8px;
  border: 1px solid #dce7ea;
  border-radius: 10px;
  overflow: hidden;
  background: white;
}
.player-head { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #eef8f9; }
.player-head b { font-size: 12px; color: #14737e; }
.player-head button { border: 0; background: transparent; color: #6f8791; cursor: pointer; display: grid; place-items: center; }
.video-player iframe { width: 100%; height: 420px; display: block; border: 0; }
.player-note { margin: 0; padding: 7px 12px; font-size: 10px; color: #82969e; background: #f8fbfc; }
@media (max-width: 900px) {
  .video-cols { grid-template-columns: 1fr; }
  .video-player iframe { height: 50vw; min-height: 220px; }
}
</style>
