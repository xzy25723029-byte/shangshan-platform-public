<script setup>
import { guidingPrinciples } from "../../../data/chuxintang";

import { ArrowRight } from "@/icons";

/* 领航理念总纲（初心堂 P0 页面）
   四条理念不是口号，而是平台方法论来源：
   理念 → 平台落地 → 平台功能对照 */
</script>

<template>
  <div class="gp-page">
    <div class="page-banner">
      <div>
        <h1>领航理念总纲</h1>
        <p>毛泽东思想领航理念 · 平台的方法论来源</p>
      </div>
      <span class="pill">P0 · 平台思想底座</span>
    </div>

    <p class="gp-lead">
      四条领航理念不是装饰性思政文本，而是这个平台「怎么建、怎么教、怎么评」的方法论来源。
      每一条理念都必须能追溯到具体平台功能——只说不做，不是这里的作风。
    </p>

    <div class="gp-list">
      <article v-for="(p, i) in guidingPrinciples" :key="p.title" class="card gp-card">
        <header>
          <b>0{{ i + 1 }}</b>
          <h2>{{ p.title }}</h2>
        </header>
        <blockquote>{{ p.quote }}<cite>—— {{ p.source }}</cite></blockquote>
        <div class="gp-landing">
          <h4>平台落地</h4>
          <ul>
            <li v-for="l in p.landing" :key="l">{{ l }}</li>
          </ul>
        </div>
        <div class="gp-functions">
          <h4>对应平台功能</h4>
          <div class="gp-links">
            <router-link v-for="f in p.functions" :key="f.to" class="gp-link" :to="f.to">
              {{ f.name }} <ArrowRight :size="13" />
            </router-link>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.gp-lead {
  margin: 0 0 14px;
  padding: 14px 18px;
  border: 1px solid #cfe3e7;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  line-height: 1.9;
  color: #245260;
}
.gp-list { display: grid; gap: 14px; }
.gp-card { padding: 20px 24px; }
.gp-card header { display: flex; align-items: center; gap: 12px; }
.gp-card header b {
  width: 34px; height: 34px; border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(145deg, #2eb5c4, #077581);
  color: white; font-size: 13px;
}
.gp-card h2 { margin: 0; font-family: var(--font-kai); font-size: 22px; color: var(--ink); letter-spacing: 2px; }
.gp-card blockquote {
  margin: 12px 0 0;
  padding: 10px 14px;
  border-left: 3px solid #59c5d1;
  background: #f2fafb;
  border-radius: 0 8px 8px 0;
  font-size: 13px;
  color: #245260;
  line-height: 1.8;
}
.gp-card blockquote cite { display: block; margin-top: 4px; font-size: 11px; font-style: normal; color: #7a8d95; }
.gp-landing, .gp-functions { margin-top: 14px; }
.gp-landing h4, .gp-functions h4 { margin: 0 0 8px; font-size: 12px; color: #14727d; }
.gp-landing ul { margin: 0; padding-left: 18px; font-size: 12px; color: #4a5f68; line-height: 2; }
.gp-links { display: flex; gap: 8px; flex-wrap: wrap; }
.gp-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #0f7c87;
  background: #eef8f9;
  border: 1px solid #d3e9ec;
  border-radius: 999px;
  padding: 6px 13px;
  min-height: 34px;
  text-decoration: none;
  font-weight: 700;
}
.gp-link:hover { background: #e0f3f5; }
</style>
