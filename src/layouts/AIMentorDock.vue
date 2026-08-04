<script setup>
import { computed, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { PaperPlaneRight, Gear } from "@/icons";
import { useAppStore } from "../stores/app";
import { aiModeFor, aiModeLabel, aiReply, aiQuickPrompts, getLocalAiKey } from "../utils/aiMentor";

const app = useAppStore();
const route = useRoute();

const mode = computed(() => aiModeFor(route.path));
const messages = ref([]);
const input = ref("");
const listRef = ref(null);

const hasKey = computed(() => Boolean(getLocalAiKey()));

const initialGreeting = computed(() =>
  mode.value === "socratic"
    ? "我是「水问」，初心堂里只反问、不下结论的伙伴。你可以把正在想的问题抛给我——我会先问回去。"
    : "我是「水问」，现在是助教模式：可以给步骤提示、帮你检查、帮你追问，但不会替你写、替你算。",
);

watch(mode, () => {
  messages.value = [{ role: "ai", text: initialGreeting.value }];
  app.dockOpen = false;
});

function scrollToBottom() {
  nextTick(() => {
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight;
  });
}

function push(role, text) {
  messages.value.push({ role, text });
  scrollToBottom();
}

function send(text) {
  const msg = String(text ?? input.value).trim();
  if (!msg) return;
  input.value = "";
  push("user", msg);
  setTimeout(() => push("ai", aiReply(mode.value, msg)), 350);
}

function sendQuick(q) {
  send(q);
}
</script>

<template>
  <button class="ai-fab" aria-label="打开 AI 导师" @click="app.toggleDock()">
    <img src="/assets/water-drop.png" alt="" />
    <span>AI导师</span>
  </button>

  <Transition name="dock">
    <div v-if="app.dockOpen" class="ai-panel" role="dialog" aria-label="AI 导师 水问">
      <header class="ai-head">
        <div class="ai-title">
          <img src="/assets/water-drop.png" alt="水滴" />
          <div>
            <strong>水问 · AI 导师</strong>
            <span>{{ aiModeLabel[mode] }}</span>
          </div>
        </div>
        <router-link to="/student/ai-settings" class="ai-gear" aria-label="AI 导师设置"><Gear :size="18" /></router-link>
      </header>

      <div ref="listRef" class="ai-messages">
        <div v-for="(m, i) in messages" :key="i" class="ai-msg" :class="m.role">
          <span>{{ m.text }}</span>
        </div>
      </div>

      <div class="ai-quick">
        <button v-for="q in aiQuickPrompts[mode]" :key="q" @click="sendQuick(q)">{{ q }}</button>
      </div>

      <footer class="ai-input">
        <input
          v-model="input"
          placeholder="输入你的问题…"
          @keyup.enter="send()"
        />
        <button @click="send()" aria-label="发送"><PaperPlaneRight :size="18" /></button>
      </footer>

      <p v-if="!hasKey" class="ai-key-note">
        未配置 API Key：当前为本地反问引导。可在「AI 导师设置」中配置自己的密钥（仅保存在本机浏览器，不上传服务器）。
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.ai-fab {
  display: grid;
  place-items: center;
}
.ai-panel {
  position: fixed;
  right: 26px;
  bottom: 124px;
  width: 380px;
  max-height: 560px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #d3e6ea;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(26, 95, 107, 0.18);
  z-index: 20;
  overflow: hidden;
}
.ai-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(120deg, #eaf6f8, #f7fcfd);
  border-bottom: 1px solid #dfebee;
}
.ai-title { display: flex; align-items: center; gap: 10px; }
.ai-title img { width: 40px; height: 40px; object-fit: contain; }
.ai-title strong { display: block; font-size: 14px; color: #0f5a65; }
.ai-title span { display: block; font-size: 10px; color: #6f8791; margin-top: 2px; }
.ai-gear { color: #4a7a85; }
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: grid;
  gap: 10px;
  max-height: 300px;
}
.ai-msg span {
  display: inline-block;
  max-width: 86%;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
}
.ai-msg.ai span { background: #eff8f9; color: #245260; border: 1px solid #dfeef1; border-top-left-radius: 3px; }
.ai-msg.user { display: flex; justify-content: flex-end; }
.ai-msg.user span { background: linear-gradient(110deg, #087481, #1898a2); color: white; border-top-right-radius: 3px; }
.ai-quick { display: flex; gap: 6px; flex-wrap: wrap; padding: 0 14px 8px; }
.ai-quick button {
  font-size: 10px;
  padding: 6px 10px;
  border: 1px solid #cfe3e7;
  background: white;
  border-radius: 999px;
  color: #14727d;
}
.ai-input { display: flex; gap: 8px; padding: 10px 14px; border-top: 1px solid #e4edef; background: white; }
.ai-input input {
  flex: 1;
  height: 36px;
  border: 1px solid #dce7ea;
  border-radius: 18px;
  padding: 0 14px;
  outline: 0;
  font-size: 12px;
}
.ai-input button {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(145deg, #2eb5c4, #077581);
  color: white;
  display: grid;
  place-items: center;
}
.ai-key-note { margin: 0; padding: 8px 14px 12px; font-size: 10px; color: #8a9ba2; }

.dock-enter-active, .dock-leave-active { transition: all 0.3s ease; }
.dock-enter-from, .dock-leave-to { opacity: 0; transform: translateY(16px); }
</style>
