/* ============================================================
   Supabase 实现（云服务）
   接入步骤（见 README「接入 Supabase」）：
   1. .env 填写 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
   2. Supabase SQL Editor 按序执行 supabase/migrations/*.sql（0001-0004）
   3. 部署 Edge Function：validate-invite / ai-mentor / storage-signed
   4. VITE_USE_MOCK=false 即切换到此实现
   未接入的函数返回本地演示数据并告警，页面不崩
   ============================================================ */
import { createClient } from "@supabase/supabase-js";
import * as mock from "./mock";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* mock 模式下模块被 import 但不调用：用占位客户端避免顶层抛错；
   接入真实后端（VITE_USE_MOCK=false + .env 配置）后使用真实 URL */
export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key");
const FUNCTION_URL = `${url || "https://placeholder.supabase.co"}/functions/v1`;

const localFallback = (name, fn) => async (...args) => {
  console.warn(`[supabase] ${name} 云端接入中，本次返回本地演示数据`);
  return fn(...args);
};

const uid = async () => (await supabase.auth.getUser()).data.user?.id;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const toClientUser = (p) => ({
  id: p.id,
  username: p.username,
  email: p.username,
  name: p.real_name,
  role: p.role,
  grade: p.grade || "环境工程 · 新生",
  avatar: p.avatar_url || "avatar-user.png",
  mode: "formal",
  status: p.status || "pending",
  invite: p.invited_code,
  createdAt: p.created_at,
});

/* ---------- auth ---------- */
export async function login() {
  throw new Error("演示账号仅本地可用——云端请使用邮箱注册/登录");
}
export const loginAs = login;

export async function logout() {
  await supabase.auth.signOut();
  await delay(100);
}

