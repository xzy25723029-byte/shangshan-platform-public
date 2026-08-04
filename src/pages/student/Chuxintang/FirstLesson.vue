<script setup>
import { firstLesson } from "../../../data/chuxintang";
import SectionTitle from "../../../components/common/SectionTitle.vue";

/* 入营第一课：开场三问、热点 vs 真问题、主动劝退
   不煽动、不承诺成果 */
</script>

<template>
  <div class="fl-page">
    <div class="page-banner">
      <div>
        <h1>入营第一课</h1>
        <p>先想清楚为什么来，再决定怎么走</p>
      </div>
    </div>

    <div class="card fl-block">
      <SectionTitle title="开场三问" />
      <p class="fl-note">不用急着回答，也不用回答得漂亮。写下来的就是开始的证据。</p>
      <div class="fl-questions">
        <article v-for="(q, i) in firstLesson.threeQuestions" :key="q.q" class="fl-q">
          <b>问{{ i + 1 }}</b>
          <h3>{{ q.q }}</h3>
          <p>{{ q.hint }}</p>
        </article>
      </div>
    </div>

    <div class="card fl-block">
      <SectionTitle title="热点 vs 真问题" />
      <div class="fl-hv">
        <div v-for="(c, i) in firstLesson.hotVsReal" :key="i" class="fl-pair">
          <span class="fl-hot">{{ c.hot }}</span>
          <span class="fl-real">{{ c.real }}</span>
        </div>
      </div>
      <p class="fl-rule">热点可以借力，但选题只能从真问题出发——这就是「没有调查，没有发言权」。</p>
    </div>

    <div class="card fl-block">
      <SectionTitle title="主动劝退" note="不煽动，不承诺成果" />
      <p class="fl-note">在开始之前，先听几句逆耳的话。这里的规矩是：说在前面，比走到一半才发现要好。</p>
      <ul class="fl-honest">
        <li v-for="h in firstLesson.honestNotice" :key="h">{{ h }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fl-block { padding: 18px 22px; margin-bottom: 14px; }
.fl-note { margin: 6px 0 0; font-size: 12px; color: #7a8d95; }
.fl-questions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }
.fl-q { padding: 16px; border: 1px solid #e0eaec; border-radius: 10px; background: #fafdfd; }
.fl-q b { font-size: 11px; color: #16848a; }
.fl-q h3 { margin: 8px 0 8px; font-size: 15px; color: #0d5e68; }
.fl-q p { margin: 0; font-size: 12px; line-height: 1.7; color: #5e747e; }
.fl-hv { display: grid; gap: 10px; margin-top: 12px; }
.fl-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: center; }
.fl-hot, .fl-real { padding: 12px 14px; border-radius: 8px; font-size: 12px; line-height: 1.7; }
.fl-hot { background: #f2f0ea; border: 1px solid #e7dfcf; color: #7a6f4a; }
.fl-real { background: #eef7f8; border: 1px solid #d3e9ec; color: #245260; }
.fl-rule { margin: 12px 0 0; font-size: 12px; color: #4a5f68; }
.fl-honest { margin: 12px 0 0; padding-left: 18px; font-size: 12px; line-height: 2.2; color: #4a5f68; }
</style>
