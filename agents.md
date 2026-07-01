# Agent Instructions

- Antes de ejecutar cualquier comando `npm` o `node`, hazlo dentro del contenedor de Docker correspondiente del proyecto, usando `docker compose exec`.
- Para tareas del backend, usa el servicio `backend`; para tareas del frontend, usa el servicio `frontend`.
- En producción hay dos VPS separados: el VPS principal corre Jenkins, el backend y el frontend compilado; el otro VPS corre solo el microservicio de descarga/reproducción de YouTube, que el backend consume vía `YOUTUBE_SERVICE_URL`.