/* 正式模式：邮箱注册（邀请码校验+用户创建全部走 Edge Function，service role 完成） */
export async function registerByEmail({ email, password, name, invite }) {
  const res = await fetch(`${FUNCTION_URL}/validate-invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ action: "register", invite, email, password, name }),
  });
  const result = await res.json();
  if (!result.valid) throw new Error(result.message || "注册失败");

  /* 函数已创建用户并写入档案；前端登录一次以建立会话（RLS 查询需要） */
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error("账号已创建，请用邮箱密码登录");
  if (!data.user) throw new Error("登录异常，请稍后再试");

  const p = await profileOf(data.user.id);
  return toClientUser(p || { ...result.user, username: result.user.email });
}

/* 正式模式：邮箱登录 */
export async function loginByEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message.includes("Invalid login") ? "邮箱或密码不正确" : error.message);
  }
  const p = await profileOf(data.user.id);
  if (!p) throw new Error("账号未完成注册流程，请联系管理员");
  return toClientUser(p);
}

export async function listFormalUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(toClientUser);
}

export async function reviewUser(id, action) {
  const status = action === "approve" ? "approved" : "rejected";
  const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
  if (error) throw new Error("审核失败：" + error.message);
  return { id, status };
}

/* ---------- 学生核心数据（初心堂） ---------- */
export async function getOathStatus() {
  const me = await uid();
  const { data } = await supabase
    .from("oath_signatures")
    .select("rules_agreed, signed_at")
    .eq("student_id", me)
    .maybeSingle();
  return { signed: !!data, rules: data?.rules_agreed || [] };
}
export async function signOath() {
  const me = await uid();
  const { error } = await supabase.from("oath_signatures").insert({ student_id: me, rules_agreed: [] });
  if (error) throw new Error(error.message);
  return { signed: true };
}

export async function getThoughtNotes() {
  const me = await uid();
  const { data } = await supabase
    .from("thought_notes")
    .select("*")
    .eq("student_id", me)
    .order("created_at", { ascending: false });
  return (data || []).map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    status: n.status === "reviewed" ? (n.feedback ? "已批阅" : "请再想想") : "待批阅",
    feedback: n.feedback || "",
    createdAt: (n.created_at || "").slice(0, 10),
  }));
}
export async function submitThoughtNote({ title, content }) {
  const me = await uid();
  const { error } = await supabase
    .from("thought_notes")
    .insert({ student_id: me, title, content, status: "pending" });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function getArchive() {
  const me = await uid();
  const { data } = await supabase
    .from("origin_archives")
    .select("content, sealed_at")
    .eq("student_id", me)
    .maybeSingle();
  return data
    ? { sealed: true, content: data.content, sealedAt: (data.sealed_at || "").slice(0, 10) }
    : { sealed: false, content: "" };
}
export async function sealArchive({ content }) {
  const me = await uid();
  const { error } = await supabase.from("origin_archives").insert({ student_id: me, content });
  if (error) throw new Error(error.message);
  return { sealed: true };
}

export async function getHardBoneRecords() {
  const me = await uid();
  const { data } = await supabase
    .from("hard_bone_records")
    .select("*")
    .eq("student_id", me)
    .order("created_at", { ascending: false });
  return (data || []).map((r) => ({
    id: r.id,
    outcome: r.outcome,
    content: r.content,
    date: (r.created_at || "").slice(0, 10),
  }));
}
export async function addHardBoneRecord({ outcome, content }) {
  const me = await uid();
  const { error } = await supabase.from("hard_bone_records").insert({ student_id: me, outcome, content });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function getCognitiveProfile() {
  const me = await uid();
  const { data } = await supabase
    .from("cognitive_profiles")
    .select("baseline, current, saved")
    .eq("student_id", me)
    .maybeSingle();
  return data || { baseline: null, current: null, saved: false };
}
export async function submitCognitiveAnswers(current) {
  const me = await uid();
  const { data: old } = await supabase
    .from("cognitive_profiles")
    .select("baseline")
    .eq("student_id", me)
    .maybeSingle();
  const { error } = await supabase.from("cognitive_profiles").upsert({
    student_id: me,
    baseline: old?.baseline || current,
    current,
    saved: true,
  });
  if (error) throw new Error(error.message);
  return { saved: true };
}

export async function getVoices() {
  const { data } = await supabase
    .from("voice_wall_quotes")
    .select("quote, scene, tag")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return (data || []).map((v) => ({ text: v.quote, scene: v.scene, tag: v.tag }));
}
export async function addVoice({ text, tag, scene }) {
  const { error } = await supabase.from("voice_wall_quotes").insert({
    quote: text,
    scene,
    tag,
    status: "reviewing",
    submitted_by: await uid(),
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}

/* ---------- 未接入：本地演示降级（页面不崩，控制台告警） ---------- */
export const redeemInvite = localFallback("redeemInvite", mock.redeemInvite);
export const getScientists = localFallback("getScientists", mock.getScientists);
export const getVideos = localFallback("getVideos", mock.getVideos);
export const saveVideo = localFallback("saveVideo", mock.saveVideo);
export const getPersons = localFallback("getPersons", mock.getPersons);
export const savePerson = localFallback("savePerson", mock.savePerson);
export const getModules = localFallback("getModules", mock.getModules);
export const getModule = localFallback("getModule", mock.getModule);
export const getLayer2Groups = localFallback("getLayer2Groups", mock.getLayer2Groups);
export const getLayer2Module = localFallback("getLayer2Module", mock.getLayer2Module);
export const getLayer3Direction = localFallback("getLayer3Direction", mock.getLayer3Direction);
export const getTrustTopics = localFallback("getTrustTopics", mock.getTrustTopics);
export const getLayer3Directions = localFallback("getLayer3Directions", mock.getLayer3Directions);
export const getProjects = localFallback("getProjects", mock.getProjects);
export const getProject = localFallback("getProject", mock.getProject);
export const getGraduation = localFallback("getGraduation", mock.getGraduation);
export const updateGraduation = localFallback("updateGraduation", mock.updateGraduation);
export const linkDeliverable = localFallback("linkDeliverable", mock.linkDeliverable);
export const getMembers = localFallback("getMembers", mock.getMembers);
export const getAlumni = localFallback("getAlumni", mock.getAlumni);
export const getReviewQueue = localFallback("getReviewQueue", mock.getReviewQueue);
export const getReview = localFallback("getReview", mock.getReview);
export const submitReview = localFallback("submitReview", mock.submitReview);
export const getStudentCognitiveProfiles = localFallback("getStudentCognitiveProfiles", mock.getStudentCognitiveProfiles);
export const getSkillPacks = localFallback("getSkillPacks", mock.getSkillPacks);
export const grantSkillPack = localFallback("grantSkillPack", mock.grantSkillPack);
export const getSkillGrants = localFallback("getSkillGrants", mock.getSkillGrants);
export const getMentorWeekStatus = localFallback("getMentorWeekStatus", mock.getMentorWeekStatus);

async function profileOf(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
