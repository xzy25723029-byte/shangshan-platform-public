<script setup>
import SectionTitle from "../../../components/common/SectionTitle.vue";
import { Quotes, ArrowRight } from "@/icons";

/* 战略方法论与产业调研
   文献是二手信息，现场是真需求；衔接原话墙与调研记录字段 */
const fieldSchema = [
  { key: "去了哪里", note: "调研对象与场景，具体到可以核查" },
  { key: "和谁聊的", note: "对方的岗位与角色，不暴露敏感个人信息" },
  { key: "对方原话", note: "记录原话，不加工成「正确问题」，保留真实语气" },
  { key: "我原本以为的", note: "去之前我带着什么预设" },
  { key: "我听到之后改变的", note: "现场哪句话让我变了看法" },
  { key: "文献里没提到的问题", note: "现场独有的信息缺口，这就是机会" },
  { key: "是否关联大创/毕设/第3层方向", note: "让调研真正长到课题上" },
];
</script>

<template>
  <div class="sr-page">
    <div class="page-banner">
      <div>
        <h1>战略方法论与产业调研</h1>
        <p>文献是二手信息，现场是真需求——「没有调查，没有发言权」的平台化执行</p>
      </div>
    </div>

    <div class="card sr-block">
      <SectionTitle title="为什么现场优先于文献" />
      <div class="sr-compare">
        <div class="sr-doc">
          <h4>文献</h4>
          <p>二手信息。它告诉你「别人发现过什么」，不告诉你「这里缺什么」。</p>
          <ul>
            <li>过滤过的、滞后的问题</li>
            <li>与本地场景可能脱节</li>
            <li>适合建知识底座，不适合直接选题</li>
          </ul>
        </div>
        <div class="sr-site">
          <h4>现场</h4>
          <p>一手信息。原话里带着真实约束：成本、天气、排班、流程。</p>
          <ul>
            <li>未被加工的痛点</li>
            <li>直接指向可研究、可落地的问题</li>
            <li>大创与毕设选题的前置调研要求</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card sr-block">
      <SectionTitle title="调研记录字段" note="去现场之前，先知道要记什么" />
      <div class="sr-fields">
        <div v-for="f in fieldSchema" :key="f.key" class="sr-field">
          <b>{{ f.key }}</b>
          <p>{{ f.note }}</p>
        </div>
      </div>
    </div>

    <div class="card sr-block sr-voice">
      <SectionTitle title="从原话墙出发" />
      <div class="sr-quote">
        <Quotes :size="26" weight="fill" />
        <p>「我们厂的废水水质波动太大了，尤其是雨季，处理系统经常『跟不上』，总排放不稳定，环保压力很大。」</p>
        <span>生产运营 · 水处理</span>
      </div>
      <p class="sr-tip">
        上面这句原话，可以生长出一个课题、一个大创、一个毕设——只要你先去现场，把「为什么波动」弄清楚。
      </p>
      <router-link class="btn" to="/student/voice">进入原话墙 <ArrowRight :size="14" /></router-link>
    </div>
  </div>
</template>

<style scoped>
.sr-block { padding: 18px 22px; margin-bottom: 14px; }
.sr-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 12px; }
.sr-doc, .sr-site { padding: 16px; border-radius: 10px; }
.sr-doc { background: #f7fafb; border: 1px solid #e2ecef; }
.sr-site { background: #eef7f8; border: 1px solid #d3e9ec; }
.sr-doc h4, .sr-site h4 { margin: 0 0 8px; font-size: 14px; }
.sr-doc h4 { color: #5f7781; }
.sr-site h4 { color: #0f7c87; }
.sr-doc p, .sr-site p { margin: 0 0 10px; font-size: 12px; line-height: 1.7; color: #4a5f68; }
.sr-doc ul, .sr-site ul { margin: 0; padding-left: 18px; font-size: 11px; line-height: 2; color: #5e747e; }
.sr-fields { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
.sr-field { padding: 12px 14px; border: 1px solid #e0eaec; border-radius: 8px; background: #fafdfd; }
.sr-field b { font-size: 13px; color: #0d5e68; }
.sr-field p { margin: 6px 0 0; font-size: 11px; line-height: 1.7; color: #5e747e; }
.sr-quote { display: grid; justify-items: center; gap: 8px; padding: 20px; background: #f2fafb; border-radius: 10px; color: #1b93a0; text-align: center; margin-top: 12px; }
.sr-quote p { margin: 0; font-size: 15px; line-height: 1.9; color: #245260; max-width: 640px; }
.sr-quote span { font-size: 11px; color: #16848a; background: #e2f5f4; border-radius: 999px; padding: 4px 10px; }
.sr-tip { margin: 14px 0; font-size: 12px; line-height: 1.9; color: #4a5f68; }
</style>
