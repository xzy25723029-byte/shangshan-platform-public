<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "../../../api";
import { useAuthStore } from "../../../stores/auth";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import ProgressContent from "../../../components/project/ProgressContent.vue";

const props = defineProps({ projectId: { type: String, required: true } });
const auth = useAuthStore();
const summary = ref("");
const challenges = ref("");
const nextSteps = ref("");
const records = ref([]);
const loading = ref(false);
const saving = ref(false);
const loadError = ref("");
const submitError = ref("");
const submitted = ref(false);
const opened = ref("");
const dateTime = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" });
let submissionId;

watch([summary, challenges, nextSteps], () => { submissionId = undefined; });

async function loadRecords() {
  loading.value = true;
  loadError.value = "";
  try {
    records.value = await api.getProjectProgress(props.projectId, auth.user);
  } catch {
    loadError.value = "暂时无法读取进展记录，请重试。";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (saving.value || loading.value) return;
  submitted.value = false;
  submitError.value = "";
  if (!summary.value.trim() || !nextSteps.value.trim()) {
    submitError.value = "请填写已完成工作和下一步计划。";
    return;
  }

  saving.value = true;
  try {
    submissionId ??= window.crypto.randomUUID();
    const entry = await api.submitProjectProgress(props.projectId, {
      id: submissionId, summary: summary.value.trim(), challenges: challenges.value.trim(), nextSteps: nextSteps.value.trim(),
    }, auth.user);
    submissionId = undefined;
    records.value = [entry, ...records.value.filter((item) => item.id !== entry.id)];
    summary.value = challenges.value = nextSteps.value = "";
    opened.value = entry.id;
    submitted.value = true;
  } catch {
    submitError.value = "未能确认提交结果，内容已保留，请重试。";
  } finally {
    saving.value = false;
  }
}

onMounted(loadRecords);
</script>

<template>
  <section class="card progress-card" aria-label="中期进展">
    <SectionTitle title="中期进展" />
    <form aria-label="提交中期进展" @submit.prevent="submit">
      <fieldset :disabled="saving || loading">
        <label>已完成工作
          <textarea v-model="summary" required maxlength="3000" rows="3" />
        </label>
        <label>遇到的问题 <small>选填</small>
          <textarea v-model="challenges" maxlength="3000" rows="2" />
        </label>
        <label>下一步计划
          <textarea v-model="nextSteps" required maxlength="3000" rows="3" />
        </label>
        <button class="btn" type="submit">{{ saving ? "提交中…" : "提交中期进展" }}</button>
      </fieldset>
      <p v-if="submitError" role="alert" class="progress-message">{{ submitError }}</p>
      <p v-if="submitted" role="status" class="progress-message">中期进展已提交。</p>
    </form>

    <div class="history-header">
      <h4>历史记录</h4>
      <button class="text-link" type="button" :disabled="loading || saving" @click="loadRecords">刷新记录和反馈</button>
    </div>
    <p v-if="loadError" role="alert" class="progress-message">{{ loadError }}</p>
    <p v-else-if="loading" role="status" class="progress-message">正在读取记录…</p>
    <p v-else-if="!records.length" class="progress-message">还没有中期进展记录。</p>

    <details v-for="record in records" :key="record.id" :open="opened === record.id">
      <summary>
        <time :datetime="record.submittedAt">{{ dateTime.format(new Date(record.submittedAt)) }}</time>
        <span class="progress-state" :class="{ 'has-feedback': record.feedback }">{{ record.feedback ? "已反馈" : "待反馈" }}</span>
      </summary>
      <ProgressContent :record="record" />
      <div class="mentor-feedback">
        <h5>导师反馈</h5>
        <time v-if="record.feedbackAt" :datetime="record.feedbackAt">{{ dateTime.format(new Date(record.feedbackAt)) }}</time>
        <p>{{ record.feedback || "指导导师还未反馈。" }}</p>
      </div>
    </details>
  </section>
</template>

<style scoped>
.progress-card { padding: 18px; margin-bottom: 12px; color: var(--ink); }
fieldset { border: 0; padding: 0; margin: 8px 0 0; min-width: 0; }
label { display: block; margin-bottom: 12px; font-weight: 600; }
label small { color: var(--muted); font-weight: 400; }
textarea {
  display: block; width: 100%; margin-top: 5px; padding: 8px 10px;
  border: 1px solid var(--line-strong); border-radius: 6px; resize: vertical; font: inherit; font-weight: 400;
}
.history-header { margin-top: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; }
.history-header h4 { margin: 0; }
.progress-message { margin: 8px 0 0; }
details { margin-top: 8px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; overflow-wrap: anywhere; }
summary { cursor: pointer; }
.progress-state { margin-inline-start: 8px; background: #f5f1e8; color: #795b31; border-radius: 12px; padding: 2px 8px; font-size: 12px; }
.has-feedback { background: var(--teal-soft); color: var(--teal); }
.mentor-feedback { padding: 10px; background: var(--teal-pale); border-radius: 6px; }
.mentor-feedback h5 { margin: 0 0 4px; font-size: 14px; }
.mentor-feedback time { font-size: 12px; }
.mentor-feedback p { margin: 4px 0 0; white-space: pre-wrap; }
</style>
