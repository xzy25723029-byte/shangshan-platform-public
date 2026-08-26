<script setup>
import { tripleCore } from "../../../data/chuxintang";
import SectionTitle from "../../../components/common/SectionTitle.vue";

/* 三重内核页：三句同尺寸、同字号、同视觉权重 */
</script>

<template>
  <div class="triple-page">
    <div class="page-banner">
      <div>
        <h1>三重内核</h1>
        <p>尚为水、韧为水、善为水——平台精神的学、恒、成</p>
      </div>
    </div>

    <div class="triple-grid">
      <article v-for="(p, i) in tripleCore" :key="p.name" class="card triple-card">
        <div class="triple-mark">{{ ["尚", "韧", "善"][i] }}</div>
        <h2>{{ p.name }}</h2>
        <h3>{{ p.sub }}</h3>
        <p>{{ p.desc }}</p>
        <img :src="`/assets/principle-${i + 1}.jpg`" alt="" />
      </article>
    </div>

    <div class="card flow-note">
      <SectionTitle title="学 → 恒 → 成" />
      <p>
        三块内核不是并列的三个口号，而是一条路径：以「尚」为学——开放纳百川；以「韧」为恒——刻石不止步；
        以「善」为成——所学润万物。每一层训练，都在这条路径上。
      </p>
    </div>
  </div>
</template>

<style scoped>
.triple-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.triple-card { padding: 26px; text-align: center; position: relative; overflow: hidden; display: grid; justify-items: center; gap: 6px; }
.triple-mark {
  width: 64px; height: 64px; border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(145deg, #2eb5c4, #077581);
  color: white; font-family: var(--font-kai); font-size: 30px;
  box-shadow: 0 8px 20px rgba(5, 111, 124, 0.22);
  margin-bottom: 6px;
}
.triple-card h2 { margin: 0; font-family: var(--font-kai); font-size: 24px; color: var(--ink); letter-spacing: 2px; }
.triple-card h3 { margin: 0; font-size: 14px; color: #14727d; }
.triple-card p { margin: 0; font-size: 12px; color: #5e747e; }
.triple-card img { width: 100%; height: 120px; object-fit: cover; border-radius: 10px; mix-blend-mode: multiply; margin-top: 10px; }
.flow-note { margin-top: 14px; padding: 18px 22px; }
.flow-note p { margin: 8px 0 0; font-size: 13px; line-height: 1.9; color: #4a5f68; }
</style>
