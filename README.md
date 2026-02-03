# Instrucciones para ejecutar el proyecto

Este proyecto está completamente dockerizado

## Requisitos

Debe de estar instalado y abierto:

* Docker Desktop

---

## Pasos para ejecutar el proyecto

### 1️. Despues de Clonar el repositorio, ve a la carpeta

```bash
cd prueba-fullstack
```

---

### 2️. Ejecutar toda la aplicación (Backend + Frontend + Base de Datos)

```bash
docker-compose up -d --build
```
 Este comando realiza automáticamente:

* Construcción de las imágenes del backend y frontend
* Levantamiento del contenedor de MySQL
* Conexión entre todos los servicios

---

### 3️.Verificar que los contenedores estén activos

```bash
docker ps
```

Deberían aparecer los siguientes contenedores en ejecución:

* `mysql_csv`
* `backend_csv`
* `frontend_csv`

---

##  Accesos a la aplicación

* Frontend (Vue 3 Dashboard)
   [http://localhost:8080](http://localhost:8080)

* Backend (API REST)
   [http://localhost:3000](http://localhost:3000)

---

## Detener la aplicación

```bash
docker-compose down
```
---

## Limpieza completa (opcional)

```bash
docker-compose down -v
```

Esto elimina:

* Contenedores
* Volúmenes
* Datos almacenados en MySQL


Gracias por revisar esta prueba técnica 
