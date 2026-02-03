<template>
  <div class="dashboard-wrapper">
    <!-- BARRA SUPERIOR -->
    <header class="topbar">
      <h2>Gestión de Documentos CSV</h2>
      <button class="logout" @click="logout">Cerrar sesión</button>
    </header>

    <div v-if="notificationMessage" :class="['notification', notificationType]">
      <span>{{ notificationMessage }}</span>
      <button class="notif-close" @click="hideNotification">×</button>
    </div>

    <!-- ÁREA DE SUBIDA -->
    <section class="upload-area"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div class="upload-box">
        <p>☁ Drag & Drop / Seleccionar CSV</p>

        <label class="select-btn">
          <input type="file" accept=".csv" @change="handleFile" />
          <span class="btn-text">Seleccionar archivo</span>
        </label>

      </div>
    </section>

    <!-- TABLA -->
    <section class="table-area">
      <table>
        <thead>
          <tr>
            <th>Nombre Doc.</th>
            <th>Usuario</th>
            <th>Fecha Carga</th>

            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.id">
            <td>{{ doc.filename }}</td>
            <td>{{ doc.userName }}</td>
            <td>{{ formatDate(doc.createdAt) }}</td>
            <td class="actions">
              <button @click="download(doc.id)">Descargar</button>
              <template v-if="isAdmin">
                <button v-if="confirmDeleteId !== doc.id" class="danger" @click="promptRemove(doc.id)">Eliminar</button>

                <div v-else class="confirm-box">
                  <span>¿Eliminar este documento?</span>
                  <button class="confirm-yes" @click="confirmRemove(doc.id)">Sí</button>
                  <button class="confirm-no" @click="cancelRemove">No</button>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <div class="table-footer">
      <div class="record-count">Mostrando {{ documents.length }} registros</div>
      <div class="pager">
        <button class="pager-btn" disabled>«</button>
        <span class="page-number">1</span>
        <button class="pager-btn" disabled>»</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import * as dashboardService from "../services/dashboard.service";

export default {
  data() {
    return {
      documents: [],
      selectedFileName: "",
      lastUploadedFile: "",
      notificationMessage: "",
      notificationType: "",
      confirmDeleteId: null,
    };
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  mounted() {
    this.loadDocuments();
    console.log("Dashboard mounted - auth.user:", this.auth.user);
    console.log("Dashboard mounted - isAdmin:", this.isAdmin);
    // Si hay token pero no hay user en la store, intentar inicializarlo
    if (!this.auth.user && this.auth.token) {
      console.log('No auth.user pero hay token — pidiendo /auth/me');
      this.auth.fetchMe().then(() => {
        console.log('fetchMe result, auth.user:', this.auth.user);
      });
    }
  },
  watch: {
    'auth.user': {
      handler(newVal) {
        console.log('auth.user changed:', newVal);
        console.log('computed isAdmin now:', this.isAdmin);
      },
      immediate: true,
    },
  },
  methods: {
    async loadDocuments() {
      const res = await dashboardService.getDocuments();
      this.documents = res.data;
    },
    async handleFile(e) {
      const file = e.target.files[0];
      if (file) {
        this.selectedFileName = file.name;
        await this.upload(file, true);
      }
    },
    async handleDrop(e) {
      const file = e.dataTransfer.files[0];
      if (file) {
        await this.upload(file, false);
      }
    },
    async upload(file, showChip = true) {
      const form = new FormData();
      form.append("file", file);

      try {
        await dashboardService.uploadCsv(file);
        this.loadDocuments();
        if (showChip) {
          this.lastUploadedFile = file.name;
          this.selectedFileName = "";
          setTimeout(() => (this.lastUploadedFile = ""), 8000);
        }
        this.showNotification("Archivo cargado correctamente", "success");
      } catch (err) {
        const backend = err.response?.data;
        let msg = "Error en el CSV";
        if (backend) {
          if (Array.isArray(backend.errors) && backend.errors.length) {
            const e = backend.errors[0];
            msg = `${backend.message || 'Error en el CSV'} - ${e.error}${e.field ? ` (${e.field})` : ''}${e.row !== undefined ? ` [row ${e.row}]` : ''}`;
            // Sin modal en la interfaz; mostrar solo la notificación
            msg = `${backend.message || 'Error en el CSV'} - ${e.error}${e.field ? ` (${e.field})` : ''}${e.row !== undefined ? ` [row ${e.row}]` : ''}`;
          } else if (backend.message) {
            msg = backend.message;
          } else {
            msg = String(backend);
          }
        }
        this.showNotification(msg, "error");
      }
    },
    async download(id) {
      const res = await dashboardService.downloadCsv(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "documento.csv";
      a.click();
    },
    promptRemove(id) {
      this.confirmDeleteId = id;
    },
    cancelRemove() {
      this.confirmDeleteId = null;
    },
    async confirmRemove(id) {
      try {
        await dashboardService.deleteDocument(id);
        this.showNotification("Documento eliminado correctamente", "success");
        this.loadDocuments();
      } catch (err) {
        this.showNotification(err.response?.data?.message || "Error al eliminar documento", "error");
      } finally {
        this.confirmDeleteId = null;
      }
    },
    clearUploaded() {
      this.lastUploadedFile = "";
    },
    showNotification(message, type = "success") {
      this.notificationMessage = message;
      this.notificationType = type;
      setTimeout(() => (this.notificationMessage = ""), 4000);
    },
    hideNotification() {
      this.notificationMessage = "";
    },
    
    formatDate(d) {
      return new Date(d).toLocaleString();
    },
    logout() {
      this.auth.logout();
      this.$router.push("/login");
    },
  },
  computed: {
    isAdmin() {
      return this.auth && this.auth.user && this.auth.user.role === "admin";
    },
  },
};
</script>
<style src="../styles/views/Dashboard.css" scoped></style>

<style scoped>
.table-footer{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px 16px;
  border-top:1px solid #e6e6e6;
  font-size:14px;
  color:#333;
}
.table-footer .pager{ display:flex; align-items:center; gap:8px; }
.pager-btn{ padding:6px 10px; border:1px solid #ccc; background:#fff; cursor:not-allowed; border-radius:4px; }
.page-number{ padding:6px 10px; border-radius:4px; background:#f5f5f5; border:1px solid #e0e0e0; }
</style>
