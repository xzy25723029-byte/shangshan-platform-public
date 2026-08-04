/* ============================================================
   Supabase 实现（待接入）
   接入步骤（见 README「接入 Supabase」）：
   1. .env 填写 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
   2. 在 Supabase 项目执行 supabase/migrations/*.sql
   3. 部署 Edge Function：ai-mentor / storage-signed
   4. 本文件按 api/mock.js 的函数签名逐一对接真实查询
   ============================================================ */

// 延迟到接入时安装 @supabase/supabase-js 并启用：
// import { createClient } from "@supabase/supabase-js";
// export const supabase = createClient(url, anonKey);

const notImplemented = (name) => {
  throw new Error(`[supabase-api] ${name} 尚未接入。当前使用 mock 数据（VITE_USE_MOCK=true）。`);
};

export const login = () => notImplemented("login");
export const logout = () => notImplemented("logout");
export const redeemInvite = () => notImplemented("redeemInvite");
