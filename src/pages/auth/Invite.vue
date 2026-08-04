<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";


const auth = useAuthStore();
const router = useRouter();
const code = ref("");
const submitting = ref(false);

const demoTips = [
  { code: "STU2026", role: "学生" },
  { code: "MEN2026", role: "导师" },
  { code: "ADM2026", role: "内容管理员" },
  { code: "SUP2026", role: "平台管理员" },
];

async function submit() {
  submitting.value = true;
  try {
    await auth.redeemInvite(code.value);
    router.push(auth.homePath());
  } catch {
    // 错误信息由 store 写入 auth.error
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="invite-page">
    <div class="invite-card card">
      <router-link to="/login" class="back">‹ 返回登录</router-link>
      <img src="/assets/brand-mark.png" alt="上善若水品牌图形" />
      <h1 class="kai-title">邀请码加入</h1>
      <p>由导师或管理员发放的邀请码，决定你的平台角色。</p>
      <label class="code-input">
        <input v-model="code" placeholder="请输入邀请码" @keyup.enter="submit" />
        <button class="btn" :disabled="submitting" @click="submit">加入平台</button>
      </label>
      <p v-if="auth.error" class="invite-error">{{ auth.error }}</p>
      <div class="demo-tips">
        <span>演示邀请码：</span>
        <button v-for="t in demoTips" :key="t.code" @click="code = t.code">
          {{ t.code }} · {{ t.role }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.invite-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f9fcfd, #eef7f9);
}
.invite-card {
  width: 460px;
  padding: 40px 42px;
  text-align: center;
  position: relative;
}
.back { position: absolute; left: 22px; top: 20px; font-size: 12px; color: #6f8791; text-decoration: none; }
.invite-card > img { width: 64px; height: 64px; object-fit: contain; }
.invite-card h1 { font-size: 30px; margin: 10px 0 8px; }
.invite-card > p { margin: 0 0 20px; color: #6f8791; font-size: 13px; }
.code-input { display: flex; gap: 8px; }
.code-input input {
  flex: 1;
  height: 40px;
  border: 1px solid #dce7eb;
  border-radius: 8px;
  padding: 0 12px;
  letter-spacing: 2px;
}
.invite-error { margin: 10px 0 0; color: #a8743f; font-size: 12px; }
.demo-tips { margin-top: 22px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.demo-tips span { font-size: 11px; color: #8a9ba2; line-height: 28px; }
.demo-tips button {
  font-size: 10px;
  padding: 6px 10px;
  border: 1px solid #cfe3e7;
  background: white;
  border-radius: 999px;
  color: #14727d;
}
</style>
