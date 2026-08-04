// ============================================================
// Edge Function · storage-signed
// 文件上传：签发预签名 PUT URL，前端直传 COS / Supabase Storage
// 上传完成后由本函数（service role）写入 files 表与审计日志
// 前端只持有匿名 key，无法直接获得服务端权限
// ============================================================
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // service role 仅存在于 Edge Function 环境
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const authHeader = req.headers.get("Authorization") || "";
    // 校验调用者身份（学生/导师/管理员）
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "未登录" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { fileName, mimeType, folder = "uploads" } = await req.json();
    const safeName = fileName.replace(/[^\w.\-\u4e00-\u9fa5]/g, "_");
    const objectPath = `${folder}/${user.id}/${Date.now()}_${safeName}`;

    // Supabase Storage 预签名上传（腾讯云 COS 接入时替换为 COS 预签名）
    const { data, error } = await supabase.storage
      .from("shangshan-files")
      .createSignedUploadUrl(objectPath, { contentType: mimeType || "application/octet-stream" });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 记录文件元数据（service role 写入，绕开 RLS）
    await supabase.from("files").insert({
      owner_id: user.id,
      storage_path: objectPath,
      mime_type: mimeType || null,
    });
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "file.signed_upload",
      entity: "files",
      detail: { path: objectPath },
    });

    return new Response(
      JSON.stringify({ signedUrl: data.signedUrl, token: data.token, path: objectPath }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
