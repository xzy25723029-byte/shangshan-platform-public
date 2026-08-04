/* ============================================================
   API 适配层出口
   VITE_USE_MOCK=true（默认）→ mock 实现（内置演示数据，立即可跑）
   VITE_USE_MOCK=false → Supabase 实现（需在 .env 填 URL + anon key）
   页面只依赖本文件的导出，切换数据层不动 UI
   ============================================================ */

const useMock = (import.meta.env.VITE_USE_MOCK ?? "true") !== "false";

export { useMock };

export * as mockApi from "./mock";
export * as remoteApi from "./supabase";
