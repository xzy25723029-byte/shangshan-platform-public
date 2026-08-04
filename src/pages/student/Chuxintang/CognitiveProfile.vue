<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "../../../api";
import { cognitiveAxes } from "../../../data/chuxintang";
import RadarProfile from "../../../components/profile/RadarProfile.vue";
import SectionTitle from "../../../components/common/SectionTitle.vue";

/* 认知侧写：六轴倾向图 + 学习路径推荐
   倾向不是评分，不构成评价，不得作为筛选依据
   只自己 vs 自己（入学基线 vs 现在） */

const profile = ref(null);
const draft = ref({});

onMounted(async () => {
  profile.value = await mockApi.getCognitiveProfile();
  draft.value = { ...profile.value.current };
});

function update(key, v) {
  draft.value[key] = v;
}

async function save() {
  await mockApi.submitCognitiveAnswers({ ...draft.value });
  profile.value = await mockApi.getCognitiveProfile();
  ElMessage({ message: "认知侧写已更新（仅用于自己 vs 自己）", type: "success" });
}
</script>

<template>
  <div class="cp-page">
    <div class="page-banner">
      <div>
        <h1>认知侧写</h1>
        <p>六轴倾向图——只自己 vs 自己，不与他人比较</p>
      </div>
      <span class="pill">不构成评价 · 不得作为筛选依据</span>
    </div>

    <p class="cp-notice">
      认知侧写不是考试分数，不参与任何排名、准入或评价。它只回答一个问题：
      「入学时的我」和「现在的我」，倾向发生了什么变化。
    </p>

    <div class="cp-layout" v-if="profile">
      <div class="card cp-radar">
        <SectionTitle title="六轴倾向" note="实线：现在的我 · 虚线：入学时的我" />
        <RadarProfile
          :axes="cognitiveAxes"
          :scores="draft"
          :baseline="profile.baseline"
        />
      </div>

      <div class="cp-side">
        <div class="card cp-adjust">
          <SectionTitle title="我的倾向调整" note="凭最近一段时间的感受调整" />
          <label v-for="a in cognitiveAxes" :key="a.key" class="cp-slider">
            <span>{{ a.label }}<small>{{ a.desc }}</small></span>
            <input
              type="range" min="10" max="95" step="5"
              :value="draft[a.key] || 50"
              @input="update(a.key, Number($event.target.value))"
            />
            <b>{{ draft[a.key] || 50 }}</b>
          </label>
          <button class="btn cp-save" @click="save">保存侧写</button>
        </div>

        <div class="card cp-recommend">
          <SectionTitle title="学习路径建议" note="仅作参考，可自行选路" />
          <ul>
            <li>好奇心突出：可以从「文献检索」「原话墙」开始，问题意识是你的燃料</li>
            <li>细致度突出：适合先走「实验室安全」「数据记录」这类对严谨要求高的模块</li>
            <li>动手力突出：「三维科研绘图」「硬件与感知」方向会让你进入状态最快</li>
            <li>表达力突出：写作类模块与「师兄师姐」访谈是你的主场</li>
            <li>持久力突出：把「啃硬骨头」当作常驻习惯，你会走得很远</li>
          </ul>
          <router-link class="btn ghost" to="/student/map">去学习地图看看</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-notice {
  margin: 0 0 14px;
  padding: 12px 16px;
  border: 1px solid #e2d9c4;
  border-radius: 10px;
  background: #faf6ec;
  font-size: 12px;
  line-height: 1.8;
  color: #7c5a30;
}
.cp-layout { display: grid; grid-template-columns: 1fr 380px; gap: 14px; }
.cp-radar { padding: 18px 22px; }
.cp-side { display: grid; gap: 14px; align-content: start; }
.cp-adjust, .cp-recommend { padding: 16px 18px; }
.cp-slider { display: grid; grid-template-columns: 110px 1fr 34px; align-items: center; gap: 10px; margin: 10px 0; }
.cp-slider span { font-size: 12px; color: #3d5560; }
.cp-slider small { display: block; font-size: 9px; color: #8a9ba2; font-weight: 400; }
.cp-slider input { accent-color: var(--teal); }
.cp-slider b { font-size: 12px; color: #14727d; text-align: right; }
.cp-save { width: 100%; margin-top: 6px; }
.cp-recommend ul { margin: 10px 0 14px; padding-left: 16px; font-size: 11px; line-height: 2.1; color: #4a5f68; }
</style>
