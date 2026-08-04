<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../../api";
import { oathRules } from "../../../data/chuxintang";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import { PenNib } from "@/icons";

/* 治学军规签署：逐条确认自己的治学约定
   签署但不做仪式化奖励：无徽章、无积分、无庆祝动效 */

const signed = ref(false);
const agreed = ref(oathRules.map(() => false));
const loading = ref(false);

onMounted(async () => {
  const res = await mockApi.getOathStatus();
  signed.value = res.signed;
  if (res.signed) agreed.value = oathRules.map(() => true);
});

async function doSign() {
  if (agreed.value.some((a) => !a)) {
    ElMessage({ message: "请逐条确认每一条约定", type: "warning" });
    return;
  }
  loading.value = true;
  await mockApi.signOath();
  signed.value = true;
  loading.value = false;
  ElMessage({ message: "军规已签署。约定不是给别人看的，是给自己守的。", type: "success" });
}
</script>

<template>
  <div class="oath-page">
    <div class="page-banner">
      <div>
        <h1>治学军规签署</h1>
        <p>学术规范、数据可追溯、成果不可剽窃——逐条确认，自己给自己立约</p>
      </div>
      <span v-if="signed" class="verdict-tag ok">已签署</span>
    </div>

    <div class="card oath-card">
      <SectionTitle title="治学军规" note="签署只是开始，遵守才是约定" />

      <label v-for="(rule, i) in oathRules" :key="rule" class="oath-rule">
        <input v-model="agreed[i]" type="checkbox" :disabled="signed" />
        <span>{{ rule }}</span>
      </label>

      <div v-if="!signed" class="oath-sign">
        <PenNib :size="16" />
        <p>确认以上 {{ oathRules.length }} 条约定，签署你的治学军规。</p>
        <button class="btn" :disabled="loading" @click="doSign">签署治学军规</button>
      </div>
      <div v-else class="oath-done">
        <p>你已于今日签署治学军规。这里不做排名、不发徽章——约定只对自己生效。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.oath-card { padding: 20px 24px; }
.oath-rule {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 14px;
  margin-top: 10px;
  border: 1px solid #e0eaec;
  border-radius: 9px;
  background: #fafdfd;
  font-size: 13px;
  line-height: 1.7;
  color: #3d5560;
  cursor: pointer;
}
.oath-rule input { margin-top: 3px; accent-color: var(--teal); width: 15px; height: 15px; }
.oath-sign {
  margin-top: 18px;
  padding: 16px;
  border-radius: 10px;
  background: #eef7f8;
  border: 1px solid #d3e9ec;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #14727d;
}
.oath-sign p { flex: 1; margin: 0; font-size: 12px; }
.oath-done { margin-top: 18px; padding: 14px 16px; border-radius: 10px; background: #f7fafb; border: 1px solid #e2ecef; }
.oath-done p { margin: 0; font-size: 12px; color: #4a5f68; }
</style>
