# SoundHub
### A free music player

Here you're going to be able to listen and download all the music you love!

**The newfrontend folder** is for a new project version but is still incomplete.

### How to run it?
- Install docker
- Run: docker-compose up -d --build --force-recreate --remove-orphans
- If you don't have the database structure, you'll need to access to the db container and create the database, then you'll need to uncomment next code on server.ts: (just while create the structure)
````
```
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db')
//     initial()
// });

// function initial() {
//     db.role.create({
//         role_id: 1,
//         role_name: "user"
//     });

//     db.role.create({
//         role_id: 2,
//         role_name: "moderator"
//     });

//     db.role.create({
//         role_id: 3,
//         role_name: "admin"
//     });
// }
```
````