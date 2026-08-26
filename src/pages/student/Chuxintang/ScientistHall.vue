<script setup>
import { ref, onMounted } from "vue";
import { mockApi } from "../../../api";
import { scientistCategories } from "../../../data/chuxintang";


/* 科学家精神馆：数据驱动、四类同样式同权重
   革命先辈与战略思想分类排第一，但卡片视觉权重与其他分类一致
   图文卡片：真实照片优先（public/assets/people/），无照片回退头像 */

const people = ref([]);
const activeCategory = ref("全部");

onMounted(async () => {
  people.value = await mockApi.getScientists();
});

const filtered = () =>
  activeCategory.value === "全部" ? people.value : people.value.filter((p) => p.category === activeCategory.value);

const photoSrc = (p) => (p.photo ? `/assets/people/${p.photo}` : `/assets/${p.avatar}`);
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
        <div class="sh-photo">
          <img
            :src="photoSrc(p)"
            :style="{ objectPosition: p.photoPos || 'center 40%' }"
            :alt="p.name"
            loading="lazy"
          />
        </div>
        <div class="sh-main">
          <h3>{{ p.name }}</h3>
          <p class="sh-meta">{{ p.unit }}</p>
          <p class="sh-direction">{{ p.direction }}</p>
          <blockquote v-if="p.quote" class="sh-quote">{{ p.quote }}</blockquote>
          <p class="sh-story">{{ p.story }}</p>
          <p class="sh-action">{{ p.action }}</p>
        </div>
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
  padding: 9px 16px;
  min-height: 36px;
  font-size: 12px;
  color: #4a5f68;
  transition: background 0.3s, color 0.3s, transform 0.3s;
}
.sh-tabs button:hover { background: #e3f0f2; }
.sh-tabs button.active { background: #1a8993; color: white; }
.sh-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.sh-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
.sh-photo {
  width: 100%;
  height: 128px;
  overflow: hidden;
  background: #eaf4f5;
  border-bottom: 1px solid #e0eaec;
}
.sh-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  transition: transform 0.4s ease;
}
.sh-card:hover .sh-photo img { transform: scale(1.04); }
.sh-main { padding: 13px 15px 15px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.sh-card h3 { margin: 0; font-size: 16px; color: var(--ink); }
.sh-meta { margin: 0; font-size: 10px; color: #7a8d95; }
.sh-direction { margin: 0; font-size: 12px; font-weight: 700; color: #14727d; }
.sh-quote {
  margin: 2px 0 0;
  padding: 9px 11px;
  border-left: 3px solid #6fc3ca;
  border-radius: 0 8px 8px 0;
  background: #f0f9fa;
  font-family: var(--font-kai);
  font-size: 13px;
  line-height: 1.7;
  color: #17586a;
}
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

@media (max-width: 1100px) { .sh-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .sh-grid { grid-template-columns: 1fr; } }
</style>
