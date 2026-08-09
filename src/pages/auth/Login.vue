<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { demoAccounts } from "../../api/mock";
import { SignIn, Phone, WechatLogo, Flask } from "@/icons";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

/* 双模式：测试模式（演示账号快速体验）/ 正式模式（邮箱注册，真实学员，需邀请码） */
const mode = ref("test");
const username = ref("limingyuan");
const password = ref("");
const submitting = ref(false);

/* 正式模式：邮箱 + 密码 + 邀请码 */
const email = ref("");
const emailPassword = ref("");
const realName = ref("");
const invite = ref("");
const testTab = ref("demo"); // demo | form（测试模式子标签）
const formalTab = ref("register"); // register | login（正式模式子标签）

const roleLabel = { student: "学生", mentor: "导师", admin: "内容管理员", super_admin: "平台管理员" };

async function goHome() {
  // 正式学员待审核：先到等待审核页
  if (auth.isPending()) {
    router.push("/student/pending");
    return;
  }
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

/* 正式模式注册 / 登录（邮箱 + 邀请码，内部使用） */
async function formalSubmit() {
  submitting.value = true;
  try {
    if (formalTab.value === "register") {
      await auth.registerEmail({
        email: email.value,
        password: emailPassword.value,
        name: realName.value,
        invite: invite.value,
      });
    } else {
      await auth.loginEmail({ email: email.value, password: emailPassword.value });
    }
    goHome();
  } catch {
    // 错误信息在 auth.error
  } finally {
    submitting.value = false;
  }
}

/* 微信登录：需学校主体资质开通，当前仅预留入口 */
function wechat() {
  auth.error = "微信登录正在接入学校认证体系，当前请使用邮箱注册（内部邀请码由管理员发放）";
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
      <p class="login-sub">测试模式快速体验；正式模式用手机号注册，记录真实学习历程</p>

      <!-- 测试 / 正式 模式切换 -->
      <div class="mode-switch">
        <button :class="{ active: mode === 'test' }" @click="mode = 'test'">
          <Flask :size="18" />
          <b>测试模式</b>
          <small>演示账号 · 数据为示例</small>
        </button>
        <button :class="{ active: mode === 'formal' }" @click="mode = 'formal'">
          <Phone :size="18" />
          <b>正式模式</b>
          <small>手机号注册 · 真实学员</small>
        </button>
      </div>

      <!-- 测试模式：演示账号 + 账号登录 -->
      <template v-if="mode === 'test'">
        <div class="login-tabs">
          <button :class="{ active: testTab === 'demo' }" @click="testTab = 'demo'">演示账号</button>
          <button :class="{ active: testTab === 'form' }" @click="testTab = 'form'">账号登录</button>
        </div>

        <div v-if="testTab === 'demo'" class="demo-list">
          <button v-for="acc in demoAccounts" :key="acc.id" class="demo-item" :disabled="submitting" @click="loginAs(acc)">
            <img :src="`/assets/${acc.avatar}`" :alt="acc.name" />
            <span><b>{{ acc.name }}</b><small>{{ roleLabel[acc.role] }} · {{ acc.grade }}</small></span>
            <em>{{ roleLabel[acc.role] }}</em>
          </button>
        </div>

        <form v-else-if="testTab === 'form'" class="login-form" @submit.prevent="login">
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
      </template>

      <!-- 正式模式：邮箱注册 / 登录（内部使用，需邀请码） -->
      <template v-else>
        <div class="login-tabs">
          <button :class="{ active: formalTab === 'register' }" @click="formalTab = 'register'">邮箱注册</button>
          <button :class="{ active: formalTab === 'login' }" @click="formalTab = 'login'">邮箱登录</button>
        </div>

        <form class="login-form formal-form" @submit.prevent="formalSubmit">
          <label v-if="formalTab === 'register'">姓名（可后改）
            <input v-model="realName" placeholder="你的真实姓名" />
          </label>
          <label>邮箱
            <input v-model="email" type="email" required placeholder="name@example.com" />
          </label>
          <label>密码
            <input v-model="emailPassword" type="password" minlength="6" required placeholder="至少 6 位" />
          </label>
          <label v-if="formalTab === 'register'">邀请码（团队内部使用）
            <input v-model="invite" required placeholder="向团队管理员获取，如 STU2026" />
          </label>
          <p v-if="auth.error" class="login-error">{{ auth.error }}</p>
          <button class="btn login-submit" type="submit" :disabled="submitting">
            <SignIn :size="16" />{{ formalTab === "register" ? "注册并进入" : "登 录" }}
          </button>
        </form>

        <div class="wechat-row">
          <span class="wechat-line"></span>
          <span>其他方式</span>
          <span class="wechat-line"></span>
        </div>
        <button class="btn ghost wechat-btn" @click="wechat">
          <WechatLogo :size="18" />微信登录（接入中）
        </button>
      </template>

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
  padding: 30px 34px;
}
.login-card h2 { margin: 0 0 6px; color: #0f5a65; font-size: 24px; }
.login-sub { margin: 0 0 16px; color: #6f8791; font-size: 12px; line-height: 1.6; }

/* 测试 / 正式 模式切换 */
.mode-switch { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.mode-switch button {
  display: grid;
  justify-items: start;
  gap: 3px;
  padding: 12px 14px;
  border: 1px solid #dce7ea;
  border-radius: 10px;
  background: white;
  text-align: left;
  transition: border-color 0.3s, background 0.3s;
}
.mode-switch button:hover { border-color: #91d0d6; }
.mode-switch button.active { border-color: #0f7c87; background: #eef8f9; }
.mode-switch b { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #245260; }
.mode-switch .active b { color: #0f7c87; }
.mode-switch small { font-size: 10px; color: #82969e; }

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
.phone-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
.sms-btn { min-height: 40px; font-size: 12px; }
.sms-hint { margin: 0; font-size: 11px; color: #a8743f; }
.sms-hint b { color: #0f7c87; }
.login-error { margin: 0; color: #a8743f; font-size: 12px; }
.login-submit { justify-content: center; }

.wechat-row { display: flex; align-items: center; gap: 10px; margin: 18px 0 10px; color: #9aacb3; font-size: 11px; }
.wechat-line { flex: 1; height: 1px; background: #e2eaed; }
.wechat-btn { justify-content: center; width: 100%; }

.login-foot { margin-top: 18px; font-size: 12px; color: #6f8791; }
.login-foot a { color: var(--teal); font-weight: 700; }
</style>
