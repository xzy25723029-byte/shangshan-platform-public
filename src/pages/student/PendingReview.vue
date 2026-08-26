<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { Clock, SignOut } from "@/icons";

/* 正式学员 · 等待审核页
   注册后由管理员审核通过方可进入平台（内部使用，不淘汰、不催促） */

const auth = useAuthStore();
const router = useRouter();

async function logout() {
  await auth.logout();
  router.push("/login");
}
</script>

<template>
  <div class="pending-page">
    <div class="card pending-card">
      <span class="pending-icon"><Clock :size="34" /></span>
      <h1>注册已提交，等待审核</h1>
      <p class="pending-mail">账号邮箱：<b>{{ auth.user?.email }}</b></p>
      <p class="pending-desc">
        本平台为团队内部使用，管理员会对每位学员的注册进行人工确认。
        审核通过后，用同一邮箱登录即可进入初心堂；如长时间未通过，请联系团队管理员。
      </p>
      <div class="pending-steps">
        <span>① 提交注册</span><i></i><span>② 管理员审核</span><i></i><span>③ 登录进入</span>
      </div>
      <button class="btn ghost" @click="logout"><SignOut :size="15" />退出登录</button>
    </div>
  </div>
</template>

<style scoped>
.pending-page {
  min-height: calc(100vh - 70px);
  display: grid;
  place-items: center;
  padding: 24px;
}
.pending-card {
  width: 480px;
  max-width: 100%;
  padding: 40px 44px;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 12px;
}
.pending-icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(135deg, #eaf7f9, #d8eef1);
  border: 1px solid #d2e9ec;
  color: #14727d;
}
.pending-card h1 { margin: 0; font-size: 21px; color: var(--ink); }
.pending-mail { margin: 0; font-size: 13px; color: #245260; }
.pending-mail b { color: #0f7c87; }
.pending-desc { margin: 0; font-size: 12px; line-height: 1.9; color: #5e747e; }
.pending-steps { display: flex; align-items: center; gap: 10px; margin: 6px 0; font-size: 12px; color: #4a5f68; }
.pending-steps i { width: 26px; height: 1px; background: #d5e6e9; }
</style>
