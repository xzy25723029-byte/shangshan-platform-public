/* 验证 chatWithModel 的请求 payload 合规（mock fetch，不真实外呼） */
const captured = [];
globalThis.fetch = async (url, opts) => {
  captured.push({ url, body: JSON.parse(opts.body), auth: opts.headers.Authorization });
  return new Response(JSON.stringify({ choices: [{ message: { content: "连接成功" } }] }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const { chatWithModel } = await import("../src/utils/aiMentor.js");

let pass = 0, fail = 0;
const check = (name, ok, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  -- " + extra : ""}`); ok ? pass++ : fail++; };

const model = { baseUrl: "https://api.siliconflow.cn/v1", apiKey: "sk-test", model: "deepseek-ai/DeepSeek-V3" };

// 1. 历史含内部角色 ai/user → 应映射为 assistant/user
await chatWithModel(model, "socratic", [
  { role: "user", text: "你好" },
  { role: "ai", text: "你觉得呢？" },
]);
const roles = captured[0].body.messages.map((m) => m.role);
check("角色映射：ai→assistant / user→user / system→system", JSON.stringify(roles) === JSON.stringify(["system", "user", "assistant"]), roles.join(","));
check("请求 URL 为 /chat/completions", captured[0].url === "https://api.siliconflow.cn/v1/chat/completions");
check("携带 Bearer Key", captured[0].auth === "Bearer sk-test");
check("普通模型含 temperature 与 max_tokens", captured[0].body.temperature === 0.6 && captured[0].body.max_tokens === 800);
check("含苏格拉底系统提示词", captured[0].body.messages[0].content.includes("只反问"));

// 2. 推理模型（R1）不应含 temperature
await chatWithModel({ ...model, model: "deepseek-ai/DeepSeek-R1" }, "assistant", [{ role: "user", text: "分析一下" }]);
check("推理模型省略 temperature", captured[1].body.temperature === undefined && captured[1].body.max_tokens === 800, JSON.stringify(captured[1].body.temperature));

// 3. 失败时抛出含详情错误（模拟 400）
globalThis.fetch = async () => new Response(JSON.stringify({ code: 20015, message: "Input tag" }), { status: 400, headers: { "Content-Type": "application/json" } });
try {
  await chatWithModel(model, "assistant", [{ role: "user", text: "hi" }]);
  check("400 错误抛出", false, "未抛出");
} catch (e) {
  check("400 错误抛出且含详情", e.message.includes("400") && e.message.includes("20015"), e.message.slice(0, 60));
}

console.log(`\n===== payload 验证：${pass}/${pass + fail} 通过 =====`);
process.exit(fail ? 1 : 0);
