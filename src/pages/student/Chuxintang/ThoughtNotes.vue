<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../../api";
import SectionTitle from "../../../components/common/SectionTitle.vue";
import { PaperPlaneRight } from "@/icons";

/* 思想札记：中文输入、提交、导师批阅
   批阅结果只有「通过 / 请再想想」，同尺寸同权重 */

const notes = ref([]);
const title = ref("");
const content = ref("");
const submitting = ref(false);

async function load() {
  notes.value = await mockApi.getThoughtNotes();
}
onMounted(load);

async function submit() {
  if (!title.value.trim() || !content.value.trim()) {
    ElMessage({ message: "标题和内容都要写——只看诚实，不看文采", type: "warning" });
    return;
  }
  submitting.value = true;
  await mockApi.submitThoughtNote({ title: title.value.trim(), content: content.value.trim() });
  title.value = "";
  content.value = "";
  submitting.value = false;
  ElMessage({ message: "已提交，等待导师批阅", type: "success" });
  load();
}
</script>

<template>
  <div class="tn-page">
    <div class="page-banner">
      <div>
        <h1>思想札记</h1>
        <p>记录真实困惑与判断——只看诚实，不看文采</p>
      </div>
    </div>

    <div class="tn-layout">
      <div class="tn-main">
        <div class="card tn-write">
          <SectionTitle title="写一篇札记" note="困惑、判断、改变，都可以写" />
          <label class="tn-field">
            <span>标题</span>
            <input v-model="title" placeholder="给这篇札记一个标题" />
          </label>
          <label class="tn-field">
            <span>内容</span>
            <textarea v-model="content" placeholder="写下你真实的想法。写得朴素没关系，写得漂亮也没关系——这里只要求诚实。" />
          </label>
          <button class="btn tn-submit" :disabled="submitting" @click="submit">
            <PaperPlaneRight :size="15" />提交札记
          </button>
        </div>

        <div class="tn-history">
          <SectionTitle title="我的札记" />
          <div class="tn-grid">
            <article v-for="n in notes" :key="n.id" class="card tn-note">
              <header>
                <h3>{{ n.title }}</h3>
                <span class="verdict-tag" :class="n.status === '通过' ? 'ok' : 'warm'">
                  {{ n.status === "请再想想" ? "请再想想" : n.status }}
                </span>
              </header>
              <p class="tn-body">{{ n.content }}</p>
              <div v-if="n.feedback" class="tn-feedback">
                <b>导师的话</b>
                <p>{{ n.feedback }}</p>
              </div>
              <footer>{{ n.createdAt }}</footer>
            </article>
          </div>
        </div>
      </div>

      <aside class="tn-side card">
        <SectionTitle title="札记的规矩" />
        <ul>
          <li>只要求诚实，不要求文采</li>
          <li>导师批阅只有两种结果：「通过」与「请再想想」</li>
          <li>「请再想想」不是失败，是另一种看法</li>
          <li>札记不参与任何排名与比较</li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.tn-layout { display: grid; grid-template-columns: 1fr 280px; gap: 14px; }
.tn-write, .tn-history { padding: 18px 22px; }
.tn-write { margin-bottom: 14px; }
.tn-field { display: grid; gap: 6px; margin-top: 12px; }
.tn-field span { font-size: 12px; font-weight: 700; color: #44616b; }
.tn-field input {
  height: 40px; border: 1px solid #dce8eb; border-radius: 8px; padding: 0 12px;
}
.tn-field textarea {
  height: 140px; resize: none;
  border: 1px solid #dce8eb; border-radius: 8px; padding: 12px;
  font-size: 12px; line-height: 1.8;
}
.tn-submit { margin-top: 12px; }
.tn-grid { display: grid; gap: 12px; margin-top: 12px; }
.tn-note { padding: 16px 18px; }
.tn-note header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.tn-note h3 { margin: 0; font-size: 14px; color: var(--ink); }
.tn-body { margin: 10px 0; font-size: 12px; line-height: 1.8; color: #4a5f68; white-space: pre-wrap; }
.tn-feedback { padding: 10px 12px; background: #eef7f8; border-radius: 8px; }
.tn-feedback b { font-size: 11px; color: #14727d; }
.tn-feedback p { margin: 4px 0 0; font-size: 11px; line-height: 1.7; color: #245260; }
.tn-note footer { margin-top: 10px; font-size: 10px; color: #8a9ba2; text-align: right; }
.tn-side { padding: 16px; align-self: start; }
.tn-side ul { margin: 10px 0 0; padding-left: 16px; font-size: 11px; line-height: 2.2; color: #5e747e; }
</style>
