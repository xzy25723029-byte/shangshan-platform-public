// ============================================================
// Edge Function · ai-mentor
// AI 导师「水问」代理：LLM 密钥只放函数环境变量，前端不接触平台密钥
// 模式（由前端传入）：
//   socratic  —— 苏格拉底反问（第0层初心堂）：只反问，不下结论，不判对错
//   assistant —— 助教模式（第1层起）：给步骤提示、帮检查、帮追问，不代做
// 学生自带 API Key 只存其浏览器 localStorage，不走本函数
// ============================================================
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

function buildMessages(mode, history) {
  return [
    { role: "system", content: SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.assistant },
    ...(history || []).slice(-12), // 只取最近 12 条，控制上下文
  ];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { mode, messages } = await req.json();
    const apiKey = Deno.env.get("AI_MENTOR_API_KEY"); // 平台密钥（函数环境变量）
    const baseUrl = Deno.env.get("AI_MENTOR_BASE_URL") || "https://api.openai.com/v1";
    const model = Deno.env.get("AI_MENTOR_MODEL") || "gpt-4o-mini";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI_MENTOR_API_KEY 未配置" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: buildMessages(mode, messages),
        temperature: 0.6,
        max_tokens: 500,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: `上游返回 ${resp.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
