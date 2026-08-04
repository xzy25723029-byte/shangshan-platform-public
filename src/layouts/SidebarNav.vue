<script setup>
import { computed, h } from "vue";
import {
  House, MapTrifold, Notebook, Flask, Atom, GraduationCap, Quotes,
  UsersThree, UserCircle, Sparkle, CalendarDots, ChalkboardTeacher,
  ChartLine, ShieldCheck, Database, Gear, VideoCamera, FileText,
  BookOpen, SquaresFour, Folder, ClipboardText,
} from "@/icons";

const props = defineProps({
  items: { type: Array, required: true },
});

const iconMap = {
  House, MapTrifold, Notebook, Flask, Atom, GraduationCap, Quotes,
  UsersThree, UserCircle, Sparkle, CalendarDots, ChalkboardTeacher,
  ChartLine, ShieldCheck, Database, Gear, VideoCamera, FileText,
  BookOpen, SquaresFour, Folder, ClipboardText,
};

const grouped = computed(() => {
  const groups = [];
  for (const item of props.items) {
    const last = groups[groups.length - 1];
    if (item.section && last?.label !== item.section) {
      groups.push({ label: item.section, items: [] });
    }
    if (!groups.length) groups.push({ label: "", items: [] });
    groups[groups.length - 1].items.push(item);
  }
  return groups;
});

const renderIcon = (name) => (iconMap[name] ? h(iconMap[name], { size: 22, weight: "duotone" }) : null);
</script>

<template>
  <nav aria-label="主要导航">
    <template v-for="group in grouped" :key="group.label">
      <div v-if="group.label" class="nav-section-label">{{ group.label }}</div>
      <router-link
        v-for="item in group.items"
        :key="item.to"
        class="nav-item"
        :to="item.to"
        :class="{ active: $route.path === item.to || $route.path.startsWith(item.to + '/') }"
      >
        <component :is="renderIcon(item.icon)" />
        <span>{{ item.label }}</span>
      </router-link>
    </template>
  </nav>
</template>
