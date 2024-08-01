# SoundHub
### A free music player

Here you're going to be able to listen and download all the music you love!

**The newfrontend folder** is for a new project version but is still incomplete.

### How to run it?
- Install docker
- Create a file .env in base of .env.example
- Run: docker-compose up -d --build --force-recreate --remove-orphans
- If you don't have the database structure, you'll need to run migrations and seeders, run the next commands in the **backend** container on Docker
````
```
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
````
