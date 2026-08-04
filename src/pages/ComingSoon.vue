<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Compass } from "@/icons";
import { comingSoonPaths } from "../router/nav";

const route = useRoute();

const meta = computed(() => {
  const title = route.meta?.title || "尚待开启";
  return { title };
});

const isComingSoon = computed(() => comingSoonPaths.some((p) => route.path.startsWith(p)));
</script>

<template>
  <div class="soon-page">
    <div class="page-banner">
      <div>
        <h1>{{ meta.title }}</h1>
        <p>这条路还在铺设中，水会慢慢流到这里。</p>
      </div>
    </div>

    <div class="card soon-card">
      <Compass :size="46" weight="duotone" />
      <h2>{{ isComingSoon ? "尚未开启" : "这个模块正在完善" }}</h2>
      <p>
        这里属于「尚未开启的远方模块」——它不是被锁住，只是还没有准备好。
        你可以先回到已开启的地方，按自己的节奏走；等到这里亮起来，随时可以回来。
      </p>
      <div class="soon-actions">
        <router-link v-if="route.path.startsWith('/student')" class="btn ghost" to="/student/home">回到初心堂</router-link>
        <router-link v-if="route.path.startsWith('/mentor')" class="btn ghost" to="/mentor/week">回到点将台</router-link>
        <router-link v-if="route.path.startsWith('/admin')" class="btn ghost" to="/admin/people">回到内容管理</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.soon-card {
  margin-top: 16px;
  padding: 56px 40px;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 10px;
  color: #4a7a85;
}
.soon-card h2 { margin: 4px 0 0; font-family: var(--font-kai); letter-spacing: 4px; color: #0f5a65; }
.soon-card p { max-width: 520px; font-size: 13px; line-height: 1.9; color: #6f8791; margin: 0; }
.soon-actions { display: flex; gap: 10px; margin-top: 14px; }
</style>
