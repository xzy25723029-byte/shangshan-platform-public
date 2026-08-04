<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../api";
import SectionTitle from "../../components/common/SectionTitle.vue";
import { CalendarDots, ChalkboardTeacher, ShieldCheck, UsersThree } from "@/icons";

/* 导师端 · 本周状态：批阅/札记/授权概览 + 一周安排 */

const status = ref(null);

onMounted(async () => {
  status.value = await mockApi.getMentorWeekStatus();
});
</script>

<template>
  <div v-if="status" class="week-page">
    <div class="page-banner">
      <div>
        <h1>本周状态</h1>
        <p>点将台 · 这周需要你看的、你授权的、你安排的事</p>
      </div>
    </div>

    <div class="week-stats">
      <div class="card week-stat">
        <ChalkboardTeacher :size="26" weight="duotone" />
        <div><span>待批阅</span><b>{{ status.pendingReviews }}</b><small>批阅工作台</small></div>
      </div>
      <div class="card week-stat">
        <CalendarDots :size="26" weight="duotone" />
        <div><span>思想札记待批</span><b>{{ status.newThoughtNotes }}</b><small>只看诚实，不看文采</small></div>
      </div>
      <div class="card week-stat">
        <ShieldCheck :size="26" weight="duotone" />
        <div><span>技能包授权</span><b>{{ status.skillPackGrants }}</b><small>初稿完成方可授予</small></div>
      </div>
      <div class="card week-stat">
        <UsersThree :size="26" weight="duotone" />
        <div><span>活跃学生</span><b>{{ status.studentsActive }}</b><small>本周有提交记录</small></div>
      </div>
    </div>

    <div class="week-layout">
      <div class="card week-schedule">
        <SectionTitle title="一周安排" note="只提醒，不催促" />
        <div v-for="d in status.weekSummary" :key="d.day" class="week-day">
          <b>{{ d.day }}</b>
          <div>
            <span v-for="item in d.items" :key="item">{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="week-side">
        <div class="card week-shortcut">
          <SectionTitle title="快捷入口" />
          <router-link class="btn ghost" to="/mentor/review">批阅工作台</router-link>
          <router-link class="btn ghost" to="/mentor/cognitive">认知侧写查看</router-link>
          <router-link class="btn ghost" to="/mentor/skill-grant">技能包授权</router-link>
        </div>
        <div class="card week-rule">
          <SectionTitle title="点将台的原则" />
          <ul>
            <li>预警只提醒，不自动处置</li>
            <li>反馈只用「通过 / 请再想想」</li>
            <li>认知侧写不得作为筛选依据</li>
            <li>技能包只在初稿完成后授予</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 14px; }
.week-stat { padding: 16px; display: flex; align-items: center; gap: 14px; color: #168b96; }
.week-stat span, .week-stat b, .week-stat small { display: block; }
.week-stat span { font-size: 11px; color: #5e747e; }
.week-stat b { font-size: 28px; color: #0c5965; margin: 3px 0; }
.week-stat small { font-size: 10px; color: #6aa8ae; }
.week-layout { display: grid; grid-template-columns: 1fr 300px; gap: 14px; }
.week-schedule { padding: 18px 22px; }
.week-day { display: grid; grid-template-columns: 52px 1fr; gap: 10px; padding: 9px 0; border-bottom: 1px solid #e7eef0; }
.week-day:last-child { border-bottom: 0; }
.week-day b { font-size: 12px; color: #0d5e68; }
.week-day span { display: inline-block; font-size: 11px; color: #4a5f68; margin: 0 10px 4px 0; }
.week-day span::before { content: "·"; margin-right: 6px; color: #1a929b; }
.week-side { display: grid; gap: 14px; align-content: start; }
.week-shortcut, .week-rule { padding: 16px; }
.week-shortcut .btn { width: 100%; margin-top: 8px; text-decoration: none; }
.week-rule ul { margin: 10px 0 0; padding-left: 16px; font-size: 11px; line-height: 2.3; color: #4a5f68; }
</style>
