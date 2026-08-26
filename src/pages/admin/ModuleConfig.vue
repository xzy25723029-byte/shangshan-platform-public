<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../api";
import { layer2Groups, trustTopics } from "../../data/modules";
import SectionTitle from "../../components/common/SectionTitle.vue";

/* 内容管理 · 模块配置：第1层模块 + 第2层模块群 + 结果可不可信专题一览 */

const layer1 = ref([]);

onMounted(async () => {
  layer1.value = await mockApi.getModules();
});
</script>

<template>
  <div class="mc-page">
    <div class="admin-head">
      <h1>模块配置</h1>
      <p>第1层 11 模块、第2层 21 模块与贯穿专题的配置一览</p>
    </div>

    <div class="card mc-block">
      <SectionTitle title="第1层 · 基础底座" note="11 个模块，统一 ModuleDetailTemplate" />
      <table>
        <thead><tr><th>编号</th><th>模块</th><th>类型</th><th>验收物</th><th>状态</th></tr></thead>
        <tbody>
          <tr v-for="m in layer1" :key="m.id">
            <td>{{ m.code }}</td>
            <td><b>{{ m.name }}</b></td>
            <td>{{ m.type }}</td>
            <td>{{ m.acceptance }}</td>
            <td><span class="pill">{{ m.id === "paper-figure" ? "内容完整" : "模板就绪" }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card mc-block">
      <SectionTitle title="第2层 · 专业基础" note="21 个模块 · 六大模块群" />
      <div class="mc-groups">
        <article v-for="grp in layer2Groups" :key="grp.key" class="mc-group">
          <header>
            <b>{{ grp.key }}</b>
            <h3>{{ grp.name }}</h3>
            <span class="pill">{{ grp.status }}</span>
          </header>
          <p class="mc-q">回答：{{ grp.question }}</p>
          <ul>
            <li v-for="m in grp.modules" :key="m.id">{{ m.id }} {{ m.name }}</li>
          </ul>
        </article>
      </div>
    </div>

    <div class="card mc-block">
      <SectionTitle title="结果可不可信 · 贯穿专题" note="拟合得好 ≠ 结果对" />
      <div class="mc-trust">
        <span v-for="t in trustTopics" :key="t.title" :title="t.body">
          <b>{{ t.title }}</b><small>{{ t.body }}</small>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-head { display: flex; align-items: baseline; gap: 20px; }
.admin-head h1 { font-family: var(--font-kai); color: var(--ink); margin: 0; font-size: 37px; letter-spacing: 2px; }
.admin-head p { color: #728a93; font-size: 13px; }
.mc-block { padding: 16px 20px; margin-bottom: 14px; }
.mc-block table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
.mc-block th { background: #f3f7f8; text-align: left; padding: 8px; color: #4a5f68; }
.mc-block td { padding: 7px; border-bottom: 1px solid #e6edef; color: #3d5560; }
.mc-groups { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }
.mc-group { padding: 14px; border: 1px solid #e0eaec; border-radius: 10px; background: #fafdfd; }
.mc-group header { display: flex; align-items: center; gap: 8px; }
.mc-group header b {
  width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center;
  background: #1a929b; color: white; font-size: 11px;
}
.mc-group h3 { margin: 0; font-size: 14px; color: var(--ink); }
.mc-group header .pill { margin-left: auto; font-size: 9px; }
.mc-q { margin: 8px 0; font-size: 11px; color: #5e747e; }
.mc-group ul { margin: 0; padding-left: 16px; font-size: 11px; line-height: 2; color: #4a5f68; }
.mc-trust { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
.mc-trust span { padding: 10px 12px; background: #f7fafb; border: 1px solid #e2ecef; border-radius: 8px; display: grid; gap: 4px; }
.mc-trust b { font-size: 12px; color: #0d5e68; }
.mc-trust small { font-size: 10px; line-height: 1.6; color: #5e747e; }
</style>
