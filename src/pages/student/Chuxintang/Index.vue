<script setup>
import { CaretRight, ArrowSquareOut, PlayCircle } from "@/icons";
import { tripleCore } from "../../../data/chuxintang";
import { scientists } from "../../../data/people";
import { BILIBILI_LIBRARY } from "../../../data/videos";


/* 初心堂首页：英雄楷模 + 视频材料 + 12 个模块入口
   图文并茂：真实人物照片与金句在前，模块入口在后 */

const features = [
  { title: "三重内核", sub: "尚为水 · 韧为水 · 善为水", desc: "平台精神的三块基石", to: "/student/triple-core", art: "home-feature-1.jpg" },
  { title: "领航理念总纲", sub: "解放思想，实事求是", desc: "四条领航理念与平台动作对照", to: "/student/guiding-principles", art: "home-feature-2.jpg", featured: true },
  { title: "入营第一课", sub: "科学之道，如水之道", desc: "开场三问、热点 vs 真问题、主动劝退", to: "/student/first-lesson", art: "home-feature-3.jpg" },
  { title: "能量流物质流模型", sub: "先算账，再看另一种看法", desc: "六步推演 + 六个战略自问", to: "/student/energy-flow", art: "home-feature-4.jpg" },
  { title: "战略方法论与产业调研", sub: "文献是二手信息，现场是真需求", desc: "从原话墙出发找真问题", to: "/student/strategy-research", art: "home-feature-5.jpg" },
  { title: "治学军规签署", sub: "恪守科研诚信", desc: "逐条确认自己的治学约定", to: "/student/oath", art: "home-feature-6.jpg" },
  { title: "思想札记提交", sub: "只看诚实，不看文采", desc: "记录真实困惑与判断", to: "/student/thought-notes", art: "home-feature-1.jpg" },
  { title: "初心档案", sub: "封存大一初心，四年后归还", desc: "记录每一次选择与行动", to: "/student/origin-archive", art: "home-feature-2.jpg" },
  { title: "科学家精神馆", sub: "走近科学大家", desc: "四类人物，同样式、同权重", to: "/student/scientist-hall", art: "home-feature-3.jpg" },
  { title: "啃硬骨头·记录", sub: "科研路上的攻坚时刻", desc: "四种结局，完全平权", to: "/student/hard-bone", art: "home-feature-4.jpg" },
  { title: "认知侧写", sub: "六轴倾向图", desc: "只自己 vs 自己，不与他人比较", to: "/student/cognitive-profile", art: "home-feature-5.jpg" },
  { title: "AI 导师 · 水问", sub: "初心堂只反问，不给答案", desc: "苏格拉底式对话伙伴", to: "/student/ai-mentor", art: "home-feature-6.jpg" },
];

/* 楷模之声：真实照片 + 真实金句，只取有照片的人物 */
const roleModels = scientists.filter((p) => p.photo).slice(0, 4);
const hallVideos = BILIBILI_LIBRARY.chuxintang;
</script>

<template>
  <div class="home-page">
    <div class="home-hero" style="background-image: url(/assets/hero-water-city.png)">
      <div class="hero-text">
        <p>本科生科研素养实训平台</p>
        <h1>初心堂</h1>
        <blockquote>初心如水，方能行稳致远；<br />上善若水，终成无限可能。</blockquote>
      </div>
    </div>

    <!-- 楷模之声：图文并茂，先见人，再见理 -->
    <section class="models">
      <div class="models-head">
        <h2>楷模之声</h2>
        <router-link class="models-more" to="/student/scientist-hall">走进科学家精神馆 <CaretRight :size="13" /></router-link>
      </div>
      <div class="models-grid">
        <article v-for="m in roleModels" :key="m.name" class="card model-card">
          <div class="model-photo">
            <img :src="`/assets/people/${m.photo}`" :alt="m.name" loading="lazy" />
          </div>
          <blockquote class="model-quote">{{ m.quote }}</blockquote>
          <p class="model-name">{{ m.name }}<span>{{ m.unit }}</span></p>
        </article>
      </div>
    </section>

    <div class="principles">
      <article v-for="(p, i) in tripleCore" :key="p.name" class="card">
        <img class="principle-art" :src="`/assets/principle-${i + 1}.jpg`" alt="" />
        <div>
          <h3>{{ p.name }}</h3>
          <p>{{ p.sub }}<br />{{ p.desc }}</p>
        </div>
      </article>
    </div>

    <div class="feature-grid">
      <article
        v-for="f in features"
        :key="f.title"
        class="card feature"
        :class="{ featured: f.featured }"
      >
        <div>
          <h2>{{ f.title }}</h2>
          <h4>{{ f.sub }}</h4>
          <p>{{ f.desc }}</p>
          <router-link class="btn" :to="f.to">进入查看 <CaretRight :size="14" /></router-link>
        </div>
        <img class="feature-art" :src="`/assets/${f.art}`" alt="" />
      </article>
    </div>

    <!-- 视频材料：B 站纪录片，点击跳转观看 -->
    <section class="card videos">
      <div class="videos-head">
        <h2>视频材料</h2>
        <span>纪录片与专题片，点击直达 B 站观看</span>
      </div>
      <ul class="videos-list">
        <li v-for="(v, i) in hallVideos" :key="v.url">
          <span class="videos-idx">{{ i + 1 }}</span>
          <div class="videos-main">
            <b>{{ v.title }}</b>
            <span>{{ v.time }} · {{ v.note }}</span>
          </div>
          <a class="videos-link" :href="v.url" target="_blank" rel="noopener">
            <PlayCircle :size="13" />去观看 <ArrowSquareOut :size="12" />
          </a>
        </li>
      </ul>
    </section>

    <div class="motto">水之至柔，行于天地之间而无声；水之至刚，穿石裂壁而无阻。</div>
  </div>
