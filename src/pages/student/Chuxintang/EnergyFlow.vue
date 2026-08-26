<script setup>
import { reactive } from "vue";
import { energyFlow } from "../../../data/chuxintang";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import EnergyFlowSim from "../../../components/module/EnergyFlowSim.vue";
import { Eye } from "@/icons";

/* 能量流物质流模型
   交互约束：先提交自己的判断，才可查看「另一种看法是」
   不出现参考答案 / 正确答案；不打分、不判对错、不记录修改次数 */

const answers = reactive(energyFlow.cases.map(() => ({ text: "", submitted: false })));
const revealed = reactive(energyFlow.cases.map(() => false));

function submitAnswer(i) {
  if (!answers[i].text.trim()) return;
  answers[i].submitted = true;
}

function reveal(i) {
  if (!answers[i].submitted) return;
  revealed[i] = true;
}
</script>

<template>
  <div class="ef-page">
    <div class="page-banner">
      <div>
        <h1>能量流物质流模型</h1>
        <p>不看口号，看账本——先把系统边界画出来，再算两本账</p>
      </div>
    </div>

    <div class="card ef-sim-block">
      <SectionTitle title="先把系统画出来" note="六步推演的第一步：画边界，再算两本账" />
      <EnergyFlowSim />
    </div>

    <div class="card ef-steps">
      <SectionTitle title="六步推演" />
      <div class="ef-step-grid">
        <article v-for="s in energyFlow.steps" :key="s.n" class="ef-step">
          <b>{{ s.n }}</b>
          <h3>{{ s.title }}</h3>
          <p>{{ s.body }}</p>
        </article>
      </div>
    </div>

    <div class="card ef-case-block">
      <SectionTitle title="先作答，再看另一种看法" note="不打分、不判对错，也不记录修改次数" />
      <div class="ef-cases">
        <article v-for="(c, i) in energyFlow.cases" :key="c.name" class="ef-case">
          <h3>{{ c.name }}</h3>
          <div class="ef-paths">
            <div><span>A</span>{{ c.a }}</div>
            <div><span>B</span>{{ c.b }}</div>
          </div>
          <template v-if="!answers[i].submitted">
            <label class="ef-answer">
              <span>你的判断：这两条路之间，你会怎么选？理由是什么？</span>
              <textarea v-model="answers[i].text" placeholder="写下你自己的判断，不用管对不对——先作答。" />
              <button class="btn" :disabled="!answers[i].text.trim()" @click="submitAnswer(i)">提交我的判断</button>
            </label>
          </template>
          <template v-else>
            <div class="ef-mine">
              <b>你写下的判断</b>
              <p>{{ answers[i].text }}</p>
            </div>
            <button v-if="!revealed[i]" class="btn ghost" @click="reveal(i)">
              <Eye :size="15" />查看「另一种看法是」
            </button>
            <div v-else class="ef-view">
              <b>另一种看法是</b>
              <p>{{ c.view }}</p>
            </div>
          </template>
        </article>
      </div>
    </div>

    <div class="card ef-q-block">
      <SectionTitle title="六个战略自问" />
      <ol class="ef-questions">
        <li v-for="q in energyFlow.sixQuestions" :key="q">{{ q }}</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.ef-sim-block, .ef-steps, .ef-case-block, .ef-q-block { padding: 18px 22px; margin-bottom: 14px; }
.ef-step-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }
.ef-step { padding: 16px; border: 1px solid #e0eaec; border-radius: 10px; background: #fafdfd; }
.ef-step b {
  width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center;
  background: #1a929b; color: white; font-size: 12px;
}
.ef-step h3 { margin: 10px 0 6px; font-size: 14px; color: var(--ink); }
.ef-step p { margin: 0; font-size: 11px; line-height: 1.8; color: #5e747e; }
.ef-cases { display: grid; gap: 14px; margin-top: 14px; }
.ef-case { padding: 16px; border: 1px solid #e0eaec; border-radius: 10px; }
.ef-case h3 { margin: 0 0 10px; font-size: 14px; color: var(--ink); }
.ef-paths { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ef-paths > div { display: flex; gap: 8px; padding: 10px 12px; background: #f7fafb; border-radius: 8px; font-size: 12px; line-height: 1.7; color: #4a5f68; }
.ef-paths span { flex: 0 0 auto; width: 20px; height: 20px; border-radius: 50%; background: #e2f5f4; color: #16848a; display: grid; place-items: center; font-size: 11px; font-weight: 700; }
.ef-answer { display: grid; gap: 8px; margin-top: 12px; }
.ef-answer span { font-size: 12px; font-weight: 700; color: #155c68; }
.ef-answer textarea {
  width: 100%; height: 84px; resize: none;
  border: 1px solid #dce8eb; border-radius: 8px; padding: 10px;
  font-size: 12px; line-height: 1.7;
}
.ef-answer .btn { justify-self: start; }
.ef-mine, .ef-view { margin-top: 12px; padding: 12px 14px; border-radius: 8px; }
.ef-mine { background: #f7fafb; border: 1px solid #e2ecef; }
.ef-view { background: #eef7f8; border: 1px solid #cfE6ea; }
.ef-mine b, .ef-view b { display: block; font-size: 11px; color: #14727d; margin-bottom: 6px; }
.ef-mine p, .ef-view p { margin: 0; font-size: 12px; line-height: 1.8; color: #245260; }
.ef-case .btn.ghost { margin-top: 12px; }
.ef-questions { margin: 12px 0 0; padding-left: 20px; font-size: 12px; line-height: 2.3; color: #4a5f68; }
</style>
