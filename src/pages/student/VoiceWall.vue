<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../api";
import { voiceTopics, voiceScenes } from "../../data/community";
import SectionTitle from "../../components/common/SectionTitle.vue";
import { MagnifyingGlass, Quotes, Clock, CaretRight } from "@/icons";

/* 原话墙：一句原话一张卡；标注场景，不暴露敏感单位/个人
   不把原话加工成「正确问题」，保留真实语气 */

const voices = ref([]);
const query = ref("");
const scene = ref("全部场景");

onMounted(async () => {
  voices.value = await mockApi.getVoices();
});

const filtered = () =>
  voices.value.filter(
    (v) =>
      (scene.value === "全部场景" || v.scene === scene.value) &&
      (v.text + v.tag).includes(query.value.trim()),
  );
</script>

<template>
  <div class="voice-page">
    <div class="page-banner">
      <div>
        <h1>产业调研 · 原话墙 <span class="pill">真需求库</span></h1>
        <p>来自实地走访、深度访谈与一线观察的真实原话，沉淀行业一线的真实需求与痛点</p>
      </div>
    </div>

    <div class="card filters">
      <label>
        <MagnifyingGlass :size="16" />
        <input v-model="query" placeholder="搜索关键词、人物、场景或内容" />
      </label>
      <select v-model="scene">
        <option v-for="s in voiceScenes" :key="s">{{ s }}</option>
      </select>
      <span class="pill filter-note">不加工成「正确问题」，保留真实语气</span>
    </div>

    <div class="voice-grid">
      <article v-for="(v, i) in filtered()" :key="i" class="card voice-card">
        <Quotes :size="26" weight="fill" />
        <p>{{ v.text }}</p>
        <span class="pill">{{ v.tag }}</span>
        <footer>
          <Clock :size="13" />调研时间：{{ v.date }}
          <button>关联课题 <CaretRight :size="13" /></button>
        </footer>
      </article>
    </div>

    <div class="voice-bottom">
      <div class="card">
        <SectionTitle title="关联高频话题" />
        <div class="topic-cloud">
          <span v-for="t in voiceTopics" :key="t">{{ t }}</span>
        </div>
      </div>
      <div class="card">
        <SectionTitle title="检索建议" />
        <p>试试「水处理 稳定性」</p>
        <p>试试「碳核算 供应链」</p>
      </div>
      <div class="card">
        <SectionTitle title="如何使用原话墙" />
        <p>从真实原话出发，发现问题本质，寻找可研究、可落地的课题方向。</p>
        <router-link class="btn ghost" to="/student/strategy-research">战略方法论</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters { padding: 14px; margin-bottom: 14px; display: grid; grid-template-columns: 2fr 1fr auto; gap: 12px; align-items: center; }
.filters label { display: flex; align-items: center; gap: 7px; border: 1px solid #dce7ea; border-radius: 8px; padding: 0 11px; background: white; height: 38px; }
.filters input { border: 0; outline: 0; background: transparent; flex: 1; font-size: 12px; }
.filters select { border: 1px solid #dce7ea; border-radius: 8px; background: white; padding: 0 10px; height: 38px; }
.filter-note { justify-self: end; font-weight: 400; }
.voice-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.voice-card { padding: 12px; min-height: 112px; }
.voice-card > svg { color: #1b93a0; }
.voice-card p {
  margin: 0 0 10px;
  line-height: 1.6;
  font-size: 12px;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #3d5560;
}
.voice-card footer { margin-top: 6px; padding-top: 6px; border-top: 1px solid #e4edef; display: flex; align-items: center; gap: 5px; font-size: 10px; color: #78909a; }
.voice-card footer button { margin-left: auto; border: 0; background: transparent; color: #14727d; display: flex; align-items: center; }
.voice-bottom { display: grid; grid-template-columns: 2fr 0.8fr 1fr; gap: 10px; margin-top: 12px; }
.voice-bottom > .card { padding: 13px; }
.topic-cloud { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 8px; }
.topic-cloud span { padding: 4px 9px; background: #eef7f8; border-radius: 16px; color: #267985; font-size: 11px; }
.voice-bottom p { font-size: 11px; color: #647e88; }
</style>
