import { connectDB } from "./config/db";
import app from "./app";
import dotenv from "dotenv";
import { seedFoods } from "./scripts/seedfood";
dotenv.config()


let port = process.env.PORT || "5010"

connectDB(process.env.MONGOURL || "").then(async ()=> {
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
})