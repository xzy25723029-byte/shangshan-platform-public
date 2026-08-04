<script setup>
import SectionTitle from "../common/SectionTitle.vue";
import VideoList from "./VideoList.vue";
import ExampleCompare from "./ExampleCompare.vue";
import Checklist from "./Checklist.vue";
import SubmissionBox from "./SubmissionBox.vue";

/* 模块统一结构（v3 §7.3）：
   1 软件/方法怎么用 → 2 结果怎么判断（本课题组说明区）→ 3 好坏对照
   → 4 自查清单 → 5 参考教材与资源 → 6 提交验收 */
defineProps({
  module: { type: Object, required: true },
});
</script>

<template>
  <div class="module-layout">
    <section class="card m-block">
      <SectionTitle :n="1" title="软件/方法怎么用" />
      <VideoList :must="module.detail.videos.must" :optional="module.detail.videos.optional" />
      <div class="resource-links">
        <span>官方文档与指南</span>
        <span>开源工具推荐</span>
      </div>
    </section>

    <section class="card m-block group-standard">
      <SectionTitle :n="2" title="结果怎么判断" />
      <div class="gs-badge">本课题组说明区 · 与教程区区分</div>
      <h4>本组判定标准</h4>
      <ul class="clean-list">
        <li v-for="s in module.detail.groupStandard" :key="s">{{ s }}</li>
        <li v-if="!module.detail.groupStandard.length" class="gs-pending">本组判定标准正在由导师补充</li>
      </ul>
      <h4>常见问题与避坑</h4>
      <ul class="clean-list warning">
        <li v-for="p in module.detail.pitfalls" :key="p">{{ p }}</li>
        <li v-if="!module.detail.pitfalls.length" class="gs-pending">常见问题正在由导师补充</li>
      </ul>
    </section>

    <section class="card m-block">
      <SectionTitle :n="3" title="好坏对照" action="查看大图" />
      <ExampleCompare
        v-if="module.detail.examples"
        :good="module.detail.examples.good"
        :bad="module.detail.examples.bad"
      />
      <ExampleCompare v-else />
    </section>

    <section class="card m-block">
      <SectionTitle :n="4" title="自查清单" note="不勾选也可以提交" />
      <Checklist :items="module.detail.checklist" />
    </section>

    <section class="card m-block">
      <SectionTitle :n="5" title="参考教材与资源" />
      <div v-for="b in module.detail.books" :key="b.title" class="book-row">
        <img :src="`/assets/${b.img || 'book-1.png'}`" alt="参考书封面" />
        <div><b>{{ b.title }}</b><p>{{ b.desc }}</p></div>
      </div>
      <div v-for="p in module.detail.papers" :key="p" class="paper-link">
        <b>经典论文</b><span>{{ p }}</span>
      </div>
      <p v-if="!module.detail.books.length && !module.detail.papers.length" class="gs-pending">参考资源正在补充中</p>
    </section>

    <section class="card m-block submit-card">
      <SectionTitle :n="6" title="提交验收" />
      <SubmissionBox :desc="module.detail.submission.desc" :accept="module.detail.submission.accept" />
    </section>
  </div>
</template>

<style scoped>
.module-layout { display: grid; grid-template-columns: 1.25fr 0.85fr 1.4fr; gap: 12px; }
.m-block { padding: 14px; min-width: 0; }
.group-standard { border-color: #bcd8dd; background: linear-gradient(160deg, #fbfefe, #f2fafb); }
.gs-badge {
  display: inline-block;
  margin: 8px 0 6px;
  padding: 3px 9px;
  border-radius: 999px;
  background: #1a8993;
  color: white;
  font-size: 10px;
  font-weight: 700;
}
.group-standard h4 { margin: 10px 0 4px; font-size: 12px; color: #0d5e68; }
.clean-list { list-style: none; margin: 5px 0 16px; padding: 0; }
.clean-list li { font-size: 11px; margin: 9px 0; padding-left: 18px; position: relative; color: #3d5560; }
.clean-list li::before { content: "✓"; position: absolute; left: 0; color: #2799a1; }
.clean-list.warning li::before { content: "○"; }
.gs-pending { font-size: 11px; color: #8a9ba2; }
.resource-links { display: flex; gap: 12px; margin-top: 10px; }
.resource-links span { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #137683; }
.book-row { display: flex; gap: 10px; margin-top: 10px; }
.book-row img { width: 54px; height: 72px; object-fit: cover; }
.book-row b { font-size: 12px; color: #3d5560; }
.book-row p { margin: 4px 0 0; font-size: 11px; color: #748a93; }
.paper-link { display: grid; margin-top: 12px; font-size: 11px; color: #3d5560; }
.paper-link span { color: #5e747e; margin-top: 3px; }
.submit-card { grid-column: 3; }
@media (max-width: 1300px) {
  .module-layout { grid-template-columns: 1fr 1fr; }
  .submit-card { grid-column: auto; }
}
</style>
