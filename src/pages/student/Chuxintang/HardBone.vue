<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../../api";
import HardBoneRecord from "../../../components/profile/HardBoneRecord.vue";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import { Plus } from "@/icons";

/* 啃硬骨头：仍在啃 / 啃下来了 / 换路子 / 放弃了 —— 四种结局完全平权
   复现失败但说清信息缺口，与复现成功同样合格 */

const records = ref([]);
const showForm = ref(false);
const outcome = ref("仍在啃");
const content = ref("");
const outcomes = ["仍在啃", "啃下来了", "换路子", "放弃了"];

async function load() {
  records.value = await mockApi.getHardBoneRecords();
}
onMounted(load);

async function add() {
  if (!content.value.trim()) {
    ElMessage({ message: "写清楚你卡在哪、做了什么尝试", type: "warning" });
    return;
  }
  await mockApi.addHardBoneRecord({ outcome: outcome.value, content: content.value.trim() });
  content.value = "";
  showForm.value = false;
  load();
}
</script>

<template>
  <div class="hb-page">
    <div class="page-banner">
      <div>
        <h1>啃硬骨头 · 记录</h1>
        <p>科研路上的攻坚时刻——四种结局，完全平权</p>
      </div>
      <button class="btn ghost" @click="showForm = !showForm"><Plus :size="15" />记录一条</button>
    </div>

    <div v-if="showForm" class="card hb-form">
      <SectionTitle title="记录一条攻坚" note="写过程，不写结论——过程本身就有价值" />
      <div class="hb-outcomes">
        <label v-for="o in outcomes" :key="o">
          <input v-model="outcome" type="radio" :value="o" />
          <span>{{ o }}</span>
        </label>
      </div>
      <textarea v-model="content" placeholder="卡在哪个环节？试过什么？现在还差什么？" />
      <div class="hb-form-actions">
        <button class="btn ghost" @click="showForm = false">取消</button>
        <button class="btn" @click="add">保存记录</button>
      </div>
      <p class="hb-form-note">「放弃了」和「啃下来了」一样值得记录——说清为什么放弃，同样是进展。</p>
    </div>

    <div class="hb-stats">
      <span v-for="o in outcomes" :key="o" class="hb-stat">
        {{ o }} · {{ records.filter((r) => r.outcome === o).length }} 条
      </span>
    </div>

    <div class="hb-grid">
      <HardBoneRecord v-for="r in records" :key="r.id" :record="r" />
    </div>
  </div>
</template>

<style scoped>
.hb-form { padding: 18px 22px; margin-bottom: 14px; }
.hb-outcomes { display: flex; gap: 12px; margin: 12px 0; flex-wrap: wrap; }
.hb-outcomes label {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 12px;
  border: 1px solid #dbe7eb;
  border-radius: 999px;
  font-size: 12px;
  color: #4a5f68;
  cursor: pointer;
}
.hb-outcomes input { accent-color: var(--teal); }
.hb-form textarea {
  width: 100%; height: 110px; resize: none;
  border: 1px solid #dce8eb; border-radius: 8px; padding: 12px;
  font-size: 12px; line-height: 1.8;
}
.hb-form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }
.hb-form-note { margin: 8px 0 0; font-size: 11px; color: #8a9ba2; }
.hb-stats { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.hb-stat {
  font-size: 11px;
  color: #5e747e;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 12px;
}
.hb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
</style>
