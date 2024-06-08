import express from "express"
import cors from "cors" // this allows us to accept servers from different origin . eg we have a backend this will help us to connect with selective from frontend servers which we will provide
import cookieParser from "cookie-parser"

const app = express()
// .use all the things are used for middleware or configurations 
app.use(cors({
    origin: process.env.CORS_ORIGIN, //just like mentioned above in line 2 that we will alllow selective origin only . this is how we do that. ## now check .env file   
    credentials: true
}))

// app.use() , we have used these because these are middleware configurations.

// here we have write the code for the data which we will be recieving from the frontend end , so that the server doesnt crash we will put some restrictions
// we have used app.use becuase these are middleware validations
app.use(express.json({limit: "16kb"})) //these are data which we will recieve from the form
app.use(express.urlencoded({extended: true, limit: "16kb"})) //these are data which we will recieve from the url. this encode the url 
app.use(express.static("public")) // this configuration is used to store files , folder , pdf , images etc which we want to store in our own servers . for such work we use this configuration . and Public is the location where we want to store it .
app.use(cookieParser()) //these are use to access the cookies of the user's browser and also set it  . So that we could perform CRUD operations

export {app}