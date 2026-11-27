<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "../../../api";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import MilestoneTimeline from "../../../components/project/MilestoneTimeline.vue";
import {
  ClipboardText, Target, UserCircle, CalendarDots,
  Folder, FileText, Plus, PaperPlaneRight, CheckCircle, WarningCircle,
} from "@/icons";

/* 大创课题详情：摘要/成员/里程碑/倒计时待办（不催促、无红色逾期）/任务看板/资料/分工/复盘/笔记/导师建议/AI 助手 */

const route = useRoute();
const project = ref(null);
const todos = ref([]);
const chat = ref("");
const memberDialog = ref(false);
const milestoneDialog = ref(false);
const notesDialog = ref(false);

onMounted(async () => {
  project.value = await api.getProject(route.params.id);
  if (project.value) todos.value = project.value.todos.map((t) => ({ text: t, done: false }));
});

/* 新建任务：加入任务看板（演示数据内存态） */
async function addTask() {
  try {
    const { value } = await ElMessageBox.prompt("新任务名称", "新建任务", {
      confirmButtonText: "添加",
      cancelButtonText: "再想想",
      inputPlaceholder: "如：补充冬季工况实验",
      inputValidator: (v) => (v && v.trim() ? true : "任务名称不能为空"),
    });
    project.value.tasks.push({ name: value.trim(), owner: "avatar-user.png", date: "今天" });
    ElMessage({ message: "任务已加入看板", type: "success" });
  } catch {
    /* 用户取消 */
  }
}

/* AI 建议：把问题填入输入框，由学生自己决定问什么 */
function askSuggestion(s) {
  chat.value = s;
}
</script>

