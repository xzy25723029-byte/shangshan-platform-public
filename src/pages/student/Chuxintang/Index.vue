<script setup>
import {
  CaretRight, ArrowSquareOut, PlayCircle, LinkSimple,
  Drop, Compass, Flag, ChartLine, MagnifyingGlass, ShieldCheck,
  PenNib, ArchiveBox, UsersThree, Hammer, Radar, ChatCircleDots,
} from "@/icons";
import { tripleCore } from "../../../data/chuxintang";
import { scientists } from "../../../data/people";
import { BILIBILI_LIBRARY } from "../../../data/videos";


/* 初心堂首页：四阶段逻辑流程 + 楷模之声 + 视频材料
   立心 → 筑基 → 践行 → 笃行：一条初心之水，阶段间以流程线相连
   卡片以图标 + 品牌渐变代替旧水墨小图（低清重复图已移除） */

/* 四阶段：每阶段 3 个模块，link 字段标注模块间的逻辑衔接 */
const stages = [
  {
    name: "立心",
    sub: "想清楚为什么出发",
    icon: Drop,
    items: [
      { title: "三重内核", sub: "尚为水 · 韧为水 · 善为水", desc: "平台精神的三块基石", to: "/student/triple-core", icon: Drop, link: "由此展开：领航理念总纲" },
      { title: "领航理念总纲", sub: "解放思想，实事求是", desc: "四条领航理念与平台动作对照", to: "/student/guiding-principles", icon: Compass, link: "落到实处：入营第一课", featured: true },
      { title: "入营第一课", sub: "科学之道，如水之道", desc: "开场三问、热点 vs 真问题、主动劝退", to: "/student/first-lesson", icon: Flag, link: "先过第一关：把系统画出来" },
    ],
  },
  {
    name: "筑基",
    sub: "学会把账算清楚",
    icon: ChartLine,
    items: [
      { title: "能量流物质流模型", sub: "先算账，再看另一种看法", desc: "六步推演 + 六个战略自问", to: "/student/energy-flow", icon: ChartLine, link: "算清账后：去现场找真问题" },
      { title: "战略方法论与产业调研", sub: "文献是二手信息，现场是真需求", desc: "从原话墙出发找真问题", to: "/student/strategy-research", icon: MagnifyingGlass, link: "立下规矩：治学军规" },
      { title: "治学军规签署", sub: "恪守科研诚信", desc: "逐条确认自己的治学约定", to: "/student/oath", icon: ShieldCheck, link: "从此诚实：思想札记" },
    ],
  },
  {
    name: "践行",
    sub: "诚实地记录过程",
    icon: PenNib,
    items: [
      { title: "思想札记提交", sub: "只看诚实，不看文采", desc: "记录真实困惑与判断", to: "/student/thought-notes", icon: PenNib, link: "封存此刻：初心档案" },
      { title: "初心档案", sub: "封存大一初心，四年后归还", desc: "记录每一次选择与行动", to: "/student/origin-archive", icon: ArchiveBox, link: "对照前人：科学家精神馆" },
      { title: "科学家精神馆", sub: "走近科学大家", desc: "四类人物，同样式、同权重", to: "/student/scientist-hall", icon: UsersThree, link: "轮到你了：啃硬骨头" },
    ],
  },
  {
    name: "笃行",
    sub: "从容地面对困难",
    icon: Hammer,
    items: [
      { title: "啃硬骨头·记录", sub: "科研路上的攻坚时刻", desc: "四种结局，完全平权", to: "/student/hard-bone", icon: Hammer, link: "攻坚之后：认知侧写" },
      { title: "认知侧写", sub: "六轴倾向图", desc: "只自己 vs 自己，不与他人比较", to: "/student/cognitive-profile", icon: Radar, link: "回到自己：与水问对话" },
      { title: "AI 导师 · 水问", sub: "初心堂只反问，不给答案", desc: "苏格拉底式对话伙伴", to: "/student/ai-mentor", icon: ChatCircleDots, link: "随时回来：初心堂任何一站" },
    ],
  },
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

    <!-- 四阶段旅程：2×2 排布，S 型水流衔接，水到渠成 -->
    <section class="journey">
      <div class="journey-head">
        <h2>一段初心之旅</h2>
        <p>十二站沿水流排布，一站引向下一站——水到渠成</p>
      </div>

      <div class="flow-row">
        <section class="stage">
          <div class="stage-head">
            <span class="stage-node"><component :is="stages[0].icon" :size="20" weight="duotone" /></span>
            <div><h3>{{ stages[0].name }}</h3><p>{{ stages[0].sub }}</p></div>
          </div>
          <div class="stage-grid">
            <article v-for="f in stages[0].items" :key="f.title" class="card f-card" :class="{ featured: f.featured }">
              <div class="f-icon"><component :is="f.icon" :size="26" weight="duotone" /></div>
              <div class="f-body">
                <h4>{{ f.title }}</h4>
                <p class="f-sub">{{ f.sub }}</p>
                <p class="f-desc">{{ f.desc }}</p>
              </div>
              <div class="f-foot">
                <router-link class="btn" :to="f.to">进入查看 <CaretRight :size="13" /></router-link>
                <p class="f-link"><LinkSimple :size="11" />{{ f.link }}</p>
              </div>
            </article>
          </div>
        </section>

        <div class="flow-h" aria-hidden="true">
          <svg viewBox="0 0 64 24">
            <path class="fh-wave" d="M2 16 Q 8 10 14 16 T 26 16 T 38 16 T 50 16 T 62 16" fill="none" />
            <path class="fh-wave fh-wave-2" d="M2 20 Q 8 14 14 20 T 26 20 T 38 20 T 50 20 T 62 20" fill="none" />
            <circle class="fh-dot" cx="6" cy="16" r="3.4" />
          </svg>
        </div>

        <section class="stage">
          <div class="stage-head">
            <span class="stage-node"><component :is="stages[1].icon" :size="20" weight="duotone" /></span>
            <div><h3>{{ stages[1].name }}</h3><p>{{ stages[1].sub }}</p></div>
          </div>
          <div class="stage-grid">
            <article v-for="f in stages[1].items" :key="f.title" class="card f-card">
              <div class="f-icon"><component :is="f.icon" :size="26" weight="duotone" /></div>
              <div class="f-body">
                <h4>{{ f.title }}</h4>
                <p class="f-sub">{{ f.sub }}</p>
                <p class="f-desc">{{ f.desc }}</p>
              </div>
              <div class="f-foot">
                <router-link class="btn" :to="f.to">进入查看 <CaretRight :size="13" /></router-link>
                <p class="f-link"><LinkSimple :size="11" />{{ f.link }}</p>
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- 行间水流：从右列落下，折向左列 -->
      <div class="flow-v" aria-hidden="true"><span class="fv-dot"></span></div>

      <div class="flow-row">
        <section class="stage">
          <div class="stage-head">
            <span class="stage-node"><component :is="stages[2].icon" :size="20" weight="duotone" /></span>
            <div><h3>{{ stages[2].name }}</h3><p>{{ stages[2].sub }}</p></div>
          </div>
          <div class="stage-grid">
            <article v-for="f in stages[2].items" :key="f.title" class="card f-card">
              <div class="f-icon"><component :is="f.icon" :size="26" weight="duotone" /></div>
              <div class="f-body">
                <h4>{{ f.title }}</h4>
                <p class="f-sub">{{ f.sub }}</p>
                <p class="f-desc">{{ f.desc }}</p>
              </div>
              <div class="f-foot">
                <router-link class="btn" :to="f.to">进入查看 <CaretRight :size="13" /></router-link>
                <p class="f-link"><LinkSimple :size="11" />{{ f.link }}</p>
              </div>
            </article>
          </div>
        </section>

        <div class="flow-h" aria-hidden="true">
          <svg viewBox="0 0 64 24">
            <path class="fh-wave" d="M2 16 Q 8 10 14 16 T 26 16 T 38 16 T 50 16 T 62 16" fill="none" />
            <path class="fh-wave fh-wave-2" d="M2 20 Q 8 14 14 20 T 26 20 T 38 20 T 50 20 T 62 20" fill="none" />
            <circle class="fh-dot" cx="6" cy="16" r="3.4" />
          </svg>
        </div>

        <section class="stage">
          <div class="stage-head">
            <span class="stage-node"><component :is="stages[3].icon" :size="20" weight="duotone" /></span>
            <div><h3>{{ stages[3].name }}</h3><p>{{ stages[3].sub }}</p></div>
          </div>
          <div class="stage-grid">
            <article v-for="f in stages[3].items" :key="f.title" class="card f-card">
              <div class="f-icon"><component :is="f.icon" :size="26" weight="duotone" /></div>
              <div class="f-body">
                <h4>{{ f.title }}</h4>
                <p class="f-sub">{{ f.sub }}</p>
                <p class="f-desc">{{ f.desc }}</p>
              </div>
              <div class="f-foot">
                <router-link class="btn" :to="f.to">进入查看 <CaretRight :size="13" /></router-link>
                <p class="f-link"><LinkSimple :size="11" />{{ f.link }}</p>
              </div>
            </article>
          </div>
        </section>
      </div>

      <div class="flow-end">
        <span class="pool"><i></i><i></i></span>
        <p>水到渠成——十二站走完，初心已成习惯</p>
      </div>
    </section>

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
      <article v-for="p in tripleCore" :key="p.name" class="card">
        <span class="principle-icon"><Drop :size="30" weight="duotone" /></span>
        <div>
          <h3>{{ p.name }}</h3>
          <p>{{ p.sub }}<br />{{ p.desc }}</p>
        </div>
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

/* 四阶段旅程：2×2 + S 型水流 */
.journey { margin: 0 0 22px; }
.journey-head { margin: 0 0 14px; }
.journey-head h2 { margin: 0 0 4px; font-size: 19px; color: #0d5e68; }
.journey-head p { margin: 0; font-size: 12px; color: #7a8d95; }

.flow-row { display: flex; align-items: stretch; gap: 0; }
.stage { flex: 1; min-width: 0; }
.stage-head { display: flex; align-items: center; gap: 12px; margin: 0 0 12px; }
.stage-node {
  width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(135deg, #eaf7f9, #d4edf0);
  border: 1px solid #c3e3e7;
  color: #14727d;
  flex: 0 0 auto;
}
.stage-head h3 { margin: 0; font-family: var(--font-kai); font-size: 21px; color: #0d5e68; letter-spacing: 4px; }
.stage-head p { margin: 1px 0 0; font-size: 11px; color: #7a8d95; }

/* 阶段间横向水流：波纹 + 流动水滴 */
.flow-h { flex: 0 0 64px; display: grid; place-items: center; align-self: center; }
.flow-h svg { width: 64px; height: 24px; display: block; }
.fh-wave { stroke: #9cc9cf; stroke-width: 1.6; stroke-linecap: round; }
.fh-wave-2 { stroke: #c3e3e7; }
.fh-dot { fill: #2e97a2; animation: fh-flow 1.7s linear infinite; }
@keyframes fh-flow {
  0% { transform: translateX(0); opacity: 0; }
  18% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(46px); opacity: 0; }
}

/* 行间水流：右列垂下，折向左列 */
.flow-v { position: relative; height: 30px; margin: 2px 0 6px; }
.flow-v::before {
  content: "";
  position: absolute;
  top: 0; left: calc(75% - 1px);
  width: 2px; height: 15px;
  background: linear-gradient(180deg, #c9e6ea, #e8f4f6);
}
.flow-v::after {
  content: "";
  position: absolute;
  top: 13px; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #eef7f8, #c9e6ea 60%, #a7d4da);
}
.fv-dot {
  position: absolute;
  top: -4px; left: calc(75% - 4px);
  width: 8px; height: 8px; border-radius: 50%;
  background: #6fc3ca;
  animation: fv-drop 2.2s ease-in-out infinite;
}
@keyframes fv-drop {
  0% { transform: translate(0, 0); opacity: 0; }
  25% { opacity: 1; }
  55% { transform: translate(0, 15px); opacity: 1; }
  100% { transform: translate(calc(-75% + 8px), 15px); opacity: 0; }
}

/* 水到渠成：终点水滴落潭 */
.flow-end { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px 0 4px; }
.pool { position: relative; width: 26px; height: 26px; display: grid; place-items: center; }
.pool::before {
  content: "";
  width: 14px; height: 14px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #7fd4da, #2e97a2);
}
.pool i {
  position: absolute; inset: 0;
  border: 1.6px solid #9cc9cf; border-radius: 50%;
  animation: pool-ripple 2.6s ease-out infinite;
}
.pool i:last-child { animation-delay: -1.3s; }
@keyframes pool-ripple {
  0% { transform: scale(0.55); opacity: 0.8; }
  100% { transform: scale(1.9); opacity: 0; }
}
.flow-end p { margin: 0; font-family: var(--font-kai); font-size: 14px; color: #28707a; letter-spacing: 1px; }

.stage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.f-card { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.f-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(13, 94, 104, 0.1); }
.f-card.featured { background: linear-gradient(125deg, #fff, #eaf7f9); }
.f-icon {
  width: 46px; height: 46px; border-radius: 12px;
  display: grid; place-items: center;
  background: linear-gradient(135deg, #eaf7f9, #d8eef1);
  border: 1px solid #d2e9ec;
  color: #14727d;
}
.f-body { flex: 1; }
.f-body h4 { margin: 0 0 5px; font-size: 16px; color: #0d5e68; }
.f-sub { margin: 0 0 4px; font-size: 12px; color: #16848a; }
.f-desc { margin: 0; font-size: 11px; line-height: 1.7; color: #6b828b; }
.f-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px dashed #dce9ec; padding-top: 11px; }
.f-foot .btn { text-decoration: none; min-height: 30px; padding: 0 12px; font-size: 11px; flex: 0 0 auto; }
.f-link { margin: 0; display: inline-flex; align-items: center; gap: 4px; font-size: 10px; color: #8aa0a8; }
.f-link svg { flex: 0 0 auto; }

/* 楷模之声 */
.models { margin-bottom: 22px; }
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

.principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 0 0 22px; }
.principles .card { min-height: 112px; padding: 20px 26px; display: flex; align-items: center; gap: 20px; }
.principle-icon {
  width: 52px; height: 52px; border-radius: 14px; flex: 0 0 auto;
  display: grid; place-items: center;
  background: linear-gradient(135deg, #eaf7f9, #d8eef1);
  border: 1px solid #d2e9ec;
  color: #14727d;
}
.principles h3 { font-family: var(--font-kai); font-size: 23px; margin: 0 0 7px; color: #0e6670; }
.principles p { margin: 0; line-height: 1.7; color: #5d7782; font-size: 13px; }

/* 视频材料 */
.videos { padding: 18px 22px; }
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
  .stage-grid { grid-template-columns: 1fr 1fr; }
  .models-grid { grid-template-columns: repeat(2, 1fr); }
  .videos-list { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .flow-row { flex-direction: column; gap: 8px; }
  .flow-h, .flow-v { display: none; }
  .stage + .stage { margin-top: 4px; }
  /* 手机上同一阶段的卡片横向滑动，减少纵向长度 */
  .stage-grid {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
  .f-card { min-width: 248px; flex: 0 0 248px; scroll-snap-align: start; }
  .f-card:hover { transform: none; }
}
@media (max-width: 640px) {
  .principles { grid-template-columns: 1fr; gap: 12px; }
  .models-grid { grid-template-columns: 1fr; }
  .f-foot { flex-direction: column; align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-text, .fh-dot, .fv-dot, .pool i { animation: none; }
}
</style>
