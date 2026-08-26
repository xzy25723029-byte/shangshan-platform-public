<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { mockApi } from "../../api";
import SectionTitle from "../../components/common/SectionTitle.vue";
import Checklist from "../../components/module/Checklist.vue";
import SubmissionBox from "../../components/module/SubmissionBox.vue";
import { ShieldCheck } from "@/icons";

/* 第3层方向详情：交付物 / 内容 / 关键步骤 / 自查清单 / 技能包说明 / 提交验收 */

const route = useRoute();
const dir = ref(null);

onMounted(async () => {
  dir.value = await mockApi.getLayer3Direction(route.params.id);
});
</script>

<template>
  <div v-if="dir" class="d3-page">
    <div class="page-banner">
      <div>
        <h1>{{ dir.name }}</h1>
        <p>{{ dir.deliverable }}</p>
      </div>
      <span class="pill">方向 {{ dir.id }} · 依托{{ dir.base }}</span>
    </div>

    <div class="card d3-about">
      <SectionTitle title="这个方向要做什么" />
      <p>{{ dir.body }}</p>
    </div>

    <div class="d3-layout">
      <section class="card d3-block">
        <SectionTitle title="关键步骤" note="按自己的节奏走，可调整顺序" />
        <ol class="d3-steps">
          <li v-for="(s, i) in dir.steps" :key="i"><b>{{ i + 1 }}</b><span>{{ s }}</span></li>
        </ol>
      </section>

      <section class="card d3-block">
        <SectionTitle title="自查清单" note="不勾选也可以提交" />
        <Checklist :items="dir.checklist" />
      </section>

      <section class="card d3-skill">
        <ShieldCheck :size="20" />
        <div>
          <b>技能包说明</b>
          <p>{{ dir.skillPack }}</p>
          <span class="d3-skill-tip">技能包由导师手动授予，只用于检查和对照，不用于生成。</span>
        </div>
      </section>

      <section class="card d3-submit">
        <SectionTitle title="提交验收" note="不重复提交、不重复验收" />
        <SubmissionBox :desc="dir.submission.desc" :accept="dir.submission.accept" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.d3-about { padding: 16px 22px; margin-bottom: 14px; }
.d3-about p { margin: 8px 0 0; font-size: 13px; line-height: 1.9; color: #4a5f68; }

.d3-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.d3-block { padding: 14px; }
.d3-steps { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 10px; }
.d3-steps li { display: flex; gap: 10px; align-items: baseline; font-size: 12px; color: #3d5560; line-height: 1.7; }
.d3-steps b {
  flex: none; width: 22px; height: 22px; border-radius: 50%;
  display: grid; place-items: center;
  background: #e3f4f4; color: #0d7d88; font-size: 11px;
}

.d3-skill {
  padding: 14px; display: flex; gap: 12px; align-items: flex-start;
  border-color: #bcd8dd; background: linear-gradient(160deg, #fbfefe, #f2fafb);
}
.d3-skill b { font-size: 13px; color: #0d5e68; }
.d3-skill p { margin: 5px 0 0; font-size: 12px; line-height: 1.8; color: #4a5f68; }
.d3-skill-tip { display: block; margin-top: 8px; font-size: 11px; color: #8a6d3b; background: #fdf6e7; border-radius: 7px; padding: 6px 10px; }

.d3-submit { padding: 14px; }
</style>
