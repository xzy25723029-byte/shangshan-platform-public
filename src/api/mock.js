/* ============================================================
   Mock 数据层
   内存演示数据：登录/邀请码/四角色 + 各页面读写
   接入 Supabase 后整体替换为 api/supabase.js
   ============================================================ */

import { layer1Modules, moduleDemoContent, moduleBrief, layer2Groups, layer3Directions, trustTopics } from "../data/modules";
import { scientists, personLibrary } from "../data/people";
import { videoLibrary, BILIBILI_LIBRARY } from "../data/videos";
import { projects, graduation } from "../data/projects";
import { voices, members, alumni, reviewQueue, studentCognitiveProfiles } from "../data/community";
import { cognitiveAxes } from "../data/chuxintang";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/* ---------- 演示账号（四种角色） ---------- */
export const demoAccounts = [
  { id: "u1", username: "limingyuan", name: "李明远", role: "student", grade: "环境工程 2022级", avatar: "avatar-user.png" },
  { id: "u2", username: "zhangtao", name: "张涛", role: "mentor", grade: "环境工程学院 · 教授", avatar: "avatar-2.png" },
  { id: "u3", username: "content-admin", name: "内容管理员", role: "admin", grade: "平台运营", avatar: "avatar-5.png" },
  { id: "u4", username: "super-admin", name: "平台管理员", role: "super_admin", grade: "平台运营", avatar: "avatar-6.png" },
];

export const inviteCodes = {
  STU2026: "student",
  MEN2026: "mentor",
  ADM2026: "admin",
  SUP2026: "super_admin",
};

/* ---------- 内存数据库 ---------- */
const db = {
  users: demoAccounts.map((u) => ({ ...u })),
  oathSigned: false,
  thoughtNotes: [
    { id: "n1", title: "第一次上实验课后的想法", content: "老师说的『数据是什么就是什么』，比我想象的难做到。我看到一组『不好看』的数据时，第一反应是重测——但老师说先记录。", status: "通过", feedback: "记录真实的数据本身就是第一步，你已经开始做了。", createdAt: "2026-07-12" },
    { id: "n2", title: "关于选题的困惑", content: "大家都在做热点方向，但我发现自己更想搞清楚厂里出水荧光为什么波动——这算不算研究问题？", status: "请再想想", feedback: "这是一个很好的起点。试着去现场问一问：操作人员怎么解释这个波动？", createdAt: "2026-07-20" },
  ],
  archive: null,
  hardBones: [
    { id: "h1", outcome: "仍在啃", content: "EEM 散射扣除总是不干净，试了三种预处理组合，还是有余峰。", date: "2026-07-15" },
    { id: "h2", outcome: "啃下来了", content: "Origin 批量导出图表，查了三天文档，终于用模板一次搞定。", date: "2026-07-08" },
  ],
  cognitive: {
    baseline: { curiosity: 70, rigor: 58, critique: 40, hands: 62, express: 68, persist: 46 },
    current: { curiosity: 74, rigor: 62, critique: 52, hands: 66, express: 70, persist: 54 },
    saved: true,
  },
  videos: [...videoLibrary],
  persons: [...personLibrary],
  projects: JSON.parse(JSON.stringify(projects)),
  graduation: JSON.parse(JSON.stringify(graduation)),
  voices: [...voices],
  reviews: JSON.parse(JSON.stringify(reviewQueue)),
  skillGrants: [],
};

/* ---------- auth ---------- */
export async function login({ username, password: _password }) {
  await delay(300);
  const user = db.users.find((u) => u.username === username);
  if (!user) throw new Error("账号不存在，请使用下方演示账号登录");
  return { ...user };
}

export async function logout() {
  await delay(100);
  return true;
}

export async function redeemInvite(code) {
  await delay(300);
  const role = inviteCodes[code.trim().toUpperCase()];
  if (!role) throw new Error("邀请码无效，请核对后重试");
  // 演示：用邀请码直接以对应角色进入（真实实现中由 Edge Function 校验并创建账号）
  const demo = demoAccounts.find((u) => u.role === role);
  return { ...demo, invited: true };
}

/* ---------- 正式模式：手机号注册 / 登录（mock）
   演示环境验证码固定为 123456 并在返回中带出；接入真实短信服务后
   仅需替换 sendSmsCode 与校验逻辑，前端流程不变 ---------- */
const FORMAL_USERS_KEY = "ss_formal_users";
const readFormalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(FORMAL_USERS_KEY)) || [];
  } catch {
    return [];
  }
};
const writeFormalUsers = (list) => localStorage.setItem(FORMAL_USERS_KEY, JSON.stringify(list));

