require("dotenv").config()
const Express = require("express");
const app = Express();
const dbConnection = require("./db")

const controllers = require("./controllers")

app.use(Express.json())

app.use('/user', controllers.userController)

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.port, () => {
            console.log(`shopView server running on port ${process.env.port}`)
        })
    })
    .catch((error) => {
        console.log(`Server crashed. Error: ${error}`)
    });
