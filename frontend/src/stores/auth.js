import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
  }),

  actions: {
    async login(name, password) {
      const res = await api.post("/auth/login", { name, password });
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem("token", this.token);
    },

    async fetchMe() {
      try {
        const res = await api.get('/auth/me');
        this.user = res.data.user;
      } catch (err) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.clear();
    },
  },
});
