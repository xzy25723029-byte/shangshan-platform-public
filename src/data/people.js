/* ============================================================
   人物库数据
   科学家精神馆四类人物 + 管理端人物库
   四类同尺寸同权重展示；革命先辈与战略思想分类排第一
   ============================================================ */

export const scientists = [
  // 革命先辈与战略思想
  {
    category: "革命先辈与战略思想",
    name: "毛泽东",
    unit: "战略思想 · 实践论",
    direction: "解放思想，实事求是",
    story: "《实践论》《矛盾论》回答了一个根本问题：结论从哪里来。实践、认识、再实践、再认识——科研训练同样是这个过程。",
    action: "平台动作：入营第一课先作答、能量流物质流先算账、思想札记只记录诚实。",
    avatar: "avatar-1.png",
  },
  {
    category: "革命先辈与战略思想",
    name: "四渡赤水",
    unit: "战略机动 · 避实击虚",
    direction: "抓主要矛盾，机动灵活",
    story: "四渡赤水不是一路硬攻，而是不断重新判断「现在主要矛盾是什么」，在运动中找到破局点。",
    action: "平台动作：学习地图按需选路，第3层可择一深入、允许更换、不记录更换次数。",
    avatar: "avatar-2.png",
  },
  // 功勋科学家
  {
    category: "功勋科学家",
    name: "钱学森",
    unit: "两弹一星 · 系统科学",
    direction: "系统工程与总体把握",
    story: "钱学森把工程问题看作系统问题：边界、输入输出、各层关系。系统思维正是能量流物质流模型的思想源头。",
    action: "平台动作：能量流物质流六步推演，把系统思维变成可操作动作。",
    avatar: "avatar-3.png",
  },
  {
    category: "功勋科学家",
    name: "袁隆平",
    unit: "农业科学家",
    direction: "把论文写在大地上",
    story: "袁隆平的结论来自田间地头的反复实测，而不是书斋推演——「没有调查，没有发言权」的科学版本。",
    action: "平台动作：产业调研记录区，现场原话优先于二手文献。",
    avatar: "avatar-4.png",
  },
  // 当代模范
  {
    category: "当代模范",
    name: "南仁东",
    unit: "中国天眼 FAST",
    direction: "二十年磨一剑",
    story: "从选址到建成，南仁东用二十余年完成一件事。持久不是坚持重复，而是持续解决卡点。",
    action: "平台动作：啃硬骨头记录区——仍在啃、啃下来了、换路子、放弃了，四种结局平权记录。",
    avatar: "avatar-5.png",
  },
  {
    category: "当代模范",
    name: "黄大年",
    unit: "地球物理学家",
    direction: "把爱国之情融入事业",
    story: "黄大年带领团队突破多项技术瓶颈，「惜时如金、夜以继日」背后是目标的高度专注。",
    action: "平台动作：战略方法论——抓主要矛盾，集中精力攻克当前最卡的问题。",
    avatar: "avatar-6.png",
  },
  // 本学科先辈
  {
    category: "本学科先辈",
    name: "顾夏声",
    unit: "水处理 · 清华大学",
    direction: "水环境工程学科奠基",
    story: "顾夏声先生主编《水处理工程》，把工程经验体系化为一门可教可学的学科，让水处理成为可传承的知识。",
    action: "平台动作：第2层 F 群——环境影响与经济性，让方案「到底成不成立」有账可算。",
    avatar: "avatar-7.png",
  },
  {
    category: "本学科先辈",
    name: "钱易",
    unit: "环境工程 · 清华大学",
    direction: "循环经济与清洁生产",
    story: "钱易院士倡导从末端治理走向源头减量与循环利用——这正是「价值加权物质流」的思想先声。",
    action: "平台动作：能量流物质流·高值资源回收正例。",
    avatar: "avatar-8.png",
  },
];

/* 管理端人物库（更多条目，供 CRUD 演示） */
export const personLibrary = [
  { name: "张雨桐", unit: "清华大学 环境学院", subject: "环境科学与工程", direction: "水污染控制 / 环境微生物", videos: 6, cases: 18, papers: 12, status: "已发布", avatar: "avatar-1.png" },
  { name: "陈昊然", unit: "北京大学 城环学院", subject: "环境科学与工程", direction: "大气污染控制", videos: 7, cases: 17, papers: 11, status: "已发布", avatar: "avatar-2.png" },
  { name: "李思涵", unit: "复旦大学 环境科学系", subject: "环境科学与工程", direction: "环境化学", videos: 6, cases: 16, papers: 10, status: "审核中", avatar: "avatar-3.png" },
  { name: "王子墨", unit: "中科院生态中心", subject: "生态学", direction: "生态修复 / 湿地科学", videos: 8, cases: 15, papers: 11, status: "已发布", avatar: "avatar-4.png" },
  { name: "刘一鸣", unit: "浙江大学 环境学院", subject: "环境科学与工程", direction: "固废资源化", videos: 7, cases: 14, papers: 9, status: "已发布", avatar: "avatar-5.png" },
  { name: "赵婉宁", unit: "同济大学 环境学院", subject: "给排水科学与工程", direction: "水处理工艺", videos: 8, cases: 13, papers: 10, status: "已发布", avatar: "avatar-6.png" },
  { name: "周景行", unit: "中节能研究院", subject: "环境工程", direction: "智慧水务", videos: 5, cases: 12, papers: 8, status: "审核中", avatar: "avatar-7.png" },
  { name: "孙语晨", unit: "南京大学 环境学院", subject: "环境科学与工程", direction: "环境规划与管理", videos: 6, cases: 11, papers: 9, status: "已发布", avatar: "avatar-8.png" },
];
