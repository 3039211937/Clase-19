# Workspace API

## Descripción de la aplicación

Workspace API es un backend desarrollado con **Node.js y Express** que
permite gestionar usuarios, espacios de trabajo colaborativos, canales y
mensajes.\
El sistema funciona de manera similar a plataformas de comunicación como
**Slack o Discord**, donde los usuarios pueden crear espacios de
trabajo, invitar miembros, organizar canales y enviar mensajes.

Este proyecto fue desarrollado como **trabajo final académico**,
aplicando conceptos de desarrollo backend, autenticación segura y
arquitectura REST.

---

# Tecnologías utilizadas

- **Node.js** -- Entorno de ejecución para JavaScript en el servidor
- **Express** -- Framework para crear APIs REST
- **MongoDB** -- Base de datos NoSQL
- **Mongoose** -- ODM para interactuar con MongoDB
- **JWT (jsonwebtoken)** -- Autenticación basada en tokens
- **Bcrypt** -- Encriptación de contraseñas
- **Nodemailer** -- Envío de correos electrónicos
- **CORS** -- Permite comunicación con frontend en otro dominio
- **Dotenv** -- Manejo de variables de entorno

---

# Tipo de autenticación

La API utiliza dos mecanismos de seguridad.

## API Key

Todas las peticiones deben incluir el header:

    x-api-key: API_KEY

Este header es validado mediante un middleware que protege toda la API.

---

## JWT (JSON Web Token)

Una vez que el usuario inicia sesión, el servidor devuelve un **token
JWT**.

Este token debe enviarse en los requests protegidos:

    Authorization: Bearer TOKEN

---

# Qué permite la API

La API permite:

- Registrar usuarios
- Verificar el email del usuario
- Iniciar sesión
- Crear y administrar workspaces
- Invitar usuarios a workspaces
- Gestionar roles de miembros
- Crear y eliminar canales
- Enviar y consultar mensajes dentro de canales

---

# Arquitectura del proyecto

    project
    │
    ├── config
    │   ├── environment.config.js
    │   ├── mongoDB.config.js
    │   └── mail.config.js
    │
    ├── controllers
    │   ├── auth.controller.js
    │   ├── workspace.controller.js
    │   ├── channel.controller.js
    │   └── messages.controller.js
    │
    ├── middlewares
    │   ├── auth.middleware.js
    │   ├── apikey.middleware.js
    │   ├── workspace.middleware.js
    │   └── channel.middleware.js
    │
    ├── repository
    │   ├── user.repository.js
    │   └── workspace.repository.js
    │
    ├── services
    │   └── workspace.service.js
    │
    ├── routes
    │   ├── auth.router.js
    │   └── workspace.router.js
    │
    ├── main.js
    ├── package.json
    └── .env

---

# API REST

Base URL

    http://localhost:8082

---

# Endpoint de prueba

## GET /

Verifica que el servidor esté funcionando correctamente.

Respuesta:

```json
{
  "ok": true,
  "message": "Servidor funcionando correctamente",
  "data": null
}
```

---

# Auth Endpoints

## POST /api/auth/register

Registra un nuevo usuario.

### Body

```json
{
  "email": "usuario@email.com",
  "password": "123456",
  "username": "usuario"
}
```

### Respuesta

```json
{
  "message": "Usuario creado exitosamente",
  "status": 201,
  "ok": true,
  "data": null
}
```

---

## POST /api/auth/login

Inicia sesión.

### Body

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

### Respuesta

```json
{
  "message": "Inicio de sesion exitoso",
  "ok": true,
  "status": 200,
  "data": {
    "auth_token": "JWT_TOKEN"
  }
}
```

---

## POST /api/auth/logout

Cierra la sesión del usuario.

Requiere autenticación.

---

## GET /api/auth/verify-email

Verifica el email del usuario.

Query:

    verification_email_token

---

# Workspace Endpoints

## GET /api/workspace

Obtiene todos los workspaces donde el usuario es miembro.

---

## POST /api/workspace

Crea un nuevo workspace.

### Body

```json
{
  "title": "Workspace de ejemplo",
  "description": "Descripcion del workspace",
  "image": "url_imagen"
}
```

---

## GET /api/workspace/:workspace_id

Obtiene información detallada del workspace.

---

## PUT /api/workspace/:workspace_id

Actualiza la información del workspace.

Roles permitidos:

- Owner
- Admin

---

## DELETE /api/workspace/:workspace_id

Elimina un workspace.

Roles permitidos:

- Owner
- Admin

---

# Members

## GET /api/workspace/:workspace_id/members

Obtiene los miembros del workspace.

---

## POST /api/workspace/:workspace_id/members

Invita un miembro al workspace.

### Body

```json
{
  "email": "usuario@email.com",
  "role": "Member"
}
```

---

## DELETE /api/workspace/:workspace_id/members/:member_id

Elimina un miembro del workspace.

---

# Invitaciones

## GET /api/workspace/members/accept-invitation

Endpoint público para aceptar invitaciones a un workspace.

Query:

    token

---

# Channels

## GET /api/workspace/:workspace_id/channels

Obtiene los canales del workspace.

---

## POST /api/workspace/:workspace_id/channels

Crea un canal.

---

## DELETE /api/workspace/:workspace_id/channels/:channel_id

Elimina un canal.

---

# Messages

## POST /api/workspace/:workspace_id/channels/:channel_id/messages

Envía un mensaje en un canal.

---

## GET /api/workspace/:workspace_id/channels/:channel_id/messages

Obtiene los mensajes de un canal.

---

# Variables de entorno

Archivo `.env`

    MONGO_DB_URI
    MONGO_DB_NAME
    JWT_SECRET_KEY
    URL_FRONTEND
    GMAIL_USERNAME
    GMAIL_PASSWORD
    API_KEY

Ejemplo:

    MONGO_DB_URI=mongodb://localhost:27017
    MONGO_DB_NAME=UTN_Curso
    JWT_SECRET_KEY=secret
    URL_FRONTEND=http://localhost:5173
    GMAIL_USERNAME=email@gmail.com
    GMAIL_PASSWORD=password
    API_KEY=xxxxxxxx

---

# Instalación del proyecto

## 1 Clonar el repositorio

    git clone <repo>

## 2 Instalar dependencias

    npm install

## 3 Configurar variables de entorno

Crear archivo:

    .env

Basado en `.env.example`.

## 4 Ejecutar servidor

Modo desarrollo:

    npm run dev

Modo producción:

    npm start

---

# Puerto del servidor

    http://localhost:8082

---

# Posibles mejoras futuras

- Implementar **WebSockets** para mensajería en tiempo real.
- Agregar **paginación en mensajes**.
- Implementar **notificaciones en tiempo real**.
- Agregar **tests automatizados (Jest o Mocha)**.
- Implementar **rate limiting y protección contra ataques**.

---

# Autor

Proyecto desarrollado como **Trabajo Final - Desarrollo Backend con
Node.js y Express**.
