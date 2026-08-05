<script setup>

import SectionTitle from "../../../components/common/SectionTitle.vue";
import { hasAnyKey } from "../../../utils/aiMentor";

/* AI 导师 · 水问（初心堂专属页）
   第0层 AI 只使用苏格拉底反问模式：
   只反问、不下结论、不替学生写、不判断对错、不影响评价或准入 */

const hasKey = hasAnyKey();

const rules = [
  "只反问，不下结论",
  "不替学生写",
  "不判断对错",
  "不影响评价或准入",
  "学生 API Key 只存本地浏览器，不上传服务器",
  "未配置 Key 时，初心堂其余功能照常可用",
];

const examples = [
  { q: "“我该选哪个方向？”", a: "水问会问：“这个方向的问题，是你亲眼看到的，还是听来的？”" },
  { q: "“帮我写个调研提纲”", a: "水问会问：“你先告诉我，你准备去哪里、和谁聊？提纲应该从你的现场长出来。”" },
  { q: "“我这样做对吗？”", a: "水问会问：“如果你换一个系统边界，你的判断还成立吗？”" },
];
</script>

<template>
  <div class="am-page">
    <div class="page-banner">
      <div>
        <h1>AI 导师 · 水问</h1>
        <p>初心堂只反问，不给答案——苏格拉底式对话伙伴</p>
      </div>
      <img class="am-banner-img" src="/assets/water-drop.png" alt="水滴" />
    </div>

    <div class="am-grid">
      <div class="card am-rules">
        <SectionTitle title="水问在初心堂的规矩" />
        <ul>
          <li v-for="r in rules" :key="r">{{ r }}</li>
        </ul>
        <p class="am-key-note">
          {{ hasKey ? "已配置模型（Key 仅保存在本机浏览器）。" : "尚未配置模型：当前可体验本地反问引导，也可前往设置添加模型（推荐硅基流动）。" }}
        </p>
        <router-link class="btn ghost" to="/student/ai-settings">AI 导师设置</router-link>
      </div>

      <div class="card am-examples">
        <SectionTitle title="它怎么跟你对话" />
        <div v-for="(e, i) in examples" :key="i" class="am-example">
          <p class="am-q">{{ e.q }}</p>
          <p class="am-a">{{ e.a }}</p>
        </div>
      </div>
    </div>

    <div class="card am-call">
      <SectionTitle title="现在就可以找它聊聊" />
      <p>点右下角的水滴，或在这里继续阅读。水问不会给你答案，但会帮你把问题问得更清楚。</p>
    </div>
  </div>
</template>

<style scoped>
.am-banner-img { width: 64px; height: 64px; object-fit: contain; }
.am-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.am-rules, .am-examples { padding: 18px 22px; }
.am-rules ul { margin: 10px 0; padding-left: 18px; font-size: 12px; line-height: 2.3; color: #4a5f68; }
.am-key-note { font-size: 11px; color: #8a9ba2; }
.am-examples { display: grid; gap: 0; }
.am-example { padding: 10px 0; border-bottom: 1px solid #e7eef0; }
.am-example:last-child { border-bottom: 0; }
.am-q { margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #14727d; }
.am-a { margin: 0; font-size: 12px; line-height: 1.8; color: #4a5f68; }
.am-call { margin-top: 14px; padding: 18px 22px; }
.am-call p { margin: 8px 0 0; font-size: 12px; color: #5e747e; }
</style>
