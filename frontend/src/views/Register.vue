<template>
  <div class="login-wrapper">
    <!-- LADO IZQUIERDO -->
    <div class="login-left">
      <div class="overlay">
        <h1>Crear cuenta</h1>
        <p>
          Regístrate para comenzar a gestionar tus archivos CSV<br />
          de forma segura y eficiente.
        </p>
      </div>
    </div>

    <!-- LADO DERECHO -->
    <div class="login-right">
      <form class="login-form" @submit.prevent="handleRegister">
        <h2>REGISTRARSE</h2>

        <input
          v-model="name"
          type="text"
          placeholder="Nombre"
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

        <div class="password-field">
          <input
            v-model="confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            placeholder="Confirmar contraseña"
            required
          />
          <button type="button" class="eye" @click="toggleConfirm" aria-label="Mostrar contraseña">
            <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        <!-- ROLES -->
        <div class="roles">
          <label>
            <input type="radio" value="user" v-model="role" />
            Usuario
          </label>
          <label>
            <input type="radio" value="admin" v-model="role" />
            Administrador
          </label>
        </div>

        <button type="submit">Registrarse</button>

        <p class="signup">
          ¿Ya tienes cuenta?
          <router-link to="/login">Inicia sesión</router-link>
        </p>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import * as authService from "../services/auth.service";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      name: "",
      password: "",
      confirmPassword: "",
      role: "",
      showPassword: false,
      showConfirm: false,
      errorMsg: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirm() {
      this.showConfirm = !this.showConfirm;
    },
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMsg = "Las contraseñas no coinciden";
        return;
      }

      if (!this.role) {
        this.errorMsg = "Selecciona un rol";
        return;
      }

      try {
        await authService.register({
          name: this.name,
          password: this.password,
          confirmPassword: this.confirmPassword,
          role: this.role,
        });

        this.router.push("/login");
      } catch (error) {
        this.errorMsg =
          error.response?.data?.message || "Error al registrar usuario";
      }
    },
  },
};
</script>
<style src="../styles/views/Register.css" scoped></style>
