<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../api";
import { Check, X, Clock, UserCircle } from "@/icons";

/* 用户与角色 · 学员审核
   正式学员注册后需人工审核通过（内部使用）；不淘汰人，拒绝仅用于明显冒用 */

const users = ref([]);
const tab = ref("pending"); // pending | all

onMounted(load);

async function load() {
  users.value = await mockApi.listFormalUsers();
}

const pendingList = () => users.value.filter((u) => u.status === "pending");
const allList = () => users.value;

const statusLabel = { pending: "待审核", approved: "已通过", rejected: "已拒绝" };

async function review(u, action) {
  await mockApi.reviewUser(u.id, action);
  ElMessage({
    message: action === "approve" ? `已通过「${u.name}」的注册` : `已拒绝「${u.name}」的注册`,
    type: action === "approve" ? "success" : "info",
  });
  await load();
}
</script>

<template>
  <div class="ur-page">
    <div class="admin-head">
      <h1>用户与角色</h1>
      <p>正式学员注册审核——内部使用，人工确认，不淘汰人</p>
    </div>

    <div class="card ur-table">
      <div class="ur-toolbar">
        <div class="tabs">
          <router-link to="/admin/people">人物库</router-link>
          <router-link to="/admin/videos">视频资源</router-link>
          <router-link to="/admin/modules">模块配置</router-link>
          <button :class="{ active: tab === 'pending' }" @click="tab = 'pending'">
            待审核{{ pendingList().length ? `（${pendingList().length}）` : "" }}
          </button>
          <button :class="{ active: tab === 'all' }" @click="tab = 'all'">全部学员</button>
        </div>
      </div>

      <table>
        <thead>
          <tr><th>姓名</th><th>邮箱</th><th>邀请码</th><th>注册时间</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-if="(tab === 'pending' ? pendingList() : allList()).length === 0">
            <td colspan="6" class="ur-empty">
              <UserCircle :size="22" />{{ tab === "pending" ? "暂无待审核学员" : "暂无正式学员" }}
            </td>
          </tr>
          <tr v-for="u in (tab === 'pending' ? pendingList() : allList())" :key="u.id">
            <td><b>{{ u.name }}</b></td>
            <td>{{ u.email }}</td>
            <td><span class="pill">{{ u.invite }}</span></td>
            <td>{{ u.createdAt }}</td>
            <td>
              <span class="pill" :class="{ warn: u.status === 'pending', ok: u.status === 'approved' }">
                {{ statusLabel[u.status] }}
              </span>
            </td>
            <td>
              <template v-if="u.status === 'pending'">
                <button class="ur-approve" @click="review(u, 'approve')"><Check :size="13" />通过</button>
                <button class="ur-reject" @click="review(u, 'reject')"><X :size="13" />拒绝</button>
              </template>
              <span v-else class="ur-done"><Clock :size="12" />已处理</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="ur-note">说明：审核通过后学员可用邮箱登录进入平台；拒绝不设次数限制，学员可重新注册或联系管理员。</p>
    </div>
  </div>
</template>

<style scoped>
.admin-head { display: flex; align-items: baseline; gap: 20px; }
.admin-head h1 { font-family: var(--font-kai); color: #0f5a65; margin: 0; font-size: 37px; letter-spacing: 2px; }
.admin-head p { color: #728a93; font-size: 13px; }
.ur-table { padding: 14px; }
.ur-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.tabs { display: flex; gap: 8px; border-bottom: 1px solid #dce7ea; flex: 1; }
.tabs button, .tabs a { border: 0; background: transparent; padding: 8px 12px; font-size: 12px; color: #5e747e; text-decoration: none; }
.tabs .active { color: #0f7c87; border-bottom: 2px solid #0f7c87; font-weight: 700; }
.ur-table table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
.ur-table th { background: #f3f7f8; text-align: left; padding: 8px; color: #4a5f68; }
.ur-table td { padding: 9px 8px; border-bottom: 1px solid #e6edef; color: #3d5560; }
.pill { padding: 3px 10px; border-radius: 999px; font-size: 10px; background: #eef7f8; color: #14727d; }
.pill.warn { background: #f6efe6; color: #a8743f; }
.pill.ok { background: #e9f7f5; color: #16808a; }
.ur-approve, .ur-reject {
  display: inline-flex; align-items: center; gap: 3px;
  border: 1px solid #d3e9ec; border-radius: 999px;
  background: white; padding: 4px 11px; font-size: 11px; margin-right: 6px;
  transition: all 0.3s;
}
.ur-approve { color: #16808a; }
.ur-approve:hover { background: #16808a; color: #fff; border-color: #16808a; }
.ur-reject { color: #a8743f; }
.ur-reject:hover { background: #a8743f; color: #fff; border-color: #a8743f; }
.ur-done { display: inline-flex; align-items: center; gap: 4px; color: #9aacb3; font-size: 11px; }
.ur-empty { text-align: center; color: #82969e; padding: 30px 0 !important; }
.ur-empty svg { vertical-align: -5px; margin-right: 6px; }
.ur-note { margin: 12px 0 0; font-size: 11px; color: #82969e; }
</style>
