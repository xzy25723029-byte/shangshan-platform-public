<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../../api";
import { scientistCategories } from "../../../data/chuxintang";


/* 科学家精神馆：数据驱动、四类同样式同权重
   革命先辈与战略思想分类排第一，但卡片视觉权重与其他分类一致 */

const people = ref([]);
const activeCategory = ref("全部");

onMounted(async () => {
  people.value = await mockApi.getScientists();
});

const filtered = () =>
  activeCategory.value === "全部" ? people.value : people.value.filter((p) => p.category === activeCategory.value);
</script>

<template>
  <div class="sh-page">
    <div class="page-banner">
      <div>
        <h1>科学家精神馆</h1>
        <p>从真实故事中汲取智慧——四类人物，同样式、同权重</p>
      </div>
    </div>

    <div class="sh-tabs">
      <button :class="{ active: activeCategory === '全部' }" @click="activeCategory = '全部'">全部</button>
      <button
        v-for="c in scientistCategories"
        :key="c"
        :class="{ active: activeCategory === c }"
        @click="activeCategory = c"
      >{{ c }}</button>
    </div>

    <div class="sh-grid">
      <article v-for="p in filtered()" :key="p.name + p.unit" class="card sh-card">
        <header>
          <img :src="`/assets/${p.avatar}`" :alt="p.name" />
          <div>
            <h3>{{ p.name }}</h3>
            <span>{{ p.unit }}</span>
          </div>
        </header>
        <p class="sh-direction"><b>{{ p.direction }}</b></p>
        <p class="sh-story">{{ p.story }}</p>
        <p class="sh-action">{{ p.action }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.sh-tabs { display: flex; gap: 10px; margin: 0 0 14px; flex-wrap: wrap; }
.sh-tabs button {
  border: 0;
  background: #f1f6f7;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  color: #4a5f68;
}
.sh-tabs button.active { background: #1a8993; color: white; }
.sh-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.sh-card { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.sh-card header { display: flex; align-items: center; gap: 10px; }
.sh-card header img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.sh-card h3 { margin: 0; font-size: 15px; color: #0d5e68; }
.sh-card header span { font-size: 10px; color: #7a8d95; }
.sh-direction { margin: 0; font-size: 12px; color: #14727d; }
.sh-story { margin: 0; font-size: 11px; line-height: 1.8; color: #4a5f68; flex: 1; }
.sh-action {
  margin: 0;
  padding: 9px 11px;
  border-radius: 8px;
  background: #eef7f8;
  font-size: 10px;
  line-height: 1.7;
  color: #245260;
}
</style>
