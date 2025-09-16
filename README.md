# Task Manager API

## 🚀 Resumen del Proyecto

Esta es una API REST construida con NestJS que gestiona usuarios y tareas. La API utiliza PostgreSQL para la base de datos, Redis para el caché y la limitación de peticiones (rate limiting), y JWT para la autenticación. La aplicación está totalmente empaquetada con Docker para facilitar su despliegue y documentada a través de OpenAPI y Postman para su uso.

## 📦 Requisitos Previos

Para ejecutar esta aplicación, vas a necesitar tener instalado lo siguiente:

- [Docker Desktop](https://docs.docker.com/get-started/get-docker/)

Teniendo esta herramienta ya tenemos todo lo que necesitamos:

- Docker Engine
- Docker CLI
- Docker Compose

## 🔧 Configuración y Ejecución

Seguí estos pasos para levantar la aplicación completa y tenerla en funcionamiento.

### 1. Descargando el proyecto

Lo primero es tener el proyecto local. En la esquina derecha, clickeamos sobre el botón verde <> Code y copiamos la URL del proyecto para clonarlo en nuestra máquina con el siguiente comando

```bash
git clone <URL_GITHUB>
```

Una vez hecho esto, accedemos a la carpeta del proyecto para poder comenzar con las primeras configuraciones. Lo vamos a hacer con el siguiente comando

```bash
cd task-manager-api
```

### 2. Variables de Entorno

#### ⚠️ Aviso Importante sobre Seguridad

Sabemos que las variables de entorno (especialmente las credenciales de acceso y las claves secretas) nunca deben subirse a un repositorio de Git. Para facilitar la configuración y la ejecución de este proyecto en un entorno local, se ha incluido una plantilla de .env.

Al usar esta aplicación, por favor, reemplaza los valores de ejemplo con tus propias credenciales y seguí las buenas prácticas de seguridad. Asegurate de que tu archivo .env no sea compartido ni comprometido en un repositorio público.

#

Crea un archivo llamado .env en la raíz de tu proyecto. Este archivo va a contener las credenciales y las configuraciones necesarias para la conexión de los servicios.

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
REDIS_TTL=600000

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
```

### 🖥️ 3.Levantar los Contenedores

Ejecuta el siguiente comando para construir las imágenes de Docker y levantar todos los servicios (Base de datos, Redis, API) en segundo plano.

```bash
docker-compose up --build -d
```

Este comando puede tardar unos minutos la primera vez que se ejecuta, ya que descarga las imágenes base y compila la aplicación.

### 📈 4.¿Necesitas logs?

Podés acceder a los logs de la aplicación para tener una mejor noción de qué está sucediendo, qué endpoints están disponibles y ver el comportamiento del manejo de eventos para las tareas.
Para hacerlo, desde la consola tenés que correr este comando

```bash
docker logs -f task-manager-api
```

Con esto listo, vas a poder ver todo lo que ocurre en tiempo real.

### 5. Si no querés usar Docker...

Podés hacer una instalación de las dependencias con el siguiente comando

```bash
npm install
```

Esto va a descargar todo lo necesario para poder correr la app sin Docker. Pero primero, son necesarios unos ligeros cambios en tu archivo .env.
Las variables DATABASE_URL y REDIS_HOST tienen que actualizarse quedando así

```bash
DATABASE_URL=postgres://user:password@localhost:5432/task-manager-db
REDIS_HOST=localhost
```

De esta forma, ya podemos correr los comandos

```bash
docker-compose up --build -d
```

y luego

```bash
npm run start:dev
```

#### ⚠️ Aviso Importante

Recordá que antes de cambiar entre Local o Docker, tenés que dar de baja las instancias ya creadas con el comando de Docker. Al final de este README podés encontrar dichos comandos.

## 👨‍💻 Cómo usar la API

Podés probar los endpoints de la API de dos maneras:

### 1. Documentación con Swagger

Una vez que la aplicación esté en funcionamiento, podés ver la documentación completa de la API, incluyendo los endpoints de registro y autenticación, navegando a la siguiente URL en tu navegador:
[http://localhost:3000/docs#/](http://localhost:3000/docs#/)

### 2. Colección de Postman

Para una manera más sencilla de probar los endpoints, podés importar la colección de Postman del proyecto.

#### a. Importa la colección:

Abre Postman.
Hace clic en el botón Import en la esquina superior izquierda.
Arrastrá y soltá el archivo task_manager_api.postman_collection.json o navega para seleccionarlo.
Por otro lado, importá además el archivo task_manager_environment.postman_environment.json. Este último contiene las variables de entorno necesarias para el correcto funcionamiento de la colección de endpoints.
Una vez hecho, dirigite a la esquina superior derecha y en el menú desplegable seleccioná el entorno Task Manager para que todo funcione.
La colección incluye los endpoints necesarios para registrarse, iniciar sesión y obtener un token de actualización.
Podés usar esta colección para interactuar con la API luego de haberte logueado.

## 🟢 ¿Cómo comenzar?

Por defecto, podés loguearte como administrador con las credenciales correspondientes:

- User: user
- Password: password

O podés registrar tu propio usuario y luego loguearte. A partir de ahí, podés utilizar los diferentes endpoints de tareas.

## ❌ Detener la Aplicación

Para detener todos los servicios y eliminar los contenedores, ejecuta:

```bash
docker-compose down
```

Si también querés eliminar los volúmenes de datos (eliminando permanentemente la base de datos y su contenido), utiliza el flag -v:

```bash
docker-compose down -v
```
