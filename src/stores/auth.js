import { defineStore } from "pinia";
import { useMock, mockApi, remoteApi } from "../api";
import { demoAccounts } from "../api/mock";

const api = useMock ? mockApi : remoteApi;
const KEY = "ss_session";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: "",
  }),
  getters: {
    role: (s) => s.user?.role || "",
    isStudent: (s) => s.user?.role === "student",
    isMentor: (s) => s.user?.role === "mentor",
    isAdmin: (s) => s.user?.role === "admin",
    isSuperAdmin: (s) => s.user?.role === "super_admin",
    canManageContent: (s) => ["admin", "super_admin"].includes(s.user?.role),
  },
  actions: {
    restore() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) this.user = JSON.parse(raw);
      } catch {
        this.user = null;
      }
    },
    async login(credentials) {
      this.loading = true;
      this.error = "";
      try {
        this.user = await api.login(credentials);
        localStorage.setItem(KEY, JSON.stringify(this.user));
      } catch (e) {
        this.error = e.message || "登录失败";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async redeemInvite(code) {
      this.loading = true;
      this.error = "";
      try {
        this.user = await api.redeemInvite(code);
        localStorage.setItem(KEY, JSON.stringify(this.user));
      } catch (e) {
        this.error = e.message || "邀请码无效";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await api.logout();
      this.user = null;
      localStorage.removeItem(KEY);
    },
    // 演示入口：直接选择演示账号
    async loginAs(accountId) {
      const acc = demoAccounts.find((a) => a.id === accountId);
      if (!acc) return;
      this.user = { ...acc };
      localStorage.setItem(KEY, JSON.stringify(this.user));
    },
    // 正式模式：邮箱注册（内部使用，需邀请码，注册后待审核）
    async registerEmail(payload) {
      this.loading = true;
      this.error = "";
      try {
        this.user = await api.registerByEmail(payload);
        localStorage.setItem(KEY, JSON.stringify(this.user));
      } catch (e) {
        this.error = e.message || "注册失败";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    // 正式模式：邮箱登录
    async loginEmail(payload) {
      this.loading = true;
      this.error = "";
      try {
        this.user = await api.loginByEmail(payload);
        localStorage.setItem(KEY, JSON.stringify(this.user));
      } catch (e) {
        this.error = e.message || "登录失败";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    // 是否为正式模式用户（邮箱注册的真实学员）
    isFormal() {
      return this.user?.mode === "formal";
    },
    // 是否待审核（正式学员注册后需管理员审核通过）
    isPending() {
      return this.user?.mode === "formal" && this.user?.status === "pending";
    },
    homePath() {
      if (this.role === "mentor") return "/mentor/week";
      if (this.role === "admin" || this.role === "super_admin") return "/admin/people";
      return "/student/home";
    },
  },
});
