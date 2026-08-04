/* ============================================================
   AI 导师「水问」回复引擎（本地反问引导）
   第0层（初心堂）：苏格拉底反问——只反问，不下结论，不判对错
   第1层起：助教模式——给步骤提示、帮检查、帮追问，不代做
   学生 API Key 只存 localStorage，不上传服务器；
   平台密钥走 Edge Function（supabase/functions/ai-mentor）
   ============================================================ */

import { aiMentor } from "../data/chuxintang";

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
  if (path.startsWith("/student/layer1")) return "assistant";
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
  // 助教模式：给步骤提示 / 帮检查 / 帮追问，不代做
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

export const aiKeyStorage = "ss_ai_key";

export function getLocalAiKey() {
  try {
    return localStorage.getItem(aiKeyStorage) || "";
  } catch {
    return "";
  }
}
