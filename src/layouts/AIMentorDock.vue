<script setup>
import { computed, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { PaperPlaneRight, Gear, CaretDown } from "@/icons";
import { useAppStore } from "../stores/app";
import {
  aiModeFor, aiModeLabel, aiReply, aiQuickPrompts,
  loadModels, getActiveModel, setActiveModel, chatWithModel,
} from "../utils/aiMentor";

const app = useAppStore();
const route = useRoute();

const mode = computed(() => aiModeFor(route.path));
const messages = ref([]);
const input = ref("");
const listRef = ref(null);
const modelPickerOpen = ref(false);
const thinking = ref(false);

/* 已配置（有 Key）的模型与当前选中模型 */
const models = computed(() => loadModels().filter((m) => m.enabled && m.apiKey));
const activeModel = ref(getActiveModel());

const initialGreeting = computed(() => {
  if (activeModel.value) {
    return mode.value === "socratic"
      ? `我是「水问」（${activeModel.value.name}），初心堂里只反问、不下结论的伙伴。你可以把正在想的问题抛给我——我会先问回去。`
      : `我是「水问」（${activeModel.value.name}），现在是助教模式：可以给步骤提示、帮你检查、帮你追问，但不会替你写、替你算。`;
  }
  return mode.value === "socratic"
    ? "我是「水问」，初心堂里只反问、不下结论的伙伴。你可以把正在想的问题抛给我——我会先问回去。（当前为本地引导，配置模型后对话更智能）"
    : "我是「水问」，现在是助教模式：可以给步骤提示、帮你检查、帮你追问，但不会替你写、替你算。（当前为本地引导，配置模型后对话更智能）";
});

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

function pickModel(id) {
  setActiveModel(id);
  activeModel.value = getActiveModel();
  modelPickerOpen.value = false;
  push("ai", `已切换为「${activeModel.value?.name || "本地引导"}」。继续吧——问题还停在你刚才那里。`);
}

async function send(text) {
  const msg = String(text ?? input.value).trim();
  if (!msg || thinking.value) return;
  input.value = "";
  push("user", msg);

  if (activeModel.value) {
    // 真实大模型调用（OpenAI 兼容），失败自动降级本地引导
    thinking.value = true;
    push("ai", "…");
    try {
      const reply = await chatWithModel(activeModel.value, mode.value, messages.value.slice(0, -1));
      messages.value[messages.value.length - 1] = { role: "ai", text: reply };
      scrollToBottom();
    } catch (e) {
      messages.value[messages.value.length - 1] = {
        role: "ai",
        text: `模型调用失败（${e.message.slice(0, 50)}）。已切换为本地引导继续对话：\n\n${aiReply(mode.value, msg)}`,
      };
      scrollToBottom();
    } finally {
      thinking.value = false;
    }
  } else {
    // 本地反问引导
    setTimeout(() => push("ai", aiReply(mode.value, msg)), 350);
  }
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
        <div class="ai-head-actions">
          <!-- 模型选择器 -->
          <div class="model-picker">
            <button class="model-btn" @click="modelPickerOpen = !modelPickerOpen" :title="activeModel ? activeModel.name : '未配置模型'">
              <span class="model-dot" :class="{ off: !activeModel }"></span>
              {{ activeModel ? activeModel.name : "本地引导" }}
              <CaretDown :size="12" />
            </button>
            <Transition name="dock">
              <div v-if="modelPickerOpen" class="model-menu">
                <button v-for="m in models" :key="m.id" :class="{ cur: activeModel?.id === m.id }" @click="pickModel(m.id)">
                  <b>{{ m.name }}</b><small>{{ m.provider }} · {{ m.model }}</small>
                </button>
                <router-link to="/student/ai-settings" class="model-manage" @click="app.dockOpen = false">＋ 添加/管理模型</router-link>
              </div>
            </Transition>
          </div>
          <router-link to="/student/ai-settings" class="ai-gear" aria-label="AI 导师设置"><Gear :size="18" /></router-link>
        </div>
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
          :placeholder="thinking ? '模型思考中…' : '输入你的问题…'"
          @keyup.enter="send()"
        />
        <button @click="send()" aria-label="发送" :disabled="thinking"><PaperPlaneRight :size="18" /></button>
      </footer>

      <p v-if="!activeModel" class="ai-key-note">
        未配置模型：当前为本地反问引导。到「AI 导师设置」添加模型（推荐硅基流动，一个 Key 用 DeepSeek/Qwen 等全部模型），即可获得更智能的对话——Key 仅保存在本机浏览器，不上传服务器。
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
  width: 400px;
  max-height: 580px;
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
  padding: 12px 14px;
  background: linear-gradient(120deg, #eaf6f8, #f7fcfd);
  border-bottom: 1px solid #dfebee;
  gap: 8px;
}
.ai-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ai-title img { width: 38px; height: 38px; object-fit: contain; }
.ai-title strong { display: block; font-size: 14px; color: var(--ink); }
.ai-title span { display: block; font-size: 10px; color: #6f8791; margin-top: 2px; }
.ai-head-actions { display: flex; align-items: center; gap: 6px; }
.model-picker { position: relative; }
.model-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #cfe3e7;
  background: white;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 10px;
  color: #14727d;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.model-dot { width: 7px; height: 7px; border-radius: 50%; background: #2eb5a0; flex: 0 0 auto; }
.model-dot.off { background: #c0ccd0; }
.model-menu {
  position: absolute;
  right: 0;
  top: 30px;
  width: 230px;
  background: white;
  border: 1px solid #d3e6ea;
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(26, 95, 107, 0.16);
  padding: 6px;
  z-index: 30;
  display: grid;
  gap: 2px;
}
.model-menu button {
  display: grid;
  gap: 2px;
  text-align: left;
  border: 0;
  background: transparent;
  border-radius: 7px;
  padding: 7px 10px;
}
.model-menu button:hover { background: #eef8f9; }
.model-menu button.cur { background: #e2f5f4; }
.model-menu b { font-size: 12px; color: #0d5e68; }
.model-menu small { font-size: 9px; color: #7a8d95; }
.model-manage {
  display: block;
  text-align: center;
  font-size: 10px;
  color: #0f7c87;
  text-decoration: none;
  padding: 7px;
  border-top: 1px solid #e7eef0;
  margin-top: 3px;
}
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
.ai-input button:disabled { opacity: 0.5; }
.ai-key-note { margin: 0; padding: 8px 14px 12px; font-size: 10px; line-height: 1.8; color: #8a9ba2; }

.dock-enter-active, .dock-leave-active { transition: all 0.3s ease; }
.dock-enter-from, .dock-leave-to { opacity: 0; transform: translateY(16px); }
</style>
