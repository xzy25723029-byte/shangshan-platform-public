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
    steps: [
      "选题与数据整理（依托大创/毕设成果）",
      "完成 Introduction / Results / Discussion / Conclusion 初稿",
      "选刊并核对期刊要求（格式、篇幅、伦理声明）",
      "撰写 Cover Letter 并完成投稿",
      "回复审稿意见（如需要）",
    ],
    checklist: [
      "初稿是否完成，并完整读过一遍？",
      "图表是否达到期刊要求？",
      "局限性是否坦白（呼应实事求是）？",
      "是否用写作技能包检查过结构与措辞？",
      "Cover Letter 是否说明创新点与适配性？",
    ],
    submission: {
      desc: "上传可投稿的完整手稿（含图表与 SI 说明页）。",
      accept: "支持 PDF / DOCX / ZIP，单个文件 ≤ 50MB",
    },
  },
  {
    id: "B",
    name: "专利撰写",
    deliverable: "一份可提交专利申请文件",
    base: "大创 / 毕设成果",
    body: "检索与新颖性判断、权利要求层次、保护范围取舍、说明书支撑、实施例与附图、审查意见答复。",
    skillPack: "导师技能包同样必须手动授予，且只能在学生完成初稿后使用。",
    icon: "ShieldCheck",
    steps: [
      "现有技术检索与新颖性判断",
      "确定技术方案与创新点",
      "撰写权利要求（从宽到窄的层次）",
      "撰写说明书与实施例、附图",
      "答复审查意见（如需要）",
    ],
    checklist: [
      "是否完成现有技术检索并记录？",
      "权利要求是否有层次（独立/从属）？",
      "说明书是否支撑权利要求？",
      "实施例与附图是否完整对应？",
      "保护范围取舍是否说明理由？",
    ],
    submission: {
      desc: "上传说明书、权利要求书与附图。",
      accept: "支持 PDF / DOCX / ZIP，单个文件 ≤ 50MB",
    },
  },
  {
    id: "C",
    name: "软件/程序开发",
    deliverable: "一个能被别人用起来的工具",
    base: "课题组 / 同学 / 原话墙真实需求",
    body: "选题必须来自真实需求；允许使用 AI 编程工具，但学生必须能解释代码；提交历史必须体现真实迭代，不能一次性提交成品。",
    skillPack: "交付物：可用工具、代码仓库、使用文档、至少一位真实使用者反馈。",
    icon: "Code",
    steps: [
      "从真实需求中确定选题",
      "设计功能与交互",
      "编码实现，提交历史体现真实迭代",
      "编写使用文档",
      "找至少一位真实使用者并收集反馈",
    ],
    checklist: [
      "选题是否来自真实需求？",
      "能否逐段解释自己的代码？",
      "提交历史是否体现迭代，而非一次性提交？",
      "是否有使用文档？",
      "是否获得真实使用者反馈？",
    ],
    submission: {
      desc: "上传工具（代码仓库链接或压缩包）、使用文档与使用者反馈。",
      accept: "支持 ZIP / 仓库链接文本，单个文件 ≤ 50MB",
    },
  },
  {
    id: "D",
    name: "硬件与感知",
    deliverable: "一个能工作的装置/传感系统",
    base: "真实需求",
    body: "需求与指标定义、传感器选型、Arduino / ESP32 低门槛平台、电路与安全、3D 建模与打印、数据采集与上位机、标定与验证。",
    skillPack: "交付物：能工作的装置、标定报告、与标准方法的对照数据。",
    icon: "Cpu",
    steps: [
      "需求与指标定义（量化）",
      "传感器选型（对照数据手册）",
      "电路搭建与安全复查",
      "3D 建模与打印外壳/结构件",
      "数据采集与上位机",
      "标定与标准方法对照验证",
    ],
    checklist: [
      "指标是否有量化定义？",
      "选型是否对照数据手册？",
      "电路是否通过安全复查？",
      "标定数据是否完整？",
      "是否与标准方法做了对照？",
    ],
    submission: {
      desc: "上传装置照片/演示视频、标定报告、与标准方法的对照数据。",
      accept: "支持 JPG / PNG / MP4 / ZIP，单个文件 ≤ 50MB",
    },
  },
];

