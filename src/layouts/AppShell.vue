<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { studentNav, mentorNav, adminNav } from "../router/nav";
import SidebarNav from "./SidebarNav.vue";
import TopbarSearch from "./TopbarSearch.vue";
import AIMentorDock from "./AIMentorDock.vue";
import { ListBullets } from "@/icons";

const auth = useAuthStore();
const route = useRoute();

const nav = computed(() => {
  if (auth.isMentor) return mentorNav;
  if (auth.canManageContent) return adminNav;
  return studentNav;
});

const isStudent = computed(() => auth.isStudent);

/* 手机端：侧栏抽屉开关，路由变化后自动收起 */
const navOpen = ref(false);
watch(() => route.fullPath, () => { navOpen.value = false; });
</script>

<template>
  <div class="app-shell">
    <button class="m-nav-toggle" aria-label="打开导航菜单" @click="navOpen = true">
      <ListBullets :size="20" />
    </button>

    <aside class="sidebar" :class="{ open: navOpen }">
      <router-link class="brand" to="/student/home">
        <img src="/assets/brand-mark.png" alt="上善若水品牌图形" />
        <div><strong>上善若水</strong><span>本科生科研素养实训平台</span></div>
      </router-link>
      <SidebarNav :items="nav" />
      <div v-if="isStudent" class="sensor-card">
        <div class="sensor-head"><strong>流域水质实时监测</strong><span>全部流域</span></div>
        <div class="sensor-main"><span>川渝水</span><b>68.5%</b></div>
        <img class="sensor-chart" src="/assets/sensor-chart.jpg" alt="水质变化折线图" />
        <dl>
          <div><dt>溶解氧</dt><dd>7.32 mg/L</dd></div>
          <div><dt>氨氮</dt><dd>0.72 mg/L</dd></div>
          <div><dt>电导率</dt><dd>452 μS/cm</dd></div>
        </dl>
        <small>数据来源：校内河流生态监测平台<br />更新于 10:30</small>
      </div>
      <div v-else class="sensor-card">
        <div class="sensor-head"><strong>{{ auth.isMentor ? "点将台 · 导师端" : "内容管理后台" }}</strong><span>{{ auth.user?.grade }}</span></div>
        <div class="sensor-main"><span>当前角色</span><b>{{ auth.role === "super_admin" ? "平台管理员" : auth.role === "mentor" ? "导师" : "管理员" }}</b></div>
        <small>认知侧写仅供教学参考<br />不构成评价，不得作为筛选依据</small>
      </div>
    </aside>

    <button v-if="navOpen" class="m-nav-mask" aria-label="关闭导航菜单" @click="navOpen = false"></button>

    <div class="main-shell">
      <TopbarSearch />
      <main class="page-content">
        <router-view :key="route.fullPath" />
      </main>
    </div>
    <AIMentorDock v-if="isStudent" />
  </div>
</template>

<style scoped>
.sensor-chart {
  width: 100%;
  height: 48px;
  object-fit: cover;
  mix-blend-mode: multiply;
}
.brand {
  text-decoration: none;
  color: inherit;
}
</style>
