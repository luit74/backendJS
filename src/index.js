import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is running at port`);
    })
    app.on("error", (error) => {
        console.log("ERRR: ", error);
        throw error
    })
})
.catch((err)=>{
    console.log("MONGO_DB connection failed !!!", err);
})