export const layer3Reproduction = {
  name: "完整工作复现（选做）",
  body: "完整工作复现为选做，不做不影响评价。原因是实验复现成本高、周期长，不应变成筛选机制。",
};

/* ---------- 第2层 · 19 个模块完整内容 ----------
   内容口径：v3 §8.2 群级问题 + §7.3 六段式模板推演初版，
   判定标准/自查清单可由导师在 ModuleConfig 修订；
   视频复用 BILIBILI_LIBRARY（A1/A2/B3/C1/E1/F2 已备），其余待补。 */
export const layer2Modules = [
  /* ---- A 群 · 材料表征分析（我做的材料是什么） ---- */
  {
    id: "A1", code: "A1", group: "A", name: "XRD 物相分析（Jade）",
    type: "技能类", hours: "约 6–8 小时", tag: "材料表征 · 核心必修",
    acceptance: "一份 XRD 物相鉴定记录：PDF 卡片号 + 峰位对照表 + 测试条件",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "衍射峰位与 PDF 标准卡比对，峰位偏差在合理容差内（一般 ±0.1–0.2°）",
        "物相鉴定覆盖全部主要衍射峰，不遗漏、不强凑",
        "记录测试条件：靶材、电压/电流、扫描范围、步长与样品制备方式",
      ],
      pitfalls: [
        "只对最强峰、忽略次要峰，导致物相判断片面",
        "直接采用软件自动匹配结果，不核对峰位偏差与相对强度",
        "样品不平整或厚度不足，峰位偏移、信噪比差",
      ],
      examples: null,
      checklist: [
        "是否记录了测试条件（靶材/电压/电流/扫描范围/步长）？",
        "是否先扣除背底、平滑后再检索？",
        "匹配的 PDF 卡片与全部主要峰对得上吗？",
        "多相样品是否逐一确认每一相的归属？",
        "报告中是否标注卡片号与匹配度？",
      ],
      books: [
        { title: "Elements of X-Ray Diffraction", desc: "Cullity 经典教材：衍射原理与物相分析基础", img: "book-1.png" },
      ],
      papers: [],
      submission: {
        desc: "上传 XRD 谱图（含 PDF 卡片叠加）、物相鉴定记录与测试条件说明。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "A2", code: "A2", group: "A", name: "XPS 分峰",
    type: "技能类", hours: "约 6–8 小时", tag: "材料表征 · 核心必修",
    acceptance: "一张规范分峰图 + 结合能归属表（每条归属附文献或数据库依据）",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "结合能用 C 1s（284.8 eV）等内标校正，并在报告中注明",
        "分峰参数（半峰宽、峰形）处于物理合理范围，不做无约束拟合",
        "每个峰有明确归属，且附文献或数据库依据",
      ],
      pitfalls: [
        "不做荷电校正直接读峰位",
        "为拟合好看随意增加峰数——峰多不等于对（见「结果可不可信」专题）",
        "忽略自旋轨道分裂：p/d/f 轨道的双峰间距与面积比有固定约束",
      ],
      examples: null,
      checklist: [
        "是否做了荷电校正并注明内标？",
        "每个分峰是否有归属依据？",
        "自旋轨道分裂的双峰约束是否满足？",
        "半峰宽是否处于合理范围？",
        "是否在图中标注结合能与归属？",
      ],
      books: [
        { title: "Practical Surface Analysis", desc: "Briggs & Seah：表面分析权威著作（XPS 部分）", img: "book-1.png" },
      ],
      papers: [],
      submission: {
        desc: "上传 XPS 精细谱分峰图 + 结合能归属表（含依据）。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "A3", code: "A3", group: "A", name: "电镜图像分析（ImageJ/Fiji）",
    type: "技能类", hours: "约 6–8 小时", tag: "材料表征 · 核心必修",
    acceptance: "一组电镜图分析：标尺校正 + 尺寸/粒径统计（≥3 张图，口径说明）",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "标尺校准正确，比例尺与放大倍数一致",
        "统计样本量足够（每张图一般 ≥ 100 个颗粒/区域），统计口径写清楚",
        "图像处理步骤（阈值/分割）可复现，不做选择性美化",
      ],
      pitfalls: [
        "直接截图、比例尺未按放大倍数校准",
        "只挑「好看」的区域统计",
        "阈值分割不当导致颗粒粘连或丢失",
      ],
      examples: null,
      checklist: [
        "是否用标尺校准了像素尺寸？",
        "统计样本量是否足够、口径是否说明？",
        "阈值/分割参数是否记录并可复现？",
        "是否报告了平均值与分布（而非只报一个代表值）？",
        "处理前后的原始图是否保留？",
      ],
      books: [
        { title: "Digital Image Processing", desc: "Gonzalez & Woods：图像处理原理（阈值/分割/形态学）", img: "book-1.png" },
      ],
      papers: [],
      submission: {
        desc: "上传原始图 + 处理后图 + 统计结果表（含口径说明）。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "A4", code: "A4", group: "A", name: "Raman / FTIR 光谱分峰",
    type: "技能类", hours: "约 5–8 小时", tag: "材料表征 · 核心必修",
    acceptance: "一张基线扣除正确、峰归属标注的光谱图 + 归属表",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "基线扣除与归一化方法写明并可复现",
        "峰位归属有文献或标准谱库支持",
        "半定量比较时说明归一化基准（内标峰/积分面积）",
      ],
      pitfalls: [
        "手动扣基线随心所欲，不同样品口径不一致",
        "把噪声峰当特征峰",
        "样品间比较前未归一化，强度直接对比",
      ],
      examples: null,
      checklist: [
        "基线扣除方法是否记录？",
        "峰归属是否有文献/谱库依据？",
        "归一化基准是否统一？",
        "光谱范围与分辨率是否记录？",
        "图中峰位标注是否与归属表一致？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传光谱图（含基线/分峰图层）+ 峰归属表。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },

  /* ---- B 群 · 电化学分析（它的电化学性能如何） ---- */
  {
    id: "B1", code: "B1", group: "B", name: "伏安法基础（CV / LSV）",
    type: "技能类", hours: "约 6–8 小时", tag: "电化学 · 核心必修",
    acceptance: "一组 CV/LSV 曲线 + 峰位/峰电流标注 + 一句物理解释",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "注明三电极体系：工作/参比/对电极、电解液与扫速",
        "扩散控制判断：峰电流与扫速平方根的关系检验",
        "iR 降补偿与否说明清楚",
      ],
      pitfalls: [
        "三电极接错或参比电极失准，峰位整体漂移",
        "扫速范围过宽，双电层电流主导淹没法拉第信号",
        "不补偿 iR 降直接读峰位与峰电流",
      ],
      examples: null,
      checklist: [
        "是否注明电极体系与电解液？",
        "峰电流-扫速关系是否检验？",
        "iR 补偿情况是否说明？",
        "是否标注峰电位与峰电流？",
        "曲线是否与文献同体系数据可比？",
      ],
      books: [
        { title: "Electrochemical Methods", desc: "Bard & Faulkner：电化学方法经典教材", img: "book-1.png" },
      ],
      papers: [],
      submission: {
        desc: "上传 CV/LSV 曲线图（含条件标注与峰标注）+ 解释文字。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "B2", code: "B2", group: "B", name: "Tafel 分析",
    type: "技能类", hours: "约 4–6 小时", tag: "电化学 · 核心必修",
    acceptance: "一张 Tafel 图 + 斜率取值区间截图 + 区间选取依据说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "Tafel 区间选取有依据，附区间截图，不任意截取",
        "斜率取值与文献可比，注明温度与介质",
        "外推交换电流密度时说明假设与适用范围",
      ],
      pitfalls: [
        "区间任选：同一数据可截出不同斜率（见「结果可不可信」专题）",
        "混合控制区被当作 Tafel 区",
        "忘记注明扫速、温度与介质",
      ],
      examples: null,
      checklist: [
        "Tafel 区间选取是否有依据并截图？",
        "是否注明温度/介质/扫速？",
        "斜率是否与文献值可比？",
        "是否说明了外推的假设？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传 Tafel 图（含区间标注）+ 斜率取值依据说明。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "B3", code: "B3", group: "B", name: "EIS 交流阻抗",
    type: "技能类", hours: "约 6–8 小时", tag: "电化学 · 核心必修",
    acceptance: "一张 Nyquist/Bode 图 + 等效电路及各元件物理意义说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "等效电路选择有物理依据，不只是拟合得好",
        "报告拟合质量（χ² 或残差图）",
        "每个元件对应明确物理过程（溶液电阻/电荷转移/扩散等）",
      ],
      pitfalls: [
        "同一个谱可以配多个电路——电路要有物理意义（见「结果可不可信」专题）",
        "高频点缺失导致 Rs 拟合失真",
        "元件越加越多只为拟合好看",
      ],
      examples: null,
      checklist: [
        "等效电路是否有物理意义？",
        "是否报告了拟合质量指标？",
        "高频/低频范围是否完整？",
        "每个元件是否对应明确物理过程？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传 Nyquist/Bode 图 + 等效电路图与元件物理解释。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "B4", code: "B4", group: "B", name: "ECSA / 法拉第效率 / 能耗计算",
    type: "技能类", hours: "约 5–8 小时", tag: "电化学 · 核心必修",
    acceptance: "一份计算表：公式、参数来源、结果 + 方法选择说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "计算方法与文献一致，公式、参数来源完整可查",
        "ECSA 用双电层电容法时注明扫速区间与归一化口径",
        "法拉第效率计算与产物定量方法一一对应",
      ],
      pitfalls: [
        "电容法扫速区间不注明，面积口径混乱",
        "能耗计算漏掉电解池电压与电流效率的耦合",
        "单位换算错误（mA/cm²、mol、C 之间）",
      ],
      examples: null,
      checklist: [
        "每个公式与参数是否注明了来源？",
        "ECSA 计算口径是否与文献一致？",
        "法拉第效率与产物定量方法是否对应？",
        "能耗是否计入电解池电压与效率？",
        "单位换算是否复核？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传计算表（含公式与参数来源）+ 结果说明。",
        accept: "支持 PDF / XLSX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },

  /* ---- C 群 · 水质分析（水里发生了什么变化） ---- */
  {
    id: "C1", code: "C1", group: "C", name: "三维荧光 EEM / FRI / PARAFAC",
    type: "技能类", hours: "约 8–12 小时", tag: "水质分析 · 核心必修",
    acceptance: "一张 EEM 图（含 FRI/PARAFAC 结果）+ 组分识别依据说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "内滤效应校正与散射扣除（拉曼/瑞利）说明完整",
        "PARAFAC 组分数的选择有验证（残差、核一致性等）",
        "组分与文献荧光区域对应，不凭空命名",
      ],
      pitfalls: [
        "散射未扣净污染信号（见「结果可不可信」专题）",
        "不校正内滤效应直接比较强度",
        "PARAFAC 组分数随意选定，不做验证",
      ],
      examples: null,
      checklist: [
        "是否做了内滤校正与散射扣除？",
        "PARAFAC 组分数是否有验证依据？",
        "组分命名是否与文献对应？",
        "是否注明仪器与激发/发射范围？",
      ],
      books: [],
      papers: [
        "Stedmon & Bro (2008). Characterizing dissolved organic matter fluorescence with parallel factor analysis: a tutorial",
      ],
      submission: {
        desc: "上传 EEM 图与 PARAFAC/FRI 结果 + 组分识别说明。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "C2", code: "C2", group: "C", name: "紫外-可见光谱水质表征",
    type: "技能类", hours: "约 4–6 小时", tag: "水质分析 · 核心必修",
    acceptance: "一张 UV-Vis 谱图 + 特征参数（SUVA254 等）计算说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "基线（纯水）扣除与稀释倍数注明",
        "特征参数计算公式与波长选择有依据",
        "浊度干扰的处理方式说明",
      ],
      pitfalls: [
        "高浓度样品不稀释，吸光度超量程",
        "SUVA254 忘记除以 DOC 浓度",
        "仪器零点漂移不校正",
      ],
      examples: null,
      checklist: [
        "是否扣除基线并注明稀释倍数？",
        "特征参数公式与波长是否有依据？",
        "浊度是否处理并说明？",
        "仪器型号与比色皿光程是否记录？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传 UV-Vis 谱图 + 特征参数计算说明。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "C3", code: "C3", group: "C", name: "常规水质指标与数据处理",
    type: "技能类", hours: "约 4–6 小时", tag: "水质分析 · 核心必修",
    acceptance: "一份指标测定记录：平行样、质控样、异常值处理说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "采用标准方法并注明方法编号（GB / HJ 等）",
        "平行样相对偏差在方法要求范围内",
        "质控样回收率达标并记录",
      ],
      pitfalls: [
        "不记录批次、仪器、试剂批次信息",
        "平行样偏差大直接取平均值",
        "异常值不追溯原因直接删除",
      ],
      examples: null,
      checklist: [
        "是否注明了标准方法编号？",
        "平行样偏差是否在要求内？",
        "质控样回收率是否达标并记录？",
        "异常值是否有追溯说明？",
        "原始记录是否可追溯？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传测定记录表（含质控信息与异常值处理说明）。",
        accept: "支持 PDF / XLSX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "C4", code: "C4", group: "C", name: "色谱质谱数据处理",
    type: "技能类", hours: "约 6–8 小时", tag: "水质分析 · 核心必修",
    acceptance: "一张色谱图 + 定性/定量处理记录（标曲、内标、检出限）",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "标曲线性范围、检出限计算方法注明",
        "内标/外标选择合理，基质效应有检查",
        "定性确认完整：保留时间 + 质谱特征",
      ],
      pitfalls: [
        "R² 高不代表定量可靠——线性范围外照样外推（见「结果可不可信」专题）",
        "峰面积积分基线设置不一致",
        "不检查基质效应直接定量",
      ],
      examples: null,
      checklist: [
        "标曲范围与检出限是否说明？",
        "内标/外标选择是否合理？",
        "定性确认是否包含质谱特征？",
        "积分参数是否统一并记录？",
        "基质效应是否检查？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传色谱图 + 定性/定量处理记录（含标曲与检出限）。",
        accept: "支持 PDF / XLSX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },

  /* ---- D 群 · 机理与计算（为什么会这样） ---- */
  {
    id: "D1", code: "D1", group: "D", name: "EPR / 自由基分析",
    type: "技能类", hours: "约 6–8 小时", tag: "机理 · 进阶",
    acceptance: "一张 EPR 谱图 + 自由基归属与 g 值/超精细分析说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "g 值与超精细裂分归属有文献对照",
        "捕获剂空白对照说明（排除本底）",
        "定量比较时注明仪器参数一致（增益、扫场、样品量）",
      ],
      pitfalls: [
        "把仪器本底当真实信号",
        "捕获剂空白对照缺失",
        "峰强比较时样品量/增益不一致",
      ],
      examples: null,
      checklist: [
        "是否做了捕获剂空白对照？",
        "g 值归属是否有文献依据？",
        "仪器参数是否记录？",
        "定量比较时条件是否一致？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传 EPR 谱图（含空白对照）+ 自由基归属说明。",
        accept: "支持 JPG / PNG / PDF / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "D2", code: "D2", group: "D", name: "计算化学",
    type: "技能类", hours: "约 8–12 小时", tag: "机理 · 进阶",
    acceptance: "一份计算任务说明（方法/基组/收敛判据）+ 关键结果与局限讨论",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "方法与基组选择有依据，注明计算级别",
        "几何优化收敛判据与收敛情况报告",
        "结果讨论含近似与误差来源",
      ],
      pitfalls: [
        "方法/基组与体系不匹配（如开壳层体系当闭壳层算）",
        "不检查收敛直接取能量",
        "泛函/基组选择没有依据",
      ],
      examples: null,
      checklist: [
        "方法与基组选择是否有依据？",
        "是否报告了收敛判据与结果？",
        "是否讨论了近似与局限？",
        "结果是否与实验/文献对照？",
      ],
      books: [
        { title: "Essentials of Computational Chemistry", desc: "Cramer：计算化学入门教材", img: "book-1.png" },
      ],
      papers: [],
      submission: {
        desc: "上传计算说明文档（方法/基组/收敛/结果/局限）。",
        accept: "支持 PDF / DOCX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },

  /* ---- E 群 · 过程模拟（放大后会怎样） ---- */
  {
    id: "E1", code: "E1", group: "E", name: "COMSOL 多物理场仿真",
    type: "技能类", hours: "约 8–12 小时", tag: "过程模拟 · 进阶",
    acceptance: "一个可运行的仿真模型 + 网格无关性验证 + 结果与边界条件说明",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "网格无关性验证：结果不随网格加密明显改变（见「结果可不可信」专题）",
        "边界条件/初始条件有物理依据",
        "求解器收敛，残差与迭代信息报告",
      ],
      pitfalls: [
        "网格不收敛直接出结果",
        "边界条件拍脑袋设定",
        "几何简化过度导致结果失真",
      ],
      examples: null,
      checklist: [
        "是否做了网格无关性验证？",
        "边界条件是否有物理依据？",
        "求解器是否收敛？",
        "几何简化是否说明？",
        "结果是否与解析解/文献对照？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传模型说明（含网格验证与边界条件）+ 结果图。",
        accept: "支持 PDF / ZIP（含模型文件），单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "E2", code: "E2", group: "E", name: "反应动力学",
    type: "技能类", hours: "约 5–8 小时", tag: "过程模拟 · 进阶",
    acceptance: "一份动力学拟合报告：模型选择、速率常数、置信区间",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "反应级数与模型选择有依据（实验设计与数据形态）",
        "速率常数拟合给出置信区间",
        "温度依赖性（Arrhenius）验证",
      ],
      pitfalls: [
        "用 R² 大小选模型——拟合得好不等于机理对（见「结果可不可信」专题）",
        "数据点过少强行拟合高维模型",
        "忽略传质限制当作本征动力学",
      ],
      examples: null,
      checklist: [
        "模型选择是否有依据？",
        "是否报告了置信区间？",
        "是否做了 Arrhenius 验证？",
        "传质限制是否排除或说明？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传动力学拟合报告（模型/参数/置信区间）。",
        accept: "支持 PDF / XLSX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },

  /* ---- F 群 · 环境影响与经济性（这个方案到底成不成立） ---- */
  {
    id: "F1", code: "F1", group: "F", name: "毒理学与风险评估",
    type: "技能类", hours: "约 5–8 小时", tag: "环境与经济 · 必修",
    acceptance: "一份风险表征简表：危害识别、暴露场景、风险商（RQ）",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "危害识别引用权威数据库并注明来源",
        "暴露场景假设写明（浓度、频次、人群/受体）",
        "风险商 RQ 计算过程完整，不确定度有说明",
      ],
      pitfalls: [
        "毒性数据不注明来源",
        "暴露浓度与场景脱节",
        "忽略不确定性，把单点当结论",
      ],
      examples: null,
      checklist: [
        "毒性数据是否注明来源？",
        "暴露场景假设是否写明？",
        "RQ 计算过程是否完整？",
        "不确定性是否说明？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传风险评估简表（危害识别/暴露场景/RQ 计算）。",
        accept: "支持 PDF / DOCX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "F2", code: "F2", group: "F", name: "生命周期评价 LCA",
    type: "技能类", hours: "约 8–12 小时", tag: "环境与经济 · 必修",
    acceptance: "一份 LCA 简表：目标与范围、清单、影响类别、解释",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "功能单位明确统一",
        "系统边界与取舍规则说明",
        "影响评价方法（如 ReCiPe）注明版本与数据库来源",
      ],
      pitfalls: [
        "功能单位不统一，比较失去意义",
        "数据库来源不明、不可追溯",
        "忽略不确定性分析，把结果当定论",
      ],
      examples: null,
      checklist: [
        "功能单位是否明确？",
        "系统边界与取舍规则是否说明？",
        "影响评价方法与数据库版本是否注明？",
        "是否做了不确定性/敏感性分析？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传 LCA 简表（目标与范围/清单/影响/解释）。",
        accept: "支持 PDF / XLSX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
  {
    id: "F3", code: "F3", group: "F", name: "技术经济分析 TEA",
    type: "技能类", hours: "约 6–8 小时", tag: "环境与经济 · 必修",
    acceptance: "一份 TEA 计算表：成本构成、敏感性分析、盈亏分析",
    detail: {
      videos: { must: [], optional: [] },
      groupStandard: [
        "成本构成与假设来源完整",
        "关键参数做敏感性分析",
        "与文献/同类技术比较时口径一致",
      ],
      pitfalls: [
        "假设拍脑袋且不做敏感性分析",
        "漏掉运营成本/折旧/维护",
        "口径不一致直接比较成本",
      ],
      examples: null,
      checklist: [
        "成本构成是否完整、假设是否有来源？",
        "是否做了敏感性分析？",
        "比较口径是否一致？",
        "是否给出盈亏/回报分析？",
      ],
      books: [],
      papers: [],
      submission: {
        desc: "上传 TEA 计算表（成本构成/敏感性/盈亏）。",
        accept: "支持 PDF / XLSX / ZIP，单个文件 ≤ 50MB",
      },
    },
  },
];
