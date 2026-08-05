/* ============================================================
   AI 导师「水问」核心
   - 本地反问引导（第0层苏格拉底 / 第1层起助教）
   - 多模型自定义配置（本地存储，Key 只存本机浏览器）
   - 真实大模型调用（OpenAI 兼容接口，硅基流动等平台）
   安全红线：学生 API Key 只存 localStorage，不上传服务器；
   平台密钥走 Edge Function（supabase/functions/ai-mentor）
   ============================================================ */

import { aiMentor } from "../data/chuxintang";

/* ================= 模式与本地引导 ================= */

/* 根据路由判断当前模式 */
export function aiModeFor(path) {
  const chuxintang = [
    "/student/home",
    "/student/triple-core",
    "/student/guiding-principles",
    "/student/first-lesson",
    "/student/energy-flow",
    "/student/strategy-research",
    "/student/oath",
    "/student/thought-notes",
    "/student/origin-archive",
    "/student/scientist-hall",
    "/student/hard-bone",
    "/student/cognitive-profile",
    "/student/ai-mentor",
  ];
  if (chuxintang.some((p) => path.startsWith(p))) return "socratic";
  return "assistant";
}

export const aiModeLabel = {
  socratic: "苏格拉底反问模式",
  assistant: "助教模式 · 只帮不代",
};

let openerIndex = 0;

export function aiReply(mode, message) {
  const text = String(message || "").trim();
  if (mode === "socratic") {
    const hit = aiMentor.socratic.find((s) => text.includes(s.keyword));
    if (hit) return hit.reply;
    const opener = aiMentor.socraticOpeners[openerIndex % aiMentor.socraticOpeners.length];
    openerIndex += 1;
    return opener;
  }
  if (text.includes("步骤") || text.includes("怎么开始") || text.includes("从哪")) {
    return "先做最小的一步：把问题拆成「能测 / 能查 / 能问」三类，先处理能查的那一类。需要的话我可以帮你把这一步写得更具体——但具体操作要你自己来。";
  }
  if (text.includes("检查") || text.includes("看看")) {
    return "可以。请把你要检查的内容贴过来，我会帮你检查：单位是否一致、区间选取是否有依据、结论是否超出了数据能支持的范围。我不会替你改写。";
  }
  if (text.includes("追问") || text.includes("质疑")) {
    return "一个常用的追问：这个结论换了数据来源还成立吗？如果成立，缺的是什么？如果不成立，缺的又是什么？";
  }
  return aiMentor.assistant.hint;
}

export const aiQuickPrompts = {
  socratic: ["我该从哪开始？", "怎么判断这是不是真问题？", "我卡住了，怎么办？"],
  assistant: ["给我一个起步步骤", "帮我检查这段表述", "帮我追问这个结论"],
};

/* ================= 多模型配置管理 ================= */

export const MODEL_STORAGE = "ss_ai_models";
export const ACTIVE_MODEL_STORAGE = "ss_ai_active_model";

/* 内置推荐模型清单（硅基流动优选；模型 ID 取自官方模型广场，2026-08 确认可用） */
export const RECOMMENDED_MODELS = [
  {
    id: "sf-deepseek-v3",
    name: "DeepSeek-V3",
    provider: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "deepseek-ai/DeepSeek-V3",
    note: "通用主力 · 推理与表达均衡",
    scene: "日常问答 / 写作 / 检索帮助",
    builtin: true,
  },
  {
    id: "sf-deepseek-r1",
    name: "DeepSeek-R1",
    provider: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "deepseek-ai/DeepSeek-R1",
    note: "深度推理 · 适合科研思辨与追问链",
    scene: "机理分析 / 啃硬骨头 / 设计实验",
    builtin: true,
  },
  {
    id: "sf-qwen72b",
    name: "Qwen2.5-72B",
    provider: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "Qwen/Qwen2.5-72B-Instruct",
    note: "综合能力强 · 中文表现好",
    scene: "中文文献 / 长文本理解",
    builtin: true,
  },
  {
    id: "sf-qwen7b",
    name: "Qwen2.5-7B（免费）",
    provider: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "Qwen/Qwen2.5-7B-Instruct",
    note: "轻量免费 · 日常够用",
    scene: "轻量快速问答 / 起步体验",
    builtin: true,
  },
  {
    id: "openai-gpt4o-mini",
    name: "GPT-4o-mini",
    provider: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    note: "海外备选",
    scene: "需要国际模型时",
    builtin: true,
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek 官方",
    provider: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    note: "官方直连备选",
    scene: "官方渠道",
    builtin: true,
  },
];

