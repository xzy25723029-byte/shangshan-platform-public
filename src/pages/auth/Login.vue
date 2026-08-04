<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { demoAccounts } from "../../api/mock";
import { SignIn } from "@/icons";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const mode = ref("demo");
const username = ref("limingyuan");
const password = ref("");
const submitting = ref(false);

const roleLabel = { student: "学生", mentor: "导师", admin: "内容管理员", super_admin: "平台管理员" };

async function goHome() {
  const target = route.query.redirect;
  if (target && target.startsWith("/") && !target.startsWith("//")) {
    router.push(target);
  } else {
    router.push(auth.homePath());
  }
}

async function loginAs(acc) {
  submitting.value = true;
  await auth.loginAs(acc.id);
  goHome();
}

async function login() {
  submitting.value = true;
  try {
    await auth.login({ username: username.value, password: password.value });
    goHome();
  } catch {
    // 错误信息由 store 写入 auth.error
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-hero">
      <img src="/assets/hero-water-city.png" alt="" />
      <div class="login-brand">
        <img src="/assets/brand-mark.png" alt="上善若水品牌图形" />
        <div>
          <h1>上善若水</h1>
          <p>本科生科研素养实训平台</p>
          <blockquote>初心如水，方能行稳致远；上善若水，终成无限可能。</blockquote>
        </div>
      </div>
    </div>

    <div class="login-card card">
      <h2>登录</h2>
      <p class="login-sub">使用平台账号登录，或直接选择演示账号体验</p>

      <div class="login-tabs">
        <button :class="{ active: mode === 'demo' }" @click="mode = 'demo'">演示账号</button>
        <button :class="{ active: mode === 'form' }" @click="mode = 'form'">账号登录</button>
      </div>

      <div v-if="mode === 'demo'" class="demo-list">
        <button v-for="acc in demoAccounts" :key="acc.id" class="demo-item" :disabled="submitting" @click="loginAs(acc)">
          <img :src="`/assets/${acc.avatar}`" :alt="acc.name" />
          <span><b>{{ acc.name }}</b><small>{{ roleLabel[acc.role] }} · {{ acc.grade }}</small></span>
          <em>{{ roleLabel[acc.role] }}</em>
        </button>
      </div>

      <form v-else class="login-form" @submit.prevent="login">
        <label>用户名
          <input v-model="username" required placeholder="如 limingyuan" />
        </label>
        <label>密码
          <input v-model="password" type="password" required placeholder="演示环境任意密码" />
        </label>
        <p v-if="auth.error" class="login-error">{{ auth.error }}</p>
        <button class="btn login-submit" type="submit" :disabled="submitting">
          <SignIn :size="16" />登 录
        </button>
      </form>

      <div class="login-foot">
        还没有账号？
        <router-link to="/invite">使用邀请码加入</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.2fr 420px;
  background: linear-gradient(135deg, #f9fcfd, #eef7f9);
}
.login-hero {
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.login-hero > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.22;
}
.login-brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  backdrop-filter: blur(4px);
  box-shadow: var(--shadow);
}
.login-brand img { width: 96px; height: 96px; object-fit: contain; }
.login-brand h1 {
  font-family: var(--font-kai);
  font-size: 46px;
  letter-spacing: 8px;
  margin: 0 0 4px;
  color: #0d5862;
}
.login-brand p { margin: 0 0 10px; color: #44616b; font-size: 14px; }
.login-brand blockquote { margin: 0; font-family: var(--font-kai); color: #28707a; line-height: 1.8; }
.login-card {
  align-self: center;
  margin: 24px 40px;
  padding: 34px 36px;
}
.login-card h2 { margin: 0 0 6px; color: #0f5a65; font-size: 24px; }
.login-sub { margin: 0 0 18px; color: #6f8791; font-size: 12px; }
.login-tabs { display: flex; gap: 8px; border-bottom: 1px solid #dce7ea; margin-bottom: 18px; }
.login-tabs button {
  border: 0;
  background: transparent;
  padding: 8px 14px;
  color: #6f8791;
  font-weight: 700;
}
.login-tabs button.active { color: #0f7c87; border-bottom: 2px solid #0f7c87; }
.demo-list { display: grid; gap: 9px; }
.demo-item {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border: 1px solid #e0eaec;
  border-radius: 10px;
  background: white;
  text-align: left;
}
.demo-item:hover { border-color: #91d0d6; background: #f4fbfc; }
.demo-item img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
.demo-item b, .demo-item small { display: block; }
.demo-item small { font-size: 10px; color: #82969e; margin-top: 3px; }
.demo-item em {
  font-style: normal;
  font-size: 10px;
  color: #16808a;
  background: #e9f7f5;
  border-radius: 999px;
  padding: 4px 10px;
}
.login-form { display: grid; gap: 14px; }
.login-form label { display: grid; gap: 6px; font-size: 12px; font-weight: 700; color: #44616b; }
.login-form input {
  height: 40px;
  border: 1px solid #dce7eb;
  border-radius: 8px;
  padding: 0 12px;
  font-weight: 400;
}
.login-error { margin: 0; color: #a8743f; font-size: 12px; }
.login-submit { justify-content: center; }
.login-foot { margin-top: 20px; font-size: 12px; color: #6f8791; }
.login-foot a { color: var(--teal); font-weight: 700; }
</style>
