// ============================================================
// Edge Function · validate-invite
// 邀请码校验（service role 查 invitations 表）
// 学生用邀请码注册必须经过本函数——invitations 表对匿名不可读（RLS）
// ============================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { code } = await req.json();
    const key = String(code || "").trim().toUpperCase();
    if (!key) {
      return new Response(JSON.stringify({ valid: false, message: "请输入邀请码" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("invitations")
      .select("id, role, used_by, used_at")
      .eq("code", key)
      .maybeSingle();

    if (error || !data) {
      return new Response(JSON.stringify({ valid: false, message: "邀请码无效——本平台仅供团队内部使用" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (data.used_by) {
      return new Response(JSON.stringify({ valid: false, message: "该邀请码已被使用，请联系管理员" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ valid: true, role: data.role, invitationId: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ valid: false, message: "校验服务异常，请稍后重试" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
