import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express"
const app = express()

dotenv.config({
    path: './env'
})


// connectDB is an async function and whenever an async function completes a promise
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is running at port ${process.env.PORT}`);
    })
    app.on("error", (error) => {
        console.log("ERRR: ", error);
        throw error
    })
})
.catch((err)=>{
    console.log("MONGO_DB connection failed !!!", err);
})