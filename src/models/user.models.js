import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; //it helps us to hash our password , it wont save a clear text password

//jwt and bcrypt both are based on cryptography encryption


const userSchema = new Schema ({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true //if we want any field to be searched very optimisedly then put index = true , but it is a bit costly. and effect performance
        
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String , //cloudinary url -- similar to aws
        required: true,
    },
    coverImage:{
        type: String, //cloudinary url
    },
    watchHistory:[
        {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
],
    password:{
        type: String,
        required: [true, "password is required"]
    },
    refreshToken:{
            type: String
    }
}, {
    timestamps: true
}
)

// these are mongoose middleware hooks

//.pre is a middleware which is used just before the data is about to save (also there are many events available such as remove , validate , etc)
userSchema.pre("save", async function (next) { // we have use the middleware flag : next(flag abhi ye aage paas kar do) 

    // (2).. but there is one problem that we donot want the password to change and save again and again if we modify other items . we want the password to save only when we have modified the password then only we will save it. to tackle this problem we will use the line of code below.
    if (!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10) //(1)..for encryption we use bcrypt.hash method inside which we mention what we want to encrypt and how many rounds of encryption we want to do(in our case 10)
    next()
})

// we will create custom methods according to our need . 
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

//jwt is a bearer token , who ever has this or bear this token we will send the data to him.
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            //id is coming from the data models written above and this.id is coming from the database
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User = mongoose.model("User", userSchema)