/* ============================================================
   原话墙 / 成员名录 / 师兄师姐 / 批阅队列 数据
   ============================================================ */

/* ---------- 原话墙（原型移植；保留真实语气，不加工成「正确问题」） ---------- */
export const voices = [
  { text: "我们厂的废水水质波动太大了，尤其是雨季，处理系统经常『跟不上』，总排放不稳定，环保压力很大。", tag: "生产运营 · 水处理", date: "2024-05-18", scene: "生产运营" },
  { text: "碳排放核算口径太复杂，供应链数据很难收集，报告做起来费时费力，也不一定对。", tag: "政策与合规 · 双碳管理", date: "2024-05-17", scene: "政策与合规" },
  { text: "设备数据分散在不同系统里，想做分析要人工导出再整理，效率太低。", tag: "数字化转型 · 数据中台", date: "2024-05-16", scene: "数字化转型" },
  { text: "客户越来越关注产品的环境足迹，但我们缺乏系统的核算能力。", tag: "市场与销售 · 绿色产品", date: "2024-05-15", scene: "市场与销售" },
  { text: "新材料性能不错，但工艺放大到产线后良率下降，成本也上去了。", tag: "技术研发 · 材料应用", date: "2024-05-14", scene: "技术研发" },
  { text: "中小企业做 ESG 报告成本太高，缺少可参考的模板和工具。", tag: "政策与合规 · ESG 管理", date: "2024-05-13", scene: "政策与合规" },
  { text: "污泥处置费用越来越高，资源化路径不清晰，希望能有更经济可行的利用方式。", tag: "生产运营 · 固废处置", date: "2024-05-12", scene: "生产运营" },
  { text: "希望有更轻量的在线监测方案，数据准确、维护简单。", tag: "技术研发 · 在线监测", date: "2024-05-11", scene: "技术研发" },
];

export const voiceTopics = ["水质波动", "数据孤岛", "ESG披露", "成本上升", "碳管理难", "合规压力", "资源化利用", "工程化落地", "工艺优化"];
export const voiceScenes = ["全部场景", "生产运营", "技术研发", "质量管理", "市场与销售", "政策与合规", "供应链管理", "数字化转型", "环保与可持续"];

/* ---------- 成员名录（技能标签仅展示系统授予/导师认证/同伴致谢来源） ---------- */
export const members = [
  { name: "王雨桐", grade: "2022级", direction: "水环境治理", avatar: "avatar-1.png", tags: [{ label: "数据可视化", source: "导师认证" }] },
  { name: "周景行", grade: "2023级", direction: "GIS 应用", avatar: "avatar-2.png", tags: [{ label: "实验设计", source: "同伴致谢" }] },
  { name: "赵语涵", grade: "2022级", direction: "微生物方向", avatar: "avatar-3.png", tags: [{ label: "文献综述", source: "系统授予" }, { label: "写作表达", source: "导师认证" }] },
  { name: "林思妍", grade: "2022级", direction: "水质分析", avatar: "avatar-4.png", tags: [{ label: "光谱分析", source: "导师认证" }] },
  { name: "陈子墨", grade: "2023级", direction: "数据可视化", avatar: "avatar-5.png", tags: [{ label: "编程工具", source: "同伴致谢" }] },
  { name: "何明远", grade: "2021级", direction: "工程设计", avatar: "avatar-6.png", tags: [{ label: "设备运维", source: "系统授予" }] },
];

/* ---------- 师兄师姐 · 传承（不按论文、奖项排序） ---------- */
export const alumni = [
  { name: "林思妍", grade: "环境科学 2022级", direction: "水质分析方向", avatar: "avatar-1.png", firstThing: "独立完成一次水样的浊度测定", stuck: "实验数据波动大，卡了 2 个月", directionHow: "在一次课程项目中发现自己最关注的问题，想解决它", now: "在环保领域从事数据分析和技术支持", growth: [
    { t: "大一", d: "第一次独立完成水样检测，感受到科研的乐趣" },
    { t: "大二上", d: "在实验中遇到数据波动，开始系统学习统计方法" },
    { t: "大二下", d: "参与课题组项目，深入了解水质分析流程" },
    { t: "大三上", d: "确定方向，专注于水质分析与方法优化" },
    { t: "现在", d: "在环保领域做水质监测技术支持" },
  ] },
  { name: "陈子墨", grade: "环境工程 2023级", direction: "数据可视化方向", avatar: "avatar-2.png", firstThing: "用 Excel 做出第一个数据可视化图表", stuck: "不会编程，卡了 3 个月", directionHow: "发现自己对「把数据讲清楚」这件事最有耐心", now: "在做科研绘图与数据服务", growth: [
    { t: "大一", d: "第一个数据图表，丑但诚实" },
    { t: "大二上", d: "开始学 Python，白天看不懂晚上接着看" },
    { t: "大二下", d: "给课题组做了第一版绘图模板" },
    { t: "大三上", d: "把绘图流程写成可复用的工具" },
    { t: "现在", d: "帮更多人把数据讲清楚" },
  ] },
  { name: "王雨桐", grade: "环境工程 2022级", direction: "水环境治理方向", avatar: "avatar-3.png", firstThing: "参与小组完成一份调研报告", stuck: "文献太多看不完，卡了 1 个月", directionHow: "调研中亲眼看到问题，想解决问题", now: "在推进自己的大创课题", growth: [
    { t: "大一", d: "第一次调研，学会了问问题" },
    { t: "大二上", d: "梳理文献方法，找到自己的节奏" },
    { t: "大二下", d: "进入课题组，参与 AO 工艺实验" },
    { t: "大三上", d: "立了大创课题，开始带小团队" },
    { t: "现在", d: "在推进自己的大创课题" },
  ] },
  { name: "吴昊然", grade: "环境工程 2019级", direction: "工艺工程方向", avatar: "avatar-4.png", firstThing: "独立完成一次小试实验的全流程", stuck: "实验失败很多次，卡了 4 个月", directionHow: "在一次次失败后确定了「工艺放大」这个方向", now: "在环保企业做工艺工程师", growth: [
    { t: "大一", d: "第一次小试实验，全流程走通" },
    { t: "大二", d: "失败 4 个月，学会记录每一次失败" },
    { t: "大三", d: "把失败记录整理成实验手册" },
    { t: "大四", d: "毕设做工艺放大，第一次发现课本与现场的差距" },
    { t: "现在", d: "在环保企业做工艺工程师" },
  ] },
];

