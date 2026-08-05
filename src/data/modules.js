/* ============================================================
   模块数据
   第1层 11 个模块（统一 ModuleDetailTemplate 驱动）
   第2层 21 个模块清单 + 结果可不可信专题
   第3层 4 个方向
   ============================================================ */

/* ---------- 第1层 · 基础底座（新兵连） ---------- */
export const layer1Modules = [
  {
    id: "lab-safety",
    code: "1-1",
    name: "实验室安全",
    type: "技能类",
    hours: "约 2–3 小时",
    acceptance: "考核合格证",
    tag: "新兵连",
  },
  {
    id: "ai-interaction",
    code: "1-2",
    name: "AI 交互力",
    type: "技能类",
    hours: "约 3–4 小时",
    acceptance: "3–5 轮追问记录 + 找出 AI 的一个坑",
    tag: "新兵连",
  },
  {
    id: "literature-search",
    code: "1-3",
    name: "文献检索",
    type: "技能类",
    hours: "约 4–6 小时",
    acceptance: "10 篇清单，各一句话，标注 3 篇精读",
    tag: "新兵连",
  },
  {
    id: "zotero",
    code: "1-4",
    name: "文献管理 Zotero",
    type: "技能类",
    hours: "约 3–5 小时",
    acceptance: "规范 Zotero 文库 + 引文插入截图",
    tag: "新兵连",
  },
  {
    id: "paper-figure",
    code: "1-5",
    name: "科技论文绘图（二维）",
    type: "技能类",
    hours: "约 6–8 小时",
    acceptance: "一张期刊规范图",
    tag: "新兵连",
  },
  {
    id: "blender-3d",
    code: "1-6",
    name: "三维科研绘图 Blender",
    type: "技能类",
    hours: "约 8–12 小时",
    acceptance: "一张三维装置/机理示意图 + 图注",
    tag: "新兵连",
  },
  {
    id: "paper-writing",
    code: "1-7",
    name: "科技论文撰写",
    type: "技能类",
    hours: "约 6–8 小时",
    acceptance: "方法段 + 图注 + 结果段",
    tag: "新兵连",
  },
  {
    id: "git-basics",
    code: "1-8",
    name: "工程素养 Git",
    type: "技能类",
    hours: "约 4–6 小时",
    acceptance: "一个规范 Git 仓库",
    tag: "新兵连",
  },
  {
    id: "patent-entry",
    code: "1-9",
    name: "专利入门",
    type: "技能类",
    hours: "约 5–8 小时",
    acceptance: "技术交底书 + 一条独立权利要求",
    tag: "新兵连",
  },
  {
    id: "academic-norms",
    code: "1-10",
    name: "学术规范常识",
    type: "常识类",
    hours: "约 2–3 小时",
    acceptance: "一份简答",
    tag: "新兵连",
  },
  {
    id: "reproduction-drill",
    code: "1-11",
    name: "顶刊图表复现综合演练",
    type: "收官综合",
    hours: "约 8–12 小时",
    acceptance: "图表复现仓库 + 信息缺口清单",
    tag: "第1层收官",
  },
];

/* 科技论文绘图 · 完整示例内容（其余模块由模板 + 各自配置数据渲染） */
export const moduleDemoContent = {
  id: "paper-figure",
  videos: {
    must: [
      { title: "研一必学：Origin 入门教程与科研绘图", time: "约 1.5 小时", note: "Origin 基本操作与科研绘图规范", url: "https://www.bilibili.com/video/BV18fsbepETy" },
      { title: "Origin2025 零基础入门教程（180 集）", time: "系统课程", note: "数据导入、绘图、拟合、导出全流程", url: "https://www.bilibili.com/video/BV16RFUe8EoM" },
      { title: "Origin 柱状图保姆级教程（新手入门）", time: "约 25 分钟", note: "常见图型快速上手", url: "https://www.bilibili.com/video/BV1yU421d7Q8" },
    ],
    optional: [
      { title: "XRD 曲线绘制与 Origin 拟合技巧", time: "约 20 分钟", note: "专业数据出图的进阶操作", url: "https://www.bilibili.com/video/BV1RLWvzaEJj" },
    ],
  },
  groupStandard: [
    "图表信息完整：标题、坐标轴、图例、单位齐全",
    "数据准确清晰：趋势、差异与相关性表达清楚",
    "视觉规范统一：配色合理、字体统一、排版美观",
  ],
  pitfalls: [
    "坐标轴未从 0 开始，导致趋势被误导",
    "颜色过多或对比度不足，影响可读性",
    "分辨率过低，导出后版面模糊失真",
  ],
  examples: {
    good: { title: "清晰示例", img: "chart-good.jpg", copy: "信息完整，重点突出，配色克制" },
    bad: { title: "待改进示例", img: "chart-bad.jpg", copy: "信息拥挤，层次不清，重点模糊" },
  },
  checklist: [
    "图表类型选择是否合理？",
    "标题和注释是否清晰简洁？",
    "坐标轴、单位、图例是否完整准确？",
    "分辨率是否满足使用要求？",
  ],
  books: [
    { title: "《科学图表之美》", desc: "清晰、准确、优雅的表达", img: "book-1.png" },
  ],
  papers: ["Visualization: the state of the field", "Ten Simple Rules for Better Figures"],
  submission: {
    desc: "上传本模块的绘图作品与源文件。",
    accept: "支持 JPG / PNG / PDF / SVG，单个文件 ≤ 50MB",
  },
};

