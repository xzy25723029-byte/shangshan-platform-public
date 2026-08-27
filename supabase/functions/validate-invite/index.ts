// ============================================================
// Edge Function · validate-invite
// 邀请码校验 + 注册（service role）
// action=verify  —— 校验邀请码
// action=register —— 校验邀请码 → 创建用户(email_confirm) → 写入 profiles(pending) → 标记邀请码已用
// invitations 表对匿名不可读（RLS），一切走本函数
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
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const body = await req.json();
    const key = String(body.invite || "").trim().toUpperCase();
    if (!key) return json({ valid: false, message: "请输入邀请码" });

    const { data: inv, error: invErr } = await supabase
      .from("invitations")
      .select("id, role, used_by")
      .eq("code", key)
      .maybeSingle();
    if (invErr || !inv) return json({ valid: false, message: "邀请码无效——本平台仅供团队内部使用" });
    if (inv.used_by) return json({ valid: false, message: "该邀请码已被使用，请联系管理员" });

    if (body.action === "verify") {
      return json({ valid: true, role: inv.role });
    }

    /* ---- action=register ---- */
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ valid: false, message: "请输入正确的邮箱地址" });
    if (!body.password || String(body.password).length < 6) return json({ valid: false, message: "密码至少 6 位" });

    const { data: user, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password: body.password,
      email_confirm: true,
      user_metadata: { real_name: String(body.name || "").trim() },
    });
    if (createErr) {
      return json({ valid: false, message: createErr.message.includes("already") ? "该邮箱已注册，请直接登录" : "注册失败：" + createErr.message });
    }
    if (!user) return json({ valid: false, message: "注册失败，请稍后重试" });
    const created = (user as any).user ?? user; // 新版 supabase-js 返回 {user:{...}}
    const uid = String(created?.id || "");
    if (!uid) return json({ valid: false, message: "注册失败：用户标识异常", detail: JSON.stringify(user).slice(0, 80) });

    const { error: profErr } = await supabase.from("profiles").insert({
      id: uid,
      username: email,
      real_name: String(body.name || "").trim() || email.split("@")[0],
      role: inv.role,
      grade: inv.role === "student" ? "环境工程 · 新生" : inv.role === "mentor" ? "环境工程学院 · 教授" : "平台运营",
      avatar_url: "avatar-user.png",
      invited_code: key,
      status: inv.role === "student" ? "pending" : "approved", // 学生需审核；管理/导师为预置通道
    });
    if (profErr) {
      return json({ valid: false, message: "档案写入失败：" + profErr.message });
    }

    const { error: invErr2 } = await supabase.from("invitations").update({ used_by: uid, used_at: new Date().toISOString() }).eq("id", inv.id);
    if (invErr2) return json({ valid: false, message: "邀请码标记失败：" + invErr2.message });

    return json({
      valid: true,
      user: {
        id: uid,
        email,
        name: String(body.name || "").trim() || email.split("@")[0],
        role: inv.role,
        grade: inv.role === "student" ? "环境工程 · 新生" : inv.role === "mentor" ? "环境工程学院 · 教授" : "平台运营",
        status: inv.role === "student" ? "pending" : "approved",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ valid: false, message: "校验服务异常，请稍后重试", detail: msg }, 500);
  }
});
