<script setup>
import { onMounted, ref } from "vue";
import { api } from "../../api";
import ProgressContent from "../../components/project/ProgressContent.vue";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const records = ref([]);
const loading = ref(true);
const loadError = ref(false);
const selectedId = ref("");
const reply = ref("");
const saving = ref(false);
const savedId = ref("");
const saveError = ref("");
const dateTime = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" });

async function loadRecords() {
  loading.value = true;
  loadError.value = false;
  try {
    records.value = await api.getMentorProjectProgress(auth.user);
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

function startFeedback(record) {
  selectedId.value = record.id;
  reply.value = record.feedback || "";
  saveError.value = "";
  savedId.value = "";
}

async function submitFeedback(record) {
  if (saving.value) return;
  saveError.value = "";
  if (!reply.value.trim()) {
    saveError.value = "请填写反馈内容。";
    return;
  }
  saving.value = true;
  try {
    const updated = await api.submitProjectFeedback(record.id, reply.value.trim(), auth.user);
    record.feedback = updated.feedback;
    record.feedbackAt = updated.feedbackAt;
    savedId.value = record.id;
    selectedId.value = "";
  } catch {
    saveError.value = "反馈保存失败，内容已保留，请重试。";
  } finally {
    saving.value = false;
  }
}

onMounted(loadRecords);
</script>

<template>
  <div class="mentor-projects">
    <div class="page-banner">
      <div>
        <h1>大创管理</h1>
        <p>查看指导课题的中期进展并给出反馈</p>
      </div>
    </div>

    <button type="button" class="text-link" :disabled="loading || saving || !!selectedId" @click="loadRecords">刷新中期进展</button>
    <p v-if="loading" role="status">正在读取中期进展…</p>
    <p v-else-if="loadError" role="alert">暂时无法读取中期进展，请刷新后重试。</p>
    <p v-else-if="!records.length">目前没有学生提交中期进展。</p>

    <article v-for="record in records" :key="record.id" class="card progress-review">
      <header>
        <div>
          <h2>{{ record.projectName || "大创课题" }}</h2>
          <p>{{ record.studentName || "学生" }} · <time :datetime="record.submittedAt">{{ dateTime.format(new Date(record.submittedAt)) }}</time></p>
        </div>
        <span>{{ record.feedback ? "已反馈" : "待反馈" }}</span>
      </header>
      <ProgressContent :record="record" />
      <form v-if="selectedId === record.id" @submit.prevent="submitFeedback(record)">
        <label>导师反馈
          <textarea v-model="reply" required maxlength="3000" rows="4" :disabled="saving" />
        </label>
        <div class="feedback-actions">
          <button class="btn" type="submit" :disabled="saving">{{ saving ? "提交中…" : "提交导师反馈" }}</button>
          <button class="btn ghost" type="button" :disabled="saving" @click="selectedId = ''">取消</button>
        </div>
        <p v-if="saveError" role="alert">{{ saveError }}</p>
      </form>
      <template v-else>
        <p v-if="record.feedback" class="saved-feedback">{{ record.feedback }}</p>
        <button type="button" class="btn ghost" :disabled="!!selectedId || loading" @click="startFeedback(record)">{{ record.feedback ? "编辑反馈" : "填写反馈" }}</button>
      </template>
      <p v-if="savedId === record.id" role="status">导师反馈已提交。</p>
    </article>
  </div>
</template>

<style scoped>
.progress-review { padding: 16px; margin-top: 12px; }
.progress-review header { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; }
.progress-review h2 { margin: 0; font-size: 17px; }
.progress-review header p { margin: 4px 0 0; }
.progress-review header span { color: var(--teal); }
.progress-review textarea {
  display: block; width: 100%; margin: 6px 0 10px; padding: 8px 10px;
  border: 1px solid var(--line-strong); border-radius: 6px; resize: vertical; font: inherit;
}
.feedback-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.saved-feedback { background: var(--teal-pale); padding: 10px; border-radius: 6px; white-space: pre-wrap; overflow-wrap: anywhere; }
</style>
