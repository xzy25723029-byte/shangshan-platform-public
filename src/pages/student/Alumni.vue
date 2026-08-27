<script setup>
import { ref, onMounted } from "vue";
import { api } from "../../api";
import { CaretDown } from "@/icons";

/* 师兄师姐 · 传承：大一第一件做成的事 / 卡过什么 / 如何选定方向 / 现在在做什么
   不设准入门槛、不展示排名、不按论文奖项排序 */

const alumni = ref([]);
const selected = ref(0);

onMounted(async () => {
  alumni.value = await api.getAlumni();
});
</script>

<template>
  <div class="alumni-page">
    <div class="page-banner">
      <div>
        <h1>师兄师姐 · 传承</h1>
        <p>真实的成长轨迹，给你前行的力量</p>
      </div>
    </div>

    <div class="alumni-tabs">
      <button>全部</button>
      <button>水处理</button>
      <button>水环境</button>
      <button>给水排水</button>
      <button>生态修复</button>
      <button>环境监测</button>
      <button>工程设计</button>
      <button>智慧水务</button>
    </div>

    <div class="alumni-layout">
      <div class="alumni-grid">
        <button
          v-for="(x, i) in alumni"
          :key="x.name"
          class="alumni-card"
          :class="{ selected: selected === i }"
          @click="selected = i"
        >
          <div class="person">
            <img :src="`/assets/${x.avatar}`" :alt="x.name" />
            <span><b>{{ x.name }}</b><small>{{ x.grade }}</small><em>{{ x.direction }}</em></span>
          </div>
          <dl>
            <dt>大一第一件做成的事</dt>
            <dd>{{ x.firstThing }}</dd>
            <dt>卡过什么、卡了多久</dt>
            <dd>{{ x.stuck }}</dd>
            <dt>如何选定方向</dt>
            <dd>{{ x.directionHow }}</dd>
            <dt>现在在做什么</dt>
            <dd>{{ x.now }}</dd>
          </dl>
        </button>
      </div>

      <div v-if="alumni[selected]" class="card alumni-detail">
        <div class="detail-person">
          <img :src="`/assets/${alumni[selected].avatar}`" :alt="alumni[selected].name" />
          <span>
            <h2>{{ alumni[selected].name }}</h2>
            <p>{{ alumni[selected].grade }}</p>
            <em>{{ alumni[selected].direction }}</em>
          </span>
        </div>

        <h4 class="growth-title">成长轨迹</h4>
        <ul class="growth">
          <li v-for="g in alumni[selected].growth" :key="g.t">
            <b>{{ g.t }}</b>{{ g.d }}
          </li>
        </ul>

        <details v-for="(q, qi) in ['大一第一件做成的事', '卡过什么、卡了多久', '如何选定方向', '现在在做什么']" :key="q" :open="qi === 0">
          <summary>{{ q }}<CaretDown :size="14" /></summary>
          <p>{{ qi === 0 ? alumni[selected].firstThing : qi === 1 ? alumni[selected].stuck : qi === 2 ? alumni[selected].directionHow : alumni[selected].now }}</p>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alumni-tabs { display: flex; gap: 11px; margin: 0 0 12px; flex-wrap: wrap; }
.alumni-tabs button { border: 0; background: #f1f6f7; border-radius: 999px; padding: 7px 13px; font-size: 12px; color: #4a5f68; }
.alumni-tabs button:first-child { background: #e8f7f5; color: #147c85; }
.alumni-layout { display: grid; grid-template-columns: 1fr 400px; gap: 12px; }
.alumni-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; align-content: start; }
.alumni-card { text-align: left; border: 1px solid var(--line); background: white; border-radius: 12px; padding: 14px; }
.alumni-card.selected { border-color: #2ea4ad; box-shadow: 0 6px 16px rgba(26, 125, 138, 0.12); }
.person { display: flex; align-items: center; gap: 9px; }
.person img { width: 54px; height: 54px; border-radius: 50%; object-fit: cover; }
.person b, .person small, .person em { display: block; }
.person b { font-size: 14px; color: #0d5e68; }
.person small { font-size: 10px; color: #7b9199; }
.person em { font-style: normal; font-size: 9px; color: #288c95; background: #edf8f8; border-radius: 12px; padding: 3px 7px; margin-top: 4px; display: inline-block; }
.alumni-card dl { margin: 15px 0 0; }
.alumni-card dt { font-weight: 700; font-size: 10px; color: #13717d; margin: 9px 0 3px; }
.alumni-card dd { margin: 0; font-size: 10px; line-height: 1.5; color: #4a5f68; }
.alumni-detail { padding: 16px; position: sticky; top: 88px; height: max-content; }
.detail-person { display: flex; gap: 13px; }
.detail-person img { width: 75px; height: 75px; border-radius: 50%; object-fit: cover; }
.detail-person h2 { margin: 0; font-size: 18px; color: var(--ink); }
.detail-person p { margin: 4px 0; font-size: 11px; color: #7b9199; }
.detail-person em { font-style: normal; font-size: 11px; color: #238894; }
.growth-title { margin: 18px 0 4px; font-size: 13px; color: var(--ink); }
.growth { list-style: none; padding: 0; margin: 0; }
.growth li { padding: 9px 0 9px 58px; position: relative; font-size: 11px; color: #4a5f68; line-height: 1.6; }
.growth li::before { content: ""; width: 8px; height: 8px; border: 2px solid #1a929c; border-radius: 50%; position: absolute; left: 45px; top: 14px; }
.growth b { position: absolute; left: 0; color: #0d6470; }
.alumni-detail details { border: 1px solid #e1eaec; border-radius: 7px; margin-top: 7px; padding: 10px; }
.alumni-detail summary { display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; color: #3d5560; list-style: none; }
.alumni-detail details p { font-size: 10px; color: #6e838c; line-height: 1.7; margin: 8px 0 0; }
</style>
