import { defineStore } from "pinia";

/* 壳层状态：全局搜索、AI 导师 Dock */
export const useAppStore = defineStore("app", {
  state: () => ({
    query: "",
    dockOpen: false,
    notices: [
      { title: "张涛老师批阅了你的思想札记", time: "10:30" },
      { title: "毕业设计 · 中期检查材料待提交", time: "昨天" },
      { title: "新视频已加入：EIS 阻抗谱与等效电路（1）", time: "3 天前" },
    ],
  }),
  actions: {
    toggleDock() {
      this.dockOpen = !this.dockOpen;
    },
  },
});
