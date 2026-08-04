/* ============================================================
   导航配置（v3 §5 信息架构）
   学生端 / 导师端 / 管理端；一期未实现项 → 尚未开启占位页
   ============================================================ */

export const studentNav = [
  { label: "初心堂", to: "/student/home", icon: "House" },
  { label: "学习地图", to: "/student/map", icon: "MapTrifold" },
  { label: "第1层 · 基础底座", to: "/student/layer1", icon: "Notebook" },
  { label: "第2层 · 专业基础", to: "/student/layer2", icon: "Flask" },
  { label: "第3层 · 独立产出", to: "/student/layer3", icon: "Atom" },
  { label: "大创中心", to: "/student/project", icon: "Atom", section: "实践" },
  { label: "毕业设计", to: "/student/graduation", icon: "GraduationCap" },
  { label: "产业调研 · 原话墙", to: "/student/voice", icon: "Quotes", section: "调研" },
  { label: "师兄师姐", to: "/student/alumni", icon: "UsersThree", section: "传承" },
  { label: "成员名录", to: "/student/members", icon: "UserCircle" },
  { label: "成果墙", to: "/student/achievements", icon: "Sparkle" },
  { label: "我的", to: "/student/track", icon: "UserCircle", section: "我的" },
];

export const mentorNav = [
  { label: "本周状态", to: "/mentor/week", icon: "CalendarDots" },
  { label: "批阅工作台", to: "/mentor/review", icon: "ChalkboardTeacher" },
  { label: "认知侧写查看", to: "/mentor/cognitive", icon: "ChartLine" },
  { label: "技能包授权", to: "/mentor/skill-grant", icon: "ShieldCheck" },
  { label: "大创管理", to: "/mentor/projects", icon: "Atom", section: "管理" },
  { label: "毕设管理", to: "/mentor/graduation", icon: "GraduationCap" },
  { label: "内容管理", to: "/mentor/content", icon: "Database" },
  { label: "数据看板", to: "/mentor/dashboard", icon: "ChartLine", section: "总览" },
  { label: "设置中心", to: "/mentor/settings", icon: "Gear" },
];

export const adminNav = [
  { label: "人物库", to: "/admin/people", icon: "UsersThree" },
  { label: "视频资源", to: "/admin/videos", icon: "VideoCamera" },
  { label: "范例库", to: "/admin/cases", icon: "FileText" },
  { label: "复现论文池", to: "/admin/reproduction", icon: "BookOpen" },
  { label: "模块配置", to: "/admin/modules", icon: "SquaresFour" },
  { label: "技能包配置", to: "/admin/skill-packs", icon: "ShieldCheck", section: "权限" },
  { label: "用户与角色", to: "/admin/users", icon: "UserCircle" },
  { label: "文件与资源", to: "/admin/files", icon: "Folder" },
  { label: "操作日志", to: "/admin/logs", icon: "ClipboardText" },
];

/* 尚未开启项集合（渲染统一占位页，符合红线「尚未开启的远方模块」） */
export const comingSoonPaths = [
  "/student/layer2",
  "/student/layer3",
  "/student/research-records",
  "/student/achievements",
  "/student/track",
  "/student/account",
  "/mentor/projects",
  "/mentor/graduation",
  "/mentor/content",
  "/mentor/dashboard",
  "/mentor/settings",
  "/admin/cases",
  "/admin/reproduction",
  "/admin/skill-packs",
  "/admin/users",
  "/admin/files",
  "/admin/logs",
];
