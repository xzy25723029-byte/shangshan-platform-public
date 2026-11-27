import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

/* 学生端 · 初心堂 */
const chuxintangRoutes = [
  { path: "home", component: () => import("../pages/student/Chuxintang/Index.vue"), meta: { title: "初心堂" } },
  { path: "triple-core", component: () => import("../pages/student/Chuxintang/TripleCore.vue"), meta: { title: "三重内核" } },
  { path: "guiding-principles", component: () => import("../pages/student/Chuxintang/GuidingPrinciples.vue"), meta: { title: "领航理念总纲" } },
  { path: "first-lesson", component: () => import("../pages/student/Chuxintang/FirstLesson.vue"), meta: { title: "入营第一课" } },
  { path: "energy-flow", component: () => import("../pages/student/Chuxintang/EnergyFlow.vue"), meta: { title: "能量流物质流模型" } },
  { path: "strategy-research", component: () => import("../pages/student/Chuxintang/StrategyResearch.vue"), meta: { title: "战略方法论与产业调研" } },
  { path: "oath", component: () => import("../pages/student/Chuxintang/Oath.vue"), meta: { title: "治学军规签署" } },
  { path: "thought-notes", component: () => import("../pages/student/Chuxintang/ThoughtNotes.vue"), meta: { title: "思想札记" } },
  { path: "origin-archive", component: () => import("../pages/student/Chuxintang/OriginArchive.vue"), meta: { title: "初心档案" } },
  { path: "scientist-hall", component: () => import("../pages/student/Chuxintang/ScientistHall.vue"), meta: { title: "科学家精神馆" } },
  { path: "hard-bone", component: () => import("../pages/student/Chuxintang/HardBone.vue"), meta: { title: "啃硬骨头" } },
  { path: "cognitive-profile", component: () => import("../pages/student/Chuxintang/CognitiveProfile.vue"), meta: { title: "认知侧写" } },
  { path: "ai-mentor", component: () => import("../pages/student/Chuxintang/AIMentorPage.vue"), meta: { title: "AI 导师 · 水问" } },
];

const routes = [
  { path: "/login", component: () => import("../pages/auth/Login.vue"), meta: { guest: true } },
  { path: "/invite", component: () => import("../pages/auth/Invite.vue"), meta: { guest: true } },
  {
    path: "/student",
    component: () => import("../layouts/AppShell.vue"),
    meta: { role: "student" },
    children: [
      ...chuxintangRoutes,
      { path: "map", component: () => import("../pages/student/LearningMap.vue"), meta: { title: "学习地图" } },
      { path: "layer1", component: () => import("../pages/student/Layer1Index.vue"), meta: { title: "第1层 · 基础底座" } },
      { path: "layer1/:id", component: () => import("../pages/student/Layer1Module.vue"), meta: { title: "模块详情" } },
      { path: "layer2", component: () => import("../pages/student/Layer2Index.vue"), meta: { title: "第2层 · 专业基础" } },
      { path: "layer2/:id", component: () => import("../pages/student/Layer2Module.vue"), meta: { title: "模块详情" } },
      { path: "layer3", component: () => import("../pages/student/Layer3Index.vue"), meta: { title: "第3层 · 独立产出" } },
      { path: "layer3/:id", component: () => import("../pages/student/Layer3Direction.vue"), meta: { title: "方向详情" } },
      { path: "project", component: () => import("../pages/student/InnovationCenter/List.vue"), meta: { title: "大创中心" } },
      { path: "project/:id", component: () => import("../pages/student/InnovationCenter/Detail.vue"), meta: { title: "课题详情" } },
      { path: "graduation", component: () => import("../pages/student/Graduation/Overview.vue"), meta: { title: "毕设总览" } },
      { path: "graduation/:section", component: () => import("../pages/student/Graduation/Section.vue"), meta: { title: "毕业设计" } },
      { path: "voice", component: () => import("../pages/student/VoiceWall.vue"), meta: { title: "产业调研 · 原话墙" } },
      { path: "alumni", component: () => import("../pages/student/Alumni.vue"), meta: { title: "师兄师姐 · 传承" } },
      { path: "members", component: () => import("../pages/student/Members.vue"), meta: { title: "成员名录" } },
      { path: "ai-settings", component: () => import("../pages/student/AISettings.vue"), meta: { title: "AI 导师设置" } },
      { path: "pending", component: () => import("../pages/student/PendingReview.vue"), meta: { title: "等待审核" } },
      { path: ":any(.*)", component: () => import("../pages/ComingSoon.vue") },
    ],
  },
  {
    path: "/mentor",
    component: () => import("../layouts/AppShell.vue"),
    meta: { role: "mentor" },
    children: [
      { path: "week", component: () => import("../pages/mentor/WeekStatus.vue"), meta: { title: "本周状态" } },
      { path: "review", component: () => import("../pages/mentor/ReviewWorkbench.vue"), meta: { title: "批阅工作台" } },
      { path: "projects", component: () => import("../pages/mentor/ProjectProgress.vue"), meta: { title: "大创管理" } },
      { path: "cognitive", component: () => import("../pages/mentor/CognitiveView.vue"), meta: { title: "认知侧写查看" } },
      { path: "skill-grant", component: () => import("../pages/mentor/SkillGrant.vue"), meta: { title: "技能包授权" } },
      { path: ":any(.*)", component: () => import("../pages/ComingSoon.vue") },
    ],
  },
  {
    path: "/admin",
    component: () => import("../layouts/AppShell.vue"),
    meta: { role: "admin" },
    children: [
      { path: "people", component: () => import("../pages/admin/PeopleLib.vue"), meta: { title: "人物库" } },
      { path: "videos", component: () => import("../pages/admin/VideoLib.vue"), meta: { title: "视频资源" } },
      { path: "modules", component: () => import("../pages/admin/ModuleConfig.vue"), meta: { title: "模块配置" } },
      { path: "users", component: () => import("../pages/admin/UserReview.vue"), meta: { title: "用户与角色" } },
      { path: ":any(.*)", component: () => import("../pages/ComingSoon.vue") },
    ],
  },
  { path: "/", redirect: "/student/home" },
  { path: "/:pathMatch(.*)*", redirect: "/student/home" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!auth.user) auth.restore();

  const isGuest = to.matched.some((r) => r.meta.guest);
  if (!auth.user && !isGuest) return { path: "/login", query: { redirect: to.fullPath } };
  if (auth.user) {
    if (isGuest) return auth.homePath();
    /* 正式学员待审核：只能停留在等待审核页 */
    if (auth.isPending() && to.path !== "/student/pending") return "/student/pending";
    const required = to.matched.find((r) => r.meta.role)?.meta.role;
    if (required && auth.role !== required && !(required === "admin" && auth.role === "super_admin")) {
      return auth.homePath();
    }
  }
  return true;
});

export default router;