/* ---------- 往届优秀案例（师兄师姐真实交付物：连接专业技能与具体项目） ---------- */
export const excellentCases = [
  {
    title: "校园河湖水质数字孪生监测——基于 EEM + PARAFAC 的溯源初探",
    author: "林思妍",
    year: "2025",
    type: "大创课题",
    skill2project: "从第2层 C1 三维荧光模块出发：先学会组分提取（PARAFAC），再把方法搬到一个真实水样集合上，回答了「这条河荧光峰是谁带来的」",
    outcome: "校级大创结题优秀；方法被课题组沿用为常规溯源手段之一",
  },
  {
    title: "电化学高级氧化降解染料废水的能量流物质流核算",
    author: "陈子墨",
    year: "2024",
    type: "大创课题",
    skill2project: "B 群电化学模块 + 能量流物质流六步推演：把「电流多大会不划算」算成了一笔账，而不是只跑出降解率",
    outcome: "结题答辩获推荐；核算表格成为同组后续项目的参照模板",
  },
  {
    title: "某污水处理厂雨季溢流风险的桌面评估（毕设）",
    author: "王雨桐",
    year: "2025",
    type: "毕业设计",
    skill2project: "把第2层 F 群（LCA/TEA）与调研原话墙结合：不追求机制深度，先回答「厂方最担心的雨季到底会不会溢、代价多大」",
    outcome: "论文被评为院级优秀；结论被厂方采纳为运行策略参考",
  },
];

/* ---------- 批阅队列（导师端） ---------- */
export const reviewQueue = [
  { id: "r1", student: "张雨桐", task: "微塑料迁移机制研究", time: "2024-05-20 14:32", avatar: "avatar-1.png", status: "待批阅", type: "研究报告", attachments: ["采样点布设图.png", "原始数据表.xlsx", "实验记录本扫描件.pdf"], note: "导师您好，已按照要求补充了丰水期的数据，并完善了讨论部分关于影响因素的分析。", content: {
    title: "城市地表水中微塑料的迁移行为与归趋机制研究",
    sections: [
      { h: "1. 研究背景与意义", p: "微塑料是指粒径小于 5mm 的塑料颗粒，因其广泛分布于水体环境，可能对生态系统及人类健康造成潜在影响。本研究聚焦城市地表水中的迁移行为与归趋机制。" },
      { h: "2. 研究方法", sub: "2.1 采样点布设", p: "选取城市河流上游、中游、下游及入湖口共 4 个采样点，分别在枯水期与丰水期进行采样。" },
      { h: "", sub: "2.2 分析方法", p: "采用显微红外光谱对样品进行定性定量分析，结合粒径分布与形态统计，评估微塑料的组成特征与空间分布差异。" },
      { h: "3. 结果与讨论", p: "结果表明，微塑料浓度在下游及入湖口显著升高，丰水期整体浓度高于枯水期。" },
    ],
    figure: "paper-figure.png",
  } },
  { id: "r2", student: "陈昊然", task: "溶解氧在线监测", time: "2024-05-19 10:05", avatar: "avatar-2.png", status: "待批阅", type: "技术方案" },
  { id: "r3", student: "李思涵", task: "膜通量衰减规律", time: "2024-05-19 09:21", avatar: "avatar-3.png", status: "待批阅", type: "实验报告" },
  { id: "r4", student: "王子墨", task: "湿地植物筛选", time: "2024-05-18 16:47", avatar: "avatar-4.png", status: "待批阅", type: "调研报告" },
  { id: "r5", student: "刘一鸣", task: "传感器选型", time: "2024-05-18 15:12", avatar: "avatar-5.png", status: "待批阅", type: "技术方案" },
  { id: "r6", student: "赵婉宁", task: "用水需求预测", time: "2024-05-18 11:33", avatar: "avatar-6.png", status: "待批阅", type: "数据分析" },
];

/* ---------- 导师端学生认知侧写（六轴，仅供查看） ---------- */
export const studentCognitiveProfiles = [
  { student: "张雨桐", avatar: "avatar-1.png", scores: { curiosity: 78, rigor: 66, critique: 52, hands: 60, express: 74, persist: 58 }, baseline: { curiosity: 70, rigor: 58, critique: 40, hands: 62, express: 68, persist: 46 } },
  { student: "陈昊然", avatar: "avatar-2.png", scores: { curiosity: 62, rigor: 80, critique: 70, hands: 72, express: 48, persist: 76 }, baseline: { curiosity: 55, rigor: 70, critique: 62, hands: 66, express: 40, persist: 60 } },
  { student: "李思涵", avatar: "avatar-3.png", scores: { curiosity: 84, rigor: 58, critique: 66, hands: 44, express: 70, persist: 62 }, baseline: { curiosity: 76, rigor: 50, critique: 54, hands: 40, express: 66, persist: 52 } },
];
