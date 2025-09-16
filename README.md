# Task Manager API

## 🚀 Resumen del Proyecto

Esta es una API RESTful construida con NestJS que gestiona usuarios y tareas. La API utiliza PostgreSQL para la base de datos, Redis para el caché y la limitación de peticiones (rate limiting), y JWT para la autenticación. La aplicación está totalmente empaquetada con Docker para facilitar su despliegue y documentada a través de OpenAPI y Postman para su uso.

## 📦 Requisitos Previos

Para ejecutar esta aplicación, necesitarás tener instalado lo siguiente:

- [Docker Desktop](https://docs.docker.com/get-started/get-docker/)

Teniendo esta herramienta ya tenemos todo lo que necesitamos:

- Docker Engine
- Docker CLI
- Docker Compose

## 🔧 Configuración y Ejecución

Sigue estos pasos para levantar la aplicación completa y tenerla en funcionamiento.

### 1. Variables de Entorno

#### ⚠️ Aviso Importante sobre Seguridad

Sabemos que las variables de entorno, especialmente las credenciales de acceso y las claves secretas, nunca deben subirse a un repositorio de Git. Para facilitar la configuración y la ejecución de este proyecto en un entorno local, se ha incluido una plantilla de .env.

Al usar esta aplicación, por favor, reemplaza los valores de ejemplo con tus propias credenciales y sigue las buenas prácticas de seguridad. Asegúrate de que tu archivo .env no sea compartido ni comprometido en un repositorio público.

#

Crea un archivo llamado .env en la raíz de tu proyecto. Este archivo contendrá las credenciales y las configuraciones necesarias para la conexión de los servicios.

```bash
# .env

# Database
DATABASE_URL=postgres://user:password@db:5432/task-manager-db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=task-manager-db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=supersecretjwtkey
JWT_REFRESH_SECRET=supersecretrefreshjwtkey
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d

# API Key
EXTERNAL_API_URL=https://jsonplaceholder.typicode.com/todos
EXTERNAL_API_KEY=my-external-api-key

# Throttler (Rate Limiting)
THROTTLE_TTL=60000
THROTTLE_LIMIT=5

# Redis TTL
REDIS_TTL=600000
```

### 2.Levantar los Contenedores

Ejecuta el siguiente comando para construir las imágenes de Docker y levantar todos los servicios (db, redis, api) en segundo plano.

```bash
docker-compose up --build -d
```

Este comando puede tardar unos minutos la primera vez que se ejecuta, ya que descargará las imágenes base y compilará la aplicación.

## 👨‍💻 Cómo usar la API

Puedes probar los endpoints de la API de dos maneras.

### 1. Documentación con Swagger

Una vez que la aplicación esté en funcionamiento, puedes ver la documentación completa de la API, incluyendo los endpoints de registro y autenticación, navegando a la siguiente URL en tu navegador:
[http://localhost:3000/docs#/](http://localhost:3000/docs#/)

### 2. Colección de Postman

Para una manera más sencilla de probar los endpoints, puedes importar la colección de Postman del proyecto.

#### a. Importa la colección:

Abre Postman.
Haz clic en el botón Import en la esquina superior izquierda.
Arrastra y suelta el archivo task_manager_api.postman_collection.json o navega para seleccionarlo.
Por otro lado, importa además el archivo task_manager_environment.postman_environment.json. Este último contiene las variables de entorno necesarias para el correcto funcionamiento de la colección de endpoints.
Una vez hecho, Ve a la esquina superior derecha y en el menú desplegable selecciona el entorno Task Manager para que todo funcione.
La colección incluye los endpoints necesarios para registrarse, iniciar sesión y obtener un token de actualización.
Puedes usar esta colección para interactuar con la API luego de haberte logueado.

## 🟢 ¿Cómo comenzar?

Por defecto, puedes loguearte como administrador con las credenciales correspondientes:

- User: user
- Password: password

O puedes registrar tu propio usuario y luego loguearte. A partir de ahí, puedes utilizar los diferentes endpoints de tareas.

## 🛑 Detener la Aplicación

Para detener todos los servicios y eliminar los contenedores, ejecuta:

```bash
docker-compose down
```

Si también quieres eliminar los volúmenes de datos (eliminando permanentemente la base de datos y su contenido), utiliza el flag -v:

```bash
docker-compose down -v
```
