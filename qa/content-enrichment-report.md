# 内容丰富化 · 验收报告

- 日期：2026-08-05
- 检查：`npm run full-check` 7 步流水线，**退出码 0**

## 一、B 站视频接入（已完成 ✅）

12 个学习板块、29 条真实 B 站视频（BV 号经检索确认），数据源 `src/data/videos.js`：

| 板块 | 视频 | 必看 | 需要时再看 |
|---|---|---|---|
| 实验室安全 | 3 | 八章完整版、应急处置 | 化学实验基础 |
| 文献检索 | 3 | 1 小时学会（PubMed/WOS/知网/万方） | 5 集合集、实战 |
| Zotero | 3 | 快速入门 | 详细教学、Zotero7 |
| 科技论文绘图 | 3 | Origin 研一必学 | 柱状图、180 集系统课 |
| 三维绘图 Blender | 3 | 3D 反应釜 | 双膜多孔、离心管 |
| 论文撰写 | 3 | 斯坦福 SCI 写作 | 博士全过程、28 集 |
| Git | 3 | Git&GitHub 入门 | 武沛齐、59 课 |
| XRD（A1） | 2 | JADE 系列合集 | 数据处理原理 |
| XPS（A2） | 2 | N1s 分峰实操 | 制样准备 |
| EIS（B3） | 2 | ZSimpWin 拟合 | 普林斯顿电路模型 |
| EEM（C1） | 2 | Python PARAFAC | R 语言 staRdom |
| COMSOL（E1） | 2 | 保姆级第一期 | 中科科英合集 |
| LCA（F2） | 2 | OpenLCA 全流程 | Process 建模 |

前端效果：
- 「模块详情 → 软件怎么用」视频行**点击直接跳转 B 站**（新窗口，带外链图标）
- 管理端「视频资源」页同数据源展示
- 科技论文绘图演示模块的视频已替换为真实 Origin 教程

## 二、真实人物图片（基础设施就绪 ⚠️ 需手动放入）

- 网络环境无法自动抓取外部图片（Wikipedia / 百度百科 / Bing 均不可达）
- 已完成：`people.js` 每条科学家记录支持 `photo` 字段；前端「科学家精神馆」自动优先显示真实照片（圆形头像）；`public/assets/people/` 目录已建
- 放置方法见 `docs/assets-guide.md`（8 位人物推荐文件名 + 版权注意）

## 三、AI 生图（脚本就绪 ⚠️ 需 OpenRouter Key）

- `scripts/generate-assets.sh`：一键生成 3 张水科技素材（汇流线理念插画 / 浸润渐变背景 / 科研实训插画），提示词按平台视觉规范设计
- 需要 `export OPENROUTER_API_KEY=...` 后运行（`openrouter.ai/keys` 免费申请）

## 四、自动检查结果

| 环节 | 结果 |
|---|---|
| lint | 0 问题 |
| build | ✓ |
| qa 功能断言 | 92/92 |
| payload 验证 | 7/7 |
| matrix 全角色矩阵 | 142/142 |
| audit 使用体验 | 0 问题 |
| deep 深度回归 | 18/18 |

## 五、遗留事项

1. 真实人物照片：手动放入 `public/assets/people/`（或提供可达的图片源）
2. AI 生图：提供 OpenRouter Key 后运行 `bash scripts/generate-assets.sh`
3. 专利入门、Tafel 等板块视频待补充（检索未获可靠 BV）