</template>

<style scoped>
.home-hero {
  height: 170px;
  border-radius: 10px;
  background-position: center right;
  background-size: cover;
  padding: 24px 45px;
  color: #0d5862;
  overflow: hidden;
}
.hero-text { animation: hero-in 0.8s ease both; }
@keyframes hero-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.home-hero p { margin: 0 0 2px; font-size: 12px; }
.home-hero h1 { font-family: var(--font-kai); font-size: 54px; margin: 0 0 3px; letter-spacing: 7px; }
.home-hero blockquote { margin: 0; font-family: var(--font-kai); line-height: 1.8; }

/* 楷模之声 */
.models { margin-bottom: 14px; }
.models-head { display: flex; align-items: center; justify-content: space-between; margin: 0 0 10px; }
.models-head h2 { margin: 0; font-size: 18px; color: #0d5e68; }
.models-more { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; color: #16848a; text-decoration: none; }
.models-more:hover { color: #0d5e68; }
.models-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.model-card { padding: 14px; display: flex; flex-direction: column; gap: 10px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.model-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(13, 94, 104, 0.1); }
.model-photo { width: 100%; height: 116px; border-radius: 10px; overflow: hidden; background: #eaf4f5; }
.model-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.model-quote {
  margin: 0;
  padding: 0 2px;
  font-family: var(--font-kai);
  font-size: 14px;
  line-height: 1.75;
  color: #17586a;
  flex: 1;
}
.model-name { margin: 0; font-size: 13px; font-weight: 700; color: #0d5e68; }
.model-name span { display: block; font-size: 10px; font-weight: 400; color: #7a8d95; margin-top: 2px; }

.principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 0 0 14px; transform: translateY(-2px); }
.principles .card { min-height: 116px; padding: 20px 26px; display: flex; align-items: center; gap: 24px; }
.principle-art { width: 108px; height: 76px; object-fit: cover; border-radius: 12px; mix-blend-mode: multiply; }
.principles h3 { font-family: var(--font-kai); font-size: 23px; margin: 0 0 7px; color: #0e6670; }
.principles p { margin: 0; line-height: 1.7; color: #5d7782; font-size: 13px; }
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.feature { height: 182px; padding: 23px 26px; display: flex; align-items: center; justify-content: space-between; overflow: hidden; }
.feature.featured { background: linear-gradient(125deg, #fff, #eaf7f9); }
.feature h2 { margin: 0 0 10px; color: #0d5e68; font-size: 20px; }
.feature h4 { margin: 0 0 6px; }
.feature p { margin: 0 0 18px; color: #6b828b; font-size: 12px; }
.feature .btn { text-decoration: none; min-height: 32px; padding: 0 14px; font-size: 12px; }
.feature-art { width: 42%; height: 150px; object-fit: cover; border-radius: 10px; mix-blend-mode: multiply; opacity: 0.9; flex: 0 0 auto; }

/* 视频材料 */
.videos { padding: 18px 22px; margin-top: 14px; }
.videos-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
.videos-head h2 { margin: 0; font-size: 18px; color: #0d5e68; }
.videos-head span { font-size: 11px; color: #7a8d95; }
.videos-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
.videos-list li { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 9px; background: #f6fafb; border: 1px solid #e6eff1; transition: background 0.3s; }
.videos-list li:hover { background: #eef7f8; }
.videos-idx { flex: 0 0 auto; width: 22px; height: 22px; border-radius: 50%; background: #d9eff2; color: #14727d; display: grid; place-items: center; font-size: 11px; font-weight: 700; }
.videos-main { flex: 1; min-width: 0; }
.videos-main b { display: block; font-size: 12px; color: #245260; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.videos-main span { font-size: 10px; color: #7a8d95; }
.videos-link { display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto; font-size: 11px; color: #16848a; text-decoration: none; border: 1px solid #bfe0e4; border-radius: 999px; padding: 4px 10px; transition: background 0.3s, color 0.3s; }
.videos-link:hover { background: #16848a; color: #fff; border-color: #16848a; }

.motto {
  text-align: center;
  margin-top: 14px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.72);
  font-family: var(--font-kai);
  color: #28707a;
  font-size: 16px;
}

@media (max-width: 1100px) {
  .models-grid { grid-template-columns: repeat(2, 1fr); }
  .videos-list { grid-template-columns: 1fr; }
}
@media (max-width: 640px) { .models-grid { grid-template-columns: 1fr; } }
</style>