const smsStore = {}; // phone -> code

export async function sendSmsCode(phone) {
  await delay(400);
  if (!/^1\d{10}$/.test(phone)) throw new Error("请输入正确的 11 位手机号");
  const code = "123456"; // 演示环境固定验证码；正式接入短信服务后改为随机 6 位
  smsStore[phone] = code;
  return { demoCode: code }; // 演示环境直接返回验证码，便于体验完整流程
}

export async function registerByPhone({ phone, code, name }) {
  await delay(400);
  if (smsStore[phone] !== code) throw new Error("验证码不正确，请重新获取");
  const users = readFormalUsers();
  if (users.some((u) => u.phone === phone)) throw new Error("该手机号已注册，请直接登录");
  const user = {
    id: "f" + Date.now(),
    username: "p_" + phone,
    phone,
    name: (name || "").trim() || "新学员",
    role: "student",
    grade: "环境工程 · 新生",
    avatar: "avatar-user.png",
    mode: "formal",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  users.push(user);
  writeFormalUsers(users);
  return { ...user };
}

export async function loginByPhone({ phone, code }) {
  await delay(400);
  if (smsStore[phone] !== code) throw new Error("验证码不正确，请重新获取");
  const user = readFormalUsers().find((u) => u.phone === phone);
  if (!user) throw new Error("该手机号未注册，请先完成注册");
  return { ...user };
}

/* ---------- 初心堂 ---------- */
export async function getOathStatus() {
  await delay(150);
  return { signed: db.oathSigned, rules: [] };
}
export async function signOath() {
  await delay(300);
  db.oathSigned = true;
  return { signed: true };
}

export async function getThoughtNotes() {
  await delay(200);
  return [...db.thoughtNotes];
}
export async function submitThoughtNote({ title, content }) {
  await delay(300);
  const note = { id: "n" + Date.now(), title, content, status: "待批阅", feedback: "", createdAt: new Date().toISOString().slice(0, 10) };
  db.thoughtNotes.unshift(note);
  return note;
}

export async function getArchive() {
  await delay(150);
  return db.archive;
}
export async function sealArchive({ content }) {
  await delay(300);
  db.archive = { content, sealedAt: new Date().toISOString().slice(0, 10), returned: false };
  return db.archive;
}

export async function getHardBoneRecords() {
  await delay(200);
  return [...db.hardBones];
}
export async function addHardBoneRecord({ outcome, content }) {
  await delay(300);
  const record = { id: "h" + Date.now(), outcome, content, date: new Date().toISOString().slice(0, 10) };
  db.hardBones.unshift(record);
  return record;
}

export async function getCognitiveProfile() {
  await delay(150);
  return { axes: cognitiveAxes, ...db.cognitive };
}
export async function submitCognitiveAnswers(current) {
  await delay(300);
  db.cognitive.current = current;
  db.cognitive.saved = true;
  return db.cognitive;
}

export async function getScientists() {
  await delay(200);
  return [...scientists];
}

/* ---------- 内容 ---------- */
export async function getVideos() {
  await delay(200);
  return [...db.videos];
}
export async function saveVideo(video) {
  await delay(300);
  if (video.id) {
    const i = db.videos.findIndex((v) => v.id === video.id);
    if (i >= 0) db.videos[i] = { ...db.videos[i], ...video };
  } else {
    db.videos.unshift({ ...video, id: "v" + Date.now() });
  }
  return video;
}

export async function getPersons() {
  await delay(200);
  return [...db.persons];
}
export async function savePerson(person) {
  await delay(300);
  if (person.id) {
    const i = db.persons.findIndex((p) => p.id === person.id);
    if (i >= 0) db.persons[i] = { ...db.persons[i], ...person };
  } else {
    db.persons.unshift({ ...person, id: "p" + Date.now() });
  }
  return person;
}

/* 模块详情：演示内容（科技论文绘图）优先，其余模块用 B 站视频库填充 */
function withVideos(m) {
  const detail = m.id === "paper-figure" ? moduleDemoContent : moduleBrief(m);
  const lib = BILIBILI_LIBRARY[m.id];
  if (!lib) return { ...m, detail };
  const libVideos = {
    must: lib.filter((v) => v.level === "必看").map(({ level: _l, ...rest }) => rest),
    optional: lib.filter((v) => v.level === "需要时再看").map(({ level: _l, ...rest }) => rest),
  };
  // 演示内容有自己视频时保留（科技论文绘图），否则用 B 站库
  const videos = detail.videos.must.length ? detail.videos : libVideos;
  return { ...m, detail: { ...detail, videos } };
}

export async function getModules() {
  await delay(200);
  return layer1Modules.map(withVideos);
}
export async function getModule(id) {
  await delay(200);
  const m = layer1Modules.find((x) => x.id === id);
  if (!m) throw new Error("模块不存在");
  return withVideos(m);
}
export async function getLayer2Groups() {
  await delay(200);
  return layer2Groups;
}
export async function getTrustTopics() {
  await delay(150);
  return trustTopics;
}
export async function getLayer3Directions() {
  await delay(150);
  return layer3Directions;
}

/* ---------- 大创 ---------- */
export async function getProjects() {
  await delay(200);
  return db.projects.map(({ name, type, owner, start, status, abstract }) => ({ id: "p1", name, type, owner, start, status, abstract }));
}
export async function getProject(id) {
  await delay(200);
  return db.projects.find((p) => p.id === id);
}

/* ---------- 毕设 ---------- */
export async function getGraduation() {
  await delay(200);
  return db.graduation;
}
export async function updateGraduation(patch) {
  await delay(200);
  db.graduation = { ...db.graduation, ...patch };
  return db.graduation;
}
export async function linkDeliverable(directionId) {
  await delay(300);
  const d = { A: "论文写作", B: "专利撰写", C: "软件/程序开发", D: "硬件与感知" }[directionId];
  // 返回新对象（引用变化触发响应式更新）
  db.graduation = { ...db.graduation, linkedDeliverables: [`${d}（已关联）`] };
  return db.graduation;
}

/* ---------- 原话墙 ---------- */
export async function getVoices() {
  await delay(200);
  return [...db.voices];
}
export async function addVoice({ text, tag, scene }) {
  await delay(300);
  const v = { text, tag, scene, date: new Date().toISOString().slice(0, 10) };
  db.voices.unshift(v);
  return v;
}

/* ---------- 成员 / 师兄师姐 ---------- */
export async function getMembers() {
  await delay(200);
  return [...members];
}
export async function getAlumni() {
  await delay(200);
  return [...alumni];
}

/* ---------- 导师端 ---------- */
export async function getReviewQueue() {
  await delay(200);
  return [...db.reviews];
}
export async function getReview(id) {
  await delay(200);
  const r = db.reviews.find((x) => x.id === id);
  // 返回副本，保证引用变化触发响应式更新
  return r ? { ...r } : null;
}
export async function submitReview(id, { verdict, feedback }) {
  await delay(300);
  const r = db.reviews.find((x) => x.id === id);
  if (r) {
    r.status = verdict === "ok" ? "已通过" : "已请学生再想想";
    r.verdict = verdict;
    r.feedback = feedback;
  }
  // 返回副本，确保引用变化触发响应式更新
  return r ? { ...r } : null;
}

export async function getStudentCognitiveProfiles() {
  await delay(200);
  return studentCognitiveProfiles;
}

export const skillPacks = [
  { id: "sp1", name: "论文写作技能包", desc: "初稿完成后的结构检查与对照（不可用于生成）", require: "学生已完成完整初稿" },
  { id: "sp2", name: "专利撰写技能包", desc: "权利要求层次与保护范围检查", require: "学生已完成初稿" },
  { id: "sp3", name: "数据核查技能包", desc: "单位、区间、显著性检查", require: "学生已提交数据记录" },
];
export async function getSkillPacks() {
  await delay(150);
  return skillPacks;
}
export async function grantSkillPack({ student, packId, note }) {
  await delay(300);
  const pack = skillPacks.find((p) => p.id === packId);
  db.skillGrants.push({ student, packId, packName: pack?.name, note, source: "mentor-grant", grantedAt: new Date().toISOString() });
  return { ok: true, grants: [...db.skillGrants] };
}
export async function getSkillGrants() {
  await delay(150);
  return [...db.skillGrants];
}

export async function getMentorWeekStatus() {
  await delay(200);
  return {
    pendingReviews: db.reviews.filter((r) => r.status === "待批阅").length,
    newThoughtNotes: 3,
    skillPackGrants: db.skillGrants.length,
    studentsActive: 12,
    weekSummary: [
      { day: "周一", items: ["批阅 2 份思想札记", "确认 1 个开题方向"] },
      { day: "周二", items: ["实验室安全检查", "技能包授权 1 次"] },
      { day: "周三", items: ["大创中期材料预审"] },
      { day: "周四", items: ["毕设选题谈话 2 人次"] },
      { day: "周五", items: ["原话墙审核 3 条"] },
    ],
  };
}
