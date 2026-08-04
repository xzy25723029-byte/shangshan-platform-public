<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../api";

import SkillTag from "../../components/common/SkillTag.vue";
import { Handshake } from "@/icons";

/* 成员名录：查看成员研究方向、求带机制、技能标签展示
   禁止：成果数量排行榜、自己添加能力标签、「优秀成员」徽章
   能力标签只展示来源：系统授予 / 导师认证 / 同伴致谢 */

const members = ref([]);
const askDialog = ref(false);
const askTarget = ref(null);
const askText = ref("");

onMounted(async () => {
  members.value = await mockApi.getMembers();
});

function openAsk(m) {
  askTarget.value = m;
  askText.value = "";
  askDialog.value = true;
}

function sendAsk() {
  if (!askText.value.trim()) {
    ElMessage({ message: "先写一句你想请教什么", type: "warning" });
    return;
  }
  askDialog.value = false;
  ElMessage({ message: `求带请求已发给 ${askTarget.value.name}。带上具体问题去，才会得到具体答案。`, type: "success" });
}
</script>

<template>
  <div class="members-page">
    <div class="page-banner">
      <div>
        <h1>成员名录</h1>
        <p>看研究方向，找同路人——这里没有排行榜，只有一起走的人</p>
      </div>
    </div>

    <div class="card members-note">
      <Handshake :size="18" />
      <p>
        技能标签只来自三种来源：系统授予、导师认证、同伴致谢累积。
        这里不提供「自己添加能力标签」的入口——标签是用来被看见的，不是用来装饰的。
      </p>
    </div>

    <div class="members-grid">
      <article v-for="m in members" :key="m.name" class="card member-card">
        <header>
          <img :src="`/assets/${m.avatar}`" :alt="m.name" />
          <div>
            <h3>{{ m.name }}</h3>
            <span>{{ m.grade }} · {{ m.direction }}</span>
          </div>
        </header>
        <div class="member-tags">
          <SkillTag v-for="t in m.tags" :key="t.label" :label="t.label" :source="t.source" />
        </div>
        <button class="btn ghost member-ask" @click="openAsk(m)">求带 TA 聊聊</button>
      </article>
    </div>

    <el-dialog v-model="askDialog" :title="`求带 · ${askTarget ? askTarget.name : ''}`" width="460px">
      <p class="ask-tip">求带不是要答案，是请 TA 陪你走一段——问题越具体，收获越具体。</p>
      <textarea v-model="askText" class="ask-text" placeholder="你想请教 TA 什么？比如：你当时 XRD 分峰是怎么入门的？" />
      <template #footer>
        <button class="btn ghost" @click="askDialog = false">再想想</button>
        <button class="btn" @click="sendAsk">发送求带请求</button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.members-note { padding: 13px 18px; margin-bottom: 14px; display: flex; gap: 10px; align-items: center; color: #14727d; }
.members-note p { margin: 0; font-size: 11px; line-height: 1.8; color: #4a5f68; }
.members-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.member-card { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.member-card header { display: flex; align-items: center; gap: 10px; }
.member-card img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.member-card h3 { margin: 0; font-size: 15px; color: #0d5e68; }
.member-card header span { font-size: 10px; color: #7a8d95; }
.member-tags { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; align-content: start; }
.member-ask { align-self: flex-start; min-height: 30px; font-size: 11px; }
.ask-tip { margin: 0 0 10px; font-size: 12px; line-height: 1.8; color: #5e747e; }
.ask-text {
  width: 100%;
  height: 110px;
  resize: none;
  border: 1px solid #dce8eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  line-height: 1.8;
}
</style>
