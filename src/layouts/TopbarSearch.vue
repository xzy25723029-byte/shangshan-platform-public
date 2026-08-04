<script setup>
import { ref } from "vue";
import { MagnifyingGlass, BookOpen, Bell, CaretDown, SignOut } from "@/icons";
import { useAuthStore } from "../stores/auth";
import { useAppStore } from "../stores/app";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const app = useAppStore();
const router = useRouter();

const menuVisible = ref(false);

async function logout() {
  menuVisible.value = false;
  await auth.logout();
  router.push("/login");
}

const roleLabel = () => {
  if (auth.isMentor) return "导师";
  if (auth.role === "super_admin") return "平台管理员";
  if (auth.role === "admin") return "内容管理员";
  return "环境工程 2022级";
};

/* 资源中心快捷入口（按角色展示） */
const resourceEntries = () => {
  if (auth.isMentor) {
    return [
      { label: "批阅工作台", to: "/mentor/review" },
      { label: "认知侧写查看", to: "/mentor/cognitive" },
      { label: "技能包授权", to: "/mentor/skill-grant" },
    ];
  }
  if (auth.canManageContent) {
    return [
      { label: "人物库", to: "/admin/people" },
      { label: "视频资源", to: "/admin/videos" },
      { label: "模块配置", to: "/admin/modules" },
    ];
  }
  return [
    { label: "学习地图", to: "/student/map" },
    { label: "第1层 · 基础底座", to: "/student/layer1" },
    { label: "科学家精神馆", to: "/student/scientist-hall" },
    { label: "原话墙", to: "/student/voice" },
    { label: "AI 导师设置", to: "/student/ai-settings" },
  ];
};
</script>

<template>
  <header class="topbar">
    <label class="global-search">
      <MagnifyingGlass :size="20" />
      <input v-model="app.query" aria-label="全局搜索" placeholder="搜索课程、资源、文献、方法等" />
    </label>
    <div class="top-actions">
      <el-dropdown trigger="click">
        <button><BookOpen :size="22" />资源中心</button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="r in resourceEntries()" :key="r.to">
              <router-link :to="r.to" class="resource-link">{{ r.label }}</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <button class="notice"><Bell :size="22" /><i /></button>
        <template #dropdown>
          <el-dropdown-menu class="notice-menu">
            <el-dropdown-item v-for="n in app.notices" :key="n.title" disabled>
              <div class="notice-item"><span>{{ n.title }}</span><small>{{ n.time }}</small></div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown trigger="click" @visible-change="(v) => (menuVisible = v)">
        <button class="profile">
          <img :src="`/assets/${auth.user?.avatar || 'avatar-user.png'}`" :alt="auth.user?.name" />
          <div><strong>{{ auth.user?.name }}</strong><span>{{ auth.user?.grade || roleLabel() }}</span></div>
          <CaretDown :size="16" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="menuVisible = false">
              <router-link v-if="auth.isStudent" to="/student/ai-settings" class="profile-link">AI 导师设置</router-link>
              <span v-else class="profile-link">账号信息</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout"><SignOut :size="14" />退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.notice-menu { min-width: 240px; }
.notice-item { display: grid; gap: 2px; }
.notice-item span { font-size: 12px; color: #284c5c; }
.notice-item small { font-size: 10px; color: #8a9ba2; }
.profile-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #284c5c; text-decoration: none; }
.resource-link { display: block; font-size: 13px; color: #284c5c; text-decoration: none; padding: 2px 0; }
</style>
