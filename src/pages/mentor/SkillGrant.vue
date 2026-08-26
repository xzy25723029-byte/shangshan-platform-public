<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../api";
import SectionTitle from "../../components/common/SectionTitle.vue";

/* 技能包授权（导师端）
   规则：学生未完成完整初稿前，不得使用技能包；初稿后由导师手动授予
   技能包用于检查和对照，不得用于生成 */

const packs = ref([]);
const grants = ref([]);
const students = ref([
  { name: "张雨桐", project: "微塑料迁移机制研究" },
  { name: "陈昊然", project: "溶解氧在线监测" },
  { name: "李思涵", project: "膜通量衰减规律" },
  { name: "王子墨", project: "湿地植物筛选" },
]);
const form = ref({ student: "", packId: "", note: "" });

onMounted(async () => {
  packs.value = await mockApi.getSkillPacks();
  grants.value = await mockApi.getSkillGrants();
});

async function grant() {
  if (!form.value.student || !form.value.packId) {
    ElMessage({ message: "请选择学生与技能包", type: "warning" });
    return;
  }
  await mockApi.grantSkillPack(form.value);
  grants.value = await mockApi.getSkillGrants();
  form.value = { student: "", packId: "", note: "" };
  ElMessage({ message: "已授权。技能包仅用于检查和对照，不得用于生成。", type: "success" });
}
</script>

<template>
  <div class="sg-page">
    <div class="page-banner">
      <div>
        <h1>技能包授权</h1>
        <p>技能包只能由导师手动授予——用于检查和对照，不得用于生成</p>
      </div>
    </div>

    <div class="sg-layout">
      <div class="sg-main">
        <div class="card sg-packs">
          <SectionTitle title="技能包清单" />
          <div class="sg-pack-grid">
            <article v-for="p in packs" :key="p.id" class="sg-pack">
              <h3>{{ p.name }}</h3>
              <p>{{ p.desc }}</p>
              <span class="pill">{{ p.require }}</span>
            </article>
          </div>
        </div>

        <div class="card sg-form">
          <SectionTitle title="手动授权" note="只有学生完成初稿后，才授予对应技能包" />
          <div class="sg-form-row">
            <label>学生
              <select v-model="form.student">
                <option value="">请选择学生</option>
                <option v-for="s in students" :key="s.name" :value="s.name">{{ s.name }}（{{ s.project }}）</option>
              </select>
            </label>
            <label>技能包
              <select v-model="form.packId">
                <option value="">请选择技能包</option>
                <option v-for="p in packs" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </label>
            <label>授权说明
              <input v-model="form.note" placeholder="如：初稿已完成，允许使用写作技能包进行检查" />
            </label>
          </div>
          <button class="btn" @click="grant">确认授权</button>
          <p class="sg-tip">授权记录会写入 skill_tag_sources / mentor_skill_grants，来源可追溯，防止伪造。</p>
        </div>
      </div>

      <div class="card sg-history">
        <SectionTitle title="授权记录" />
        <div v-if="grants.length" class="sg-grants">
          <div v-for="(g, i) in grants" :key="i">
            <b>{{ g.student }}</b>
            <span>{{ g.packName }}</span>
            <small>{{ g.note }}</small>
          </div>
        </div>
        <p v-else class="sg-empty">暂无授权记录</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sg-layout { display: grid; grid-template-columns: 1fr 300px; gap: 14px; }
.sg-packs, .sg-form { padding: 18px 22px; margin-bottom: 14px; }
.sg-pack-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }
.sg-pack { padding: 14px; border: 1px solid #e0eaec; border-radius: 10px; background: #fafdfd; }
.sg-pack h3 { margin: 0 0 6px; font-size: 14px; color: var(--ink); }
.sg-pack p { margin: 0 0 10px; font-size: 11px; line-height: 1.7; color: #5e747e; }
.sg-form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 12px 0; }
.sg-form-row label { display: grid; gap: 5px; font-size: 11px; font-weight: 700; color: #44616b; }
.sg-form-row select, .sg-form-row input {
  height: 38px;
  border: 1px solid #dce7ea;
  border-radius: 8px;
  background: white;
  padding: 0 10px;
  font-weight: 400;
}
.sg-tip { margin: 10px 0 0; font-size: 11px; color: #8a9ba2; }
.sg-history { padding: 16px; align-self: start; }
.sg-grants { display: grid; gap: 10px; margin-top: 10px; }
.sg-grants > div { padding: 10px; border: 1px solid #e0eaec; border-radius: 8px; display: grid; gap: 4px; }
.sg-grants b { font-size: 12px; color: #0d5e68; }
.sg-grants span { font-size: 11px; color: #14727d; }
.sg-grants small { font-size: 10px; color: #7a8d95; }
.sg-empty { font-size: 11px; color: #8a9ba2; }
</style>
