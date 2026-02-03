<template>
  <div class="login-wrapper">
    <!-- LADO IZQUIERDO (ESPACIO PARA IMAGEN) -->
    <div class="login-left">
      <div class="overlay">
        <h1>Bienvenido</h1>
        <p>
          Gestiona tus archivos CSV de forma fácil y eficiente.
        </p>
      </div>
    </div>

    <!-- LADO DERECHO (FORMULARIO) -->
    <div class="login-right">
      <form class="login-form" @submit.prevent="handleLogin">

        <h2>INICIAR SESIÓN</h2>

        <input
          v-model="name"
          type="text"
          placeholder="Usuario"
          required
        />

        <div class="password-field">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            required
          />
          <button type="button" class="eye" @click="togglePassword" aria-label="Mostrar contraseña">
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        

        <button type="submit">Iniciar sesión</button>

        <p class="signup">
          ¿No tienes una cuenta?
          <router-link to="/register">Registrarse</router-link>
        </p>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import * as authService from "../services/auth.service";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  data() {
    return {
      name: "",
      password: "",
      showPassword: false,
      errorMsg: "",
    };
  },
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    return { router, auth };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      try {
        const res = await authService.login({
          name: this.name,
          password: this.password,
        });

        this.auth.token = res.data.token;
        this.auth.user = res.data.user;
        localStorage.setItem("token", res.data.token);

        this.router.push("/");
      } catch (error) {
        this.errorMsg =
          error.response?.data?.message || "Credenciales inválidas";
      }
    },
  },
};
</script>
<style src="../styles/views/Login.css" scoped></style>
