/* ============================================================
   大创中心数据（原型 project 页移植 + 列表）
   ============================================================ */

export const projects = [
  {
    id: "p1",
    name: "低碳曝气强化 AO 工艺脱氮性能优化研究",
    type: "水处理工艺",
    field: "环境工程 / 水污染控制",
    owner: "王雨桐",
    ownerAvatar: "avatar-1.png",
    start: "2024-03-01",
    status: "进行中",
    abstract:
      "本课题以低碳曝气强化 AO 工艺为研究对象，围绕曝气强度、溶解氧分布与碳源投加协同调控展开，探索工程应用中的低碳运行策略。",
    members: [
      { name: "王雨桐", role: "负责人", duty: "数据采集与整理", avatar: "avatar-1.png" },
      { name: "周景行", role: "实验负责人", duty: "实验设计与实施", avatar: "avatar-2.png" },
      { name: "赵语涵", role: "数据负责人", duty: "数据分析与可视化", avatar: "avatar-3.png" },
      { name: "林思妍", role: "文献负责人", duty: "文献调研与综述", avatar: "avatar-4.png" },
      { name: "陈子墨", role: "模型负责人", duty: "模型建立与仿真", avatar: "avatar-5.png" },
      { name: "何明远", role: "设备负责人", duty: "设备维护与能耗测试", avatar: "avatar-6.png" },
    ],
    milestones: [
      { name: "立项", date: "2024-03-01", state: "done" },
      { name: "开题", date: "2024-03-28", state: "done" },
      { name: "中期检查", date: "2024-05-20", state: "current" },
      { name: "结题评审", date: "2024-06-20", state: "" },
      { name: "成果沉淀", date: "2024-06-30", state: "" },
    ],
    countdown: { days: 12, hours: 8, minutes: 36 },
    todos: [
      "完成 DO 分布数据分析",
      "提交中期检查材料",
      "补充模型验证实验",
      "撰写中期进展报告",
    ],
    tasks: [
      { name: "不同曝气强度下 DO 分布测定", owner: "avatar-1.png", date: "05-22" },
      { name: "碳源投加策略实验设计", owner: "avatar-2.png", date: "05-24" },
      { name: "能耗数据采集与整理", owner: "avatar-6.png", date: "05-26" },
    ],
    files: ["实验原始数据", "中试实验记录", "模型与仿真文件", "中期汇报PPT.pptx", "参考文献汇总.xlsx"],
    retro: {
      ok: ["实验设计合理，数据采集顺利完成。", "团队分工明确，协作效率高。"],
      stuck: ["部分时段 DO 波动较大，数据异常。", "曝气强度与能耗关系需要进一步验证。"],
    },
    mentor: {
      id: "u2",
      name: "张涛 教授",
      unit: "环境工程学院",
      avatar: "avatar-2.png",
      advice: "中期进展良好，建议增加不同温度条件下的对比实验，进一步验证模型的普适性。",
    },
    ai: {
      greeting: "Hi，李明远。我是你的科研助手，有任何问题都可以问我。",
      suggestions: ["帮我分析脱氮效率异常原因", "推荐相关文献", "如何优化曝气策略"],
    },
    notes: ["中期实验方案讨论纪要", "曝气设备能耗测试记录", "溶解氧分布测试结果整理"],
  },
];

/* ---------- 毕业设计数据 ---------- */
export const graduation = {
  title: "基于三维荧光光谱的污水处理厂溶解性有机质溯源研究",
  mentor: "张涛 教授",
  direction: "水质分析 / 环境监测",
  stage: "实验/计算推进",
  files: ["开题报告_终稿.docx", "文献综述_2026-06.docx", "技术路线图.pptx"],
  milestones: [
    { name: "选题确认", date: "2026-04-12", state: "done" },
    { name: "开题", date: "2026-05-08", state: "done" },
    { name: "实验/计算推进", date: "2026-06-30", state: "current" },
    { name: "中期检查", date: "2026-09-15", state: "" },
    { name: "论文初稿", date: "2026-11-30", state: "" },
    { name: "定稿", date: "2027-02-28", state: "" },
    { name: "答辩", date: "2027-04-15", state: "" },
    { name: "归档", date: "2027-04-30", state: "" },
  ],
  topic: {
    source: "产业调研原话 + 文献调研",
    interview: "与园区水厂运维人员访谈：『出水荧光信号变化大，想弄清楚是什么来源』",
    voiceId: "v3",
    literature: "EEM-PARAFAC 方法在市政污水处理厂 DOM 溯源中的应用综述",
  },
  proposal: {
    questions: ["研究问题：不同工艺段出水 DOM 组分构成与来源差异是什么？", "技术路线：采样 → EEM 测定 → FRI/PARAFAC 解析 → 与运行参数关联"],
    risks: ["采样周期跨季节，工作量较大", "PARAFAC 组分数选取依赖经验判断"],
  },
  experimentLogs: [
    { date: "2026-07-10", type: "实验", content: "完成进水、厌氧池、好氧池、出水四个点位采样，共 16 个样品。" },
    { date: "2026-07-18", type: "数据", content: "EEM 测定完成 8 个样品，散射峰明显，需要预处理扣除。" },
    { date: "2026-07-24", type: "异常", content: "好氧池样品荧光强度异常偏低，怀疑稀释倍数记录有误，已标记待复核。" },
  ],
  writing: {
    chapters: [
      { name: "第一章 绪论", state: "草稿" },
      { name: "第二章 材料与方法", state: "草稿" },
      { name: "第三章 结果与讨论", state: "尚未开启" },
      { name: "第四章 结论", state: "尚未开启" },
    ],
    figures: ["图3-1 各工艺段 EEM 等高线图（初稿）"],
  },
  defense: {
    ppt: "尚未开启",
    speech: "尚未开启",
    questions: ["PARAFAC 组分数与文献如何对比？", "荧光组分与常规水质指标的关联性如何？"],
  },
  archive: {
    note: "最终论文、数据、代码、图表将在答辩后归档封存。",
    mentorComment: "尚未填写",
  },
  linkedDeliverables: ["A 论文写作（待关联）"],
};

export const graduationSections = [
  { id: "overview", name: "毕设总览", desc: "题目、导师、研究方向、当前阶段、关键文件" },
  { id: "topic", name: "选题与调研", desc: "选题来源、产业/文献调研、原话墙关联" },
  { id: "proposal", name: "开题任务", desc: "开题报告、研究问题、技术路线、风险点" },
  { id: "experiment", name: "实验/计算记录", desc: "实验、仿真、数据、异常记录" },
  { id: "midterm", name: "中期检查", desc: "阶段成果、导师意见、下一步计划" },
  { id: "writing", name: "论文写作", desc: "章节草稿、图表、引用、SI" },
  { id: "defense", name: "答辩准备", desc: "PPT、讲稿、可能问题、答辩材料" },
  { id: "archive", name: "归档封存", desc: "最终论文、数据、代码、图表、导师评价" },
];