/* 通用模块详情（无完整内容时，模板渲染基础信息 + 占位说明） */
export const moduleBrief = (m) => ({
  id: m.id,
  videos: { must: [], optional: [] },
  groupStandard: [],
  pitfalls: [],
  examples: null,
  checklist: [],
  books: [],
  papers: [],
  submission: {
    desc: "按本模块要求上传验收物。",
    accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
  },
});

/* ---------- 第2层 · 专业基础 ---------- */
export const layer2Groups = [
  {
    key: "A",
    name: "材料表征分析",
    question: "我做的材料是什么",
    status: "核心必修",
    modules: [
      { id: "A1", name: "XRD 物相分析（Jade）" },
      { id: "A2", name: "XPS 分峰" },
      { id: "A3", name: "电镜图像分析（ImageJ/Fiji）" },
      { id: "A4", name: "Raman / FTIR 光谱分峰" },
    ],
  },
  {
    key: "B",
    name: "电化学分析",
    question: "它的电化学性能如何",
    status: "核心必修",
    modules: [
      { id: "B1", name: "伏安法基础（CV / LSV）" },
      { id: "B2", name: "Tafel 分析" },
      { id: "B3", name: "EIS 交流阻抗" },
      { id: "B4", name: "ECSA / 法拉第效率 / 能耗计算" },
    ],
  },
  {
    key: "C",
    name: "水质分析",
    question: "水里发生了什么变化",
    status: "核心必修",
    modules: [
      { id: "C1", name: "三维荧光 EEM / FRI / PARAFAC" },
      { id: "C2", name: "紫外-可见光谱水质表征" },
      { id: "C3", name: "常规水质指标与数据处理" },
      { id: "C4", name: "色谱质谱数据处理" },
    ],
  },
  {
    key: "D",
    name: "机理与计算",
    question: "为什么会这样",
    status: "进阶",
    modules: [
      { id: "D1", name: "EPR / 自由基分析" },
      { id: "D2", name: "计算化学" },
    ],
  },
  {
    key: "E",
    name: "过程模拟",
    question: "放大后会怎样",
    status: "进阶",
    modules: [
      { id: "E1", name: "COMSOL 多物理场仿真" },
      { id: "E2", name: "反应动力学" },
    ],
  },
  {
    key: "F",
    name: "环境影响与经济性",
    question: "这个方案到底成不成立",
    status: "必修，呼应第0层",
    modules: [
      { id: "F1", name: "毒理学与风险评估" },
      { id: "F2", name: "生命周期评价 LCA" },
      { id: "F3", name: "技术经济分析 TEA" },
    ],
  },
];

/* 结果可不可信专题（贯穿第2层） */
export const trustTopics = [
  { title: "XPS 过拟合", body: "分峰越多拟合越好？参数自由度过大时，结论不可信。" },
  { title: "Tafel 区间任选", body: "Tafel 区间的选取会改变斜率结论——区间是依据还是结果？" },
  { title: "EIS 电路非唯一", body: "同一个阻抗谱可以有多个等效电路解释，电路要有物理意义。" },
  { title: "仿真网格依赖", body: "结果随网格加密而变，说明没有收敛——先做网格无关性。" },
  { title: "QSAR 超应用域", body: "模型在训练域外预测，R² 再高也不可信。" },
  { title: "EEM 散射未扣净", body: "散射残留会污染荧光信号，扣净是前提不是细节。" },
  { title: "R² 崇拜", body: "R² 高不代表因果成立，更不代表模型能用。" },
];

/* ---------- 第3层 · 独立产出 ---------- */
export const layer3Directions = [
  {
    id: "A",
    name: "论文写作",
    deliverable: "一份可投稿完整手稿",
    base: "大创 / 毕设成果",
    body: "完整手稿：Introduction、Results、Discussion、Conclusion、SI；环境工程范式：效果 → 机理 → 工程；选刊、Cover Letter、回复审稿意见；局限性坦白，呼应实事求是。",
    skillPack: "学生未完成完整初稿前，不得使用写作技能包；初稿完成后由导师手动授予，技能包用于检查和对照，不得用于生成。",
    icon: "FileText",
  },
  {
    id: "B",
    name: "专利撰写",
    deliverable: "一份可提交专利申请文件",
    base: "大创 / 毕设成果",
    body: "检索与新颖性判断、权利要求层次、保护范围取舍、说明书支撑、实施例与附图、审查意见答复。",
    skillPack: "导师技能包同样必须手动授予，且只能在学生完成初稿后使用。",
    icon: "ShieldCheck",
  },
  {
    id: "C",
    name: "软件/程序开发",
    deliverable: "一个能被别人用起来的工具",
    base: "课题组 / 同学 / 原话墙真实需求",
    body: "选题必须来自真实需求；允许使用 AI 编程工具，但学生必须能解释代码；提交历史必须体现真实迭代，不能一次性提交成品。",
    skillPack: "交付物：可用工具、代码仓库、使用文档、至少一位真实使用者反馈。",
    icon: "Code",
  },
  {
    id: "D",
    name: "硬件与感知",
    deliverable: "一个能工作的装置/传感系统",
    base: "真实需求",
    body: "需求与指标定义、传感器选型、Arduino / ESP32 低门槛平台、电路与安全、3D 建模与打印、数据采集与上位机、标定与验证。",
    skillPack: "交付物：能工作的装置、标定报告、与标准方法的对照数据。",
    icon: "Cpu",
  },
];

export const layer3Reproduction = {
  name: "完整工作复现（选做）",
  body: "完整工作复现为选做，不做不影响评价。原因是实验复现成本高、周期长，不应变成筛选机制。",
};