<template>
  <div v-if="project" class="project-page">
    <div class="project-title" style="background-image: url(/assets/hero-water-city.png)">
      <span>大创中心　›　课题详情</span>
      <h1>{{ project.name }} <em>{{ project.status }}</em></h1>
      <div class="project-meta">
        <span><ClipboardText :size="14" />课题类型　{{ project.type }}</span>
        <span><Target :size="14" />所属领域　{{ project.field }}</span>
        <span><UserCircle :size="14" />负责人　{{ project.owner }}</span>
        <span><CalendarDots :size="14" />立项日期　{{ project.start }}</span>
      </div>
    </div>

    <div class="project-grid">
      <div class="project-main">
        <div class="summary-row">
          <div class="card">
            <SectionTitle title="课题摘要" action="查看完整摘要" />
            <p>{{ project.abstract }}</p>
          </div>
          <div class="card">
            <SectionTitle title="成员（{{ project.members.length }}）" action="管理成员" @action-click="memberDialog = true" />
            <div class="member-strip">
              <div v-for="m in project.members" :key="m.name">
                <img :src="`/assets/${m.avatar}`" :alt="m.name" />
                <b>{{ m.name }}</b><span>{{ m.role }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <SectionTitle title="课题里程碑" action="查看里程碑详情" @action-click="milestoneDialog = true" />
          <MilestoneTimeline :items="project.milestones" />
        </div>

        <div class="project-widgets">
          <div class="card">
            <SectionTitle title="倒计时与待办" note="只提醒，不催促" />
            <div class="countdown">
              <b>{{ project.countdown.days }}</b>天 <b>{{ project.countdown.hours }}</b>小时 <b>{{ project.countdown.minutes }}</b>分钟
              <small>距中期检查</small>
            </div>
            <label v-for="t in todos" :key="t.text">
              <input v-model="t.done" type="checkbox" />{{ t.text }}
            </label>
          </div>
          <div class="card">
            <SectionTitle title="任务看板" />
            <div v-for="task in project.tasks" :key="task.name" class="task-row">
              <span>{{ task.name }}</span>
              <img :src="`/assets/${task.owner}`" alt="负责人" />
              <small>{{ task.date }}</small>
            </div>
            <button class="text-link" @click="addTask"><Plus :size="14" />新建任务</button>
          </div>
          <div class="card">
            <SectionTitle title="资料与文件" />
            <div v-for="f in project.files" :key="f" class="file-row"><Folder :size="15" />{{ f }}</div>
          </div>
        </div>

        <div class="card">
          <SectionTitle title="成员分工" />
          <div class="member-list">
            <div v-for="m in project.members" :key="m.name">
              <img :src="`/assets/${m.avatar}`" :alt="m.name" />
              <span><b>{{ m.name }}</b><small>{{ m.role }}</small></span>
              <p>{{ m.duty }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <SectionTitle title="复盘记录" />
          <div class="retro">
            <div class="retro-ok">
              <h4><CheckCircle :size="15" />顺利的部分</h4>
              <p v-for="s in project.retro.ok" :key="s">{{ s }}</p>
            </div>
            <div class="retro-warm">
              <h4><WarningCircle :size="15" />请再想想的部分</h4>
              <p v-for="s in project.retro.stuck" :key="s">{{ s }}</p>
            </div>
          </div>
        </div>
      </div>

      <aside>
        <div class="card">
          <SectionTitle title="课题笔记" action="全部笔记" @action-click="notesDialog = true" />
          <div v-for="n in project.notes" :key="n" class="note-row"><FileText :size="15" />{{ n }}</div>
        </div>
        <div class="card">
          <SectionTitle title="导师建议" />
          <div class="mentor">
            <img :src="`/assets/${project.mentor.avatar}`" :alt="project.mentor.name" />
            <span><b>{{ project.mentor.name }}</b><small>{{ project.mentor.unit }}</small></span>
          </div>
          <p>{{ project.mentor.advice }}</p>
        </div>
        <div class="card">
          <SectionTitle title="AI 助手" />
          <p class="ai-greet">{{ project.ai.greeting }}</p>
          <div class="suggestions">
            <button v-for="s in project.ai.suggestions" :key="s" @click="askSuggestion(s)">{{ s }}</button>
          </div>
          <label class="chat-input">
            <input v-model="chat" placeholder="输入你想问的问题…" />
            <PaperPlaneRight :size="16" />
          </label>
        </div>
      </aside>
    </div>

    <!-- 成员管理弹窗（查看成员与分工，不设排名） -->
    <el-dialog v-model="memberDialog" title="成员与分工" width="560px">
      <div class="dlg-member-list">
        <div v-for="m in project.members" :key="m.name" class="dlg-member">
          <img :src="`/assets/${m.avatar}`" :alt="m.name" />
          <span><b>{{ m.name }}</b><small>{{ m.role }}</small></span>
          <p>{{ m.duty }}</p>
        </div>
      </div>
      <p class="dlg-note">成员名录不展示成果排名，只展示分工与方向。</p>
    </el-dialog>

    <!-- 里程碑详情弹窗 -->
    <el-dialog v-model="milestoneDialog" title="里程碑详情" width="520px">
      <div class="dlg-milestones">
        <div v-for="m in project.milestones" :key="m.name" :class="m.state">
          <span>{{ m.state === "done" ? "✓" : m.state === "current" ? "·" : "○" }}</span>
          <b>{{ m.name }}</b>
          <small>{{ m.date }}</small>
        </div>
      </div>
      <p class="dlg-note">里程碑不是关卡——它们只记录课题走过与将要走的路。</p>
    </el-dialog>

    <!-- 笔记弹窗 -->
    <el-dialog v-model="notesDialog" title="课题笔记" width="480px">
      <div v-for="n in project.notes" :key="n" class="dlg-note-row"><FileText :size="15" />{{ n }}</div>
      <p class="dlg-note">笔记正在整理中，更多记录会在推进中补充。</p>
    </el-dialog>
  </div>
</template>

<style scoped>
.project-title {
  min-height: 106px;
  padding: 10px 18px;
  background-size: 60% 100%;
  background-position: right;
  background-repeat: no-repeat;
}
.project-title > span { font-size: 11px; color: #80949b; }
.project-title h1 { font-size: 23px; margin: 12px 0 8px; }
.project-title h1 em { font-style: normal; font-size: 11px; color: #168678; background: #e7f6f2; border-radius: 12px; padding: 4px 9px; }
.project-meta { display: flex; gap: 25px; font-size: 11px; color: #3d5560; }
.project-meta span { display: flex; gap: 5px; align-items: center; }
.project-grid { display: grid; grid-template-columns: 1fr 315px; gap: 12px; }
.summary-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 10px; }
.summary-row > .card, .project-main > .card, .project-widgets > .card, .project-grid > aside > .card { padding: 14px; }
.summary-row p { font-size: 11px; line-height: 1.7; color: #4a5f68; }
.member-strip { display: flex; gap: 14px; margin-top: 8px; }
.member-strip img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
.member-strip b, .member-strip span { display: block; font-size: 10px; text-align: center; }
.member-strip span { color: #879aa1; }
.project-widgets { display: grid; grid-template-columns: 0.8fr 1.2fr 1fr; gap: 10px; margin: 10px 0; }
.countdown { text-align: center; margin: 12px 0; }
.countdown b { font-size: 24px; color: #0e6670; }
.countdown small { display: block; font-size: 10px; color: #8a9ba2; margin-top: 2px; }
.project-widgets label { display: flex; align-items: center; gap: 7px; font-size: 11px; margin: 9px 0; color: #3d5560; }
.project-widgets input { accent-color: var(--teal); margin: 0; }
.task-row, .file-row, .note-row { display: flex; align-items: center; gap: 7px; border-bottom: 1px solid #e7eef0; padding: 8px 0; font-size: 11px; color: #3d5560; }
.task-row span { flex: 1; }
.task-row img { width: 24px; height: 24px; border-radius: 50%; }
.task-row small { color: #80939b; }
.member-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.member-list > div { display: grid; grid-template-columns: 42px 110px 1fr; align-items: center; gap: 7px; }
.member-list img, .mentor img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.member-list b, .member-list small { display: block; }
.member-list small { color: #2b8e98; font-size: 10px; }
.member-list p { font-size: 10px; color: #5e747e; }
.retro { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.retro > div { padding: 13px; background: #f7fafb; border-radius: 8px; }
.retro h4 { display: flex; align-items: center; gap: 5px; margin: 0 0 8px; font-size: 13px; }
.retro-ok h4 { color: #16848a; }
.retro-warm h4 { color: #7c5a30; }
.retro-warm { background: #faf6ec; }
.retro p { margin: 3px 0; font-size: 11px; color: #4a5f68; line-height: 1.6; }
.project-grid aside { display: grid; gap: 10px; align-content: start; }
.mentor { display: flex; align-items: center; gap: 8px; }
.mentor b, .mentor small { display: block; }
.mentor b { font-size: 12px; }
.mentor small { font-size: 10px; color: #7a8d95; }
.project-grid aside p { font-size: 11px; line-height: 1.6; color: #4a5f68; }
.ai-greet { font-size: 11px; }
.suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.suggestions button { font-size: 10px; padding: 7px; border: 1px solid #cee2e6; background: white; border-radius: 6px; color: #245260; }
.chat-input { display: flex; align-items: center; gap: 7px; border: 1px solid #dce7ea; border-radius: 8px; padding: 0 11px; background: white; height: 38px; margin-top: 8px; }
.chat-input input { border: 0; outline: 0; background: transparent; flex: 1; font-size: 11px; }
.dlg-member-list { display: grid; gap: 8px; max-height: 320px; overflow-y: auto; }
.dlg-member { display: grid; grid-template-columns: 40px 140px 1fr; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid #e0eaec; border-radius: 8px; }
.dlg-member img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
.dlg-member b, .dlg-member small { display: block; }
.dlg-member small { font-size: 10px; color: #7a8d95; }
.dlg-member p { margin: 0; font-size: 11px; color: #4a5f68; }
.dlg-milestones { display: grid; gap: 6px; }
.dlg-milestones > div { display: grid; grid-template-columns: 30px 1fr auto; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; background: #f7fafb; }
.dlg-milestones .done { background: var(--state-ok-bg); }
.dlg-milestones .current { background: #eef7f8; }
.dlg-milestones span { font-weight: 700; color: #16848a; }
.dlg-milestones b { font-size: 12px; color: #3d5560; }
.dlg-milestones small { font-size: 10px; color: #7a8d95; }
.dlg-note-row { display: flex; align-items: center; gap: 8px; padding: 9px 4px; border-bottom: 1px solid #e7eef0; font-size: 12px; color: #3d5560; }
.dlg-note { margin: 12px 0 0; font-size: 11px; color: #8a9ba2; }
</style>