/* 平台预设（添加自定义模型时选择，自动填 Base URL） */
export const MODEL_PROVIDERS = [
  { name: "硅基流动（推荐）", baseUrl: "https://api.siliconflow.cn/v1", site: "https://cloud.siliconflow.cn", tip: "一个 Key 用全部模型 · 有免费模型 · OpenAI 兼容" },
  { name: "OpenAI", baseUrl: "https://api.openai.com/v1" },
  { name: "DeepSeek 官方", baseUrl: "https://api.deepseek.com/v1" },
  { name: "阿里云百炼", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
  { name: "Moonshot Kimi", baseUrl: "https://api.moonshot.cn/v1" },
  { name: "自定义", baseUrl: "" },
];

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 隐私模式等场景忽略 */
  }
}

/* 加载模型列表：未配置过 → 返回内置推荐（无 Key）；配置过 → 存储的完整列表 */
export function loadModels() {
  const raw = safeGet(MODEL_STORAGE);
  if (!raw) {
    return RECOMMENDED_MODELS.map((m) => ({ ...m, apiKey: "", enabled: true }));
  }
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || !list.length) {
      return RECOMMENDED_MODELS.map((m) => ({ ...m, apiKey: "", enabled: true }));
    }
    return list;
  } catch {
    return RECOMMENDED_MODELS.map((m) => ({ ...m, apiKey: "", enabled: true }));
  }
}

export function saveModels(models) {
  safeSet(MODEL_STORAGE, JSON.stringify(models));
}

export function enabledModels() {
  return loadModels().filter((m) => m.enabled && m.apiKey);
}

export function getActiveModel() {
  const models = loadModels();
  const id = safeGet(ACTIVE_MODEL_STORAGE);
  const hit = models.find((m) => m.id === id && m.enabled && m.apiKey);
  return hit || enabledModels()[0] || null;
}

export function setActiveModel(id) {
  safeSet(ACTIVE_MODEL_STORAGE, id);
}

export function hasAnyKey() {
  return enabledModels().length > 0;
}

/* 场景推荐：帮用户选合适的模型 */
export function recommendFor(keyword) {
  const kw = String(keyword || "");
  if (/推理|机理|为什么|设计|分析|追问|硬骨头/.test(kw)) {
    return { id: "sf-deepseek-r1", name: "DeepSeek-R1", reason: "深度推理模型，适合机理分析与追问链" };
  }
  if (/免费|轻量|快|起步/.test(kw)) {
    return { id: "sf-qwen7b", name: "Qwen2.5-7B（免费）", reason: "免费轻量，日常问答够用" };
  }
  return { id: "sf-deepseek-v3", name: "DeepSeek-V3", reason: "通用主力，推理与写作均衡" };
}

/* ================= 真实大模型调用 ================= */

const SYSTEM_PROMPTS = {
  socratic: `你是「水问」——上善若水·本科生科研素养实训平台第0层的 AI 导师。
铁律：
1. 只反问，不下结论；每一句回复都以一个问题结束。
2. 不替学生写任何东西，不提供方案、答案或判断对错。
3. 不评价学生，不施加压力；可以温和地追问系统边界、依据来源、最小验证。
4. 用中文回答，语气平静克制，一次只追问一个点。`,
  assistant: `你是「水问」——上善若水·本科生科研素养实训平台第1层起的 AI 助教。
铁律：
1. 可以给步骤提示、帮检查表述、帮追问思路、指出信息缺口。
2. 绝不代做、代写、代生成结论；不直接产出论文段落或完整答案。
3. 不判对错、不打分；优先引导「先做最小的一步验证」。
4. 用中文回答，简短具体。`,
};

/* 调用 OpenAI 兼容接口（硅基流动 / OpenAI / DeepSeek 等均兼容） */
export async function chatWithModel(model, mode, history) {
  const base = String(model.baseUrl || "").replace(/\/+$/, "");
  if (!base || !model.apiKey || !model.model) {
    throw new Error("模型配置不完整");
  }
  // 平台内部消息角色为 ai/user，OpenAI 兼容接口只接受 system/user/assistant
  const toApiRole = (role) => (role === "ai" ? "assistant" : role === "system" ? "system" : "user");
  // 推理模型（如 DeepSeek-R1）不支持 temperature 参数，需省略
  const isReasoning = /R1|reason|thinking/i.test(model.model);
  const payload = {
    model: model.model,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.assistant },
      ...(history || []).slice(-12).map((m) => ({ role: toApiRole(m.role), content: String(m.text || "") })),
    ],
    max_tokens: 800,
  };
  if (!isReasoning) payload.temperature = 0.6;
  const resp = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${model.apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}${detail ? "：" + detail.slice(0, 120) : ""}`);
  }
  const data = await resp.json();
  const reply = data.choices?.[0]?.message?.content?.trim() || "";
  if (!reply) throw new Error("模型返回为空");
  return reply;
}

/* 测试连接：发送一条最小消息验证 Key 与模型可用 */
export async function testModelConnection(model) {
  return chatWithModel(model, "assistant", [{ role: "user", text: "你好，请只回复：连接成功" }]);
}
