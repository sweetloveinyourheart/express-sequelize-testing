import express from 'express'
import sequelize from './database/connection'
import router from './routers'
import { migrateDatabase } from './database/migrations'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

sequelize
    .authenticate()
    .then(() => {
        // Sync database
        migrateDatabase().then(() => console.log("Database migrate successfully!"))
        console.log(`Database connected !`)
    })
    .catch(() => {
        console.log(`[ERROR] Connect to database failed !`)
    })

app.use(bodyParser.json())

app.use("/api/v1", router)

app.listen(9000, () => {
    console.log(`Server is running on port 9000`);
})