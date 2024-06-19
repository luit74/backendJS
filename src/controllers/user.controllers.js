import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandler( async(req , res)=>{
    // before writing logic first we will write down what task we will do after that we will write the code . which helps us to write to logic easily by breaking down the larger task into small small tasks
    // 1. get user details from the frontend
    // 2. validate the details
    // 3. check whether the user exist or not ; check unique username and email
    // 4. get images for avatar from the user
    // 5. upload the images to cloudinary
    // 6. create an user object to store in the database.
    // 7. remove password and refresh tokens from the reponse .
    // 8. check for user creation.
    // 9. return response or error.

    const {fullName , email , password} = req.body;
    console.log("email:", email);

    if(fullName === ""){
        throw new ApiError(400, "fullName is required");
    }else if(email === ""){
        throw new ApiError(400, "email is required")
    }else if (password === ""){
        throw new ApiError(400 , "password is required")
    }

    // THIS IS AN ADVANCE METHOD OF VALIDATION AND HANDLING ERROR
    // if (
    //     [fullName , email , password].some((field)=>field?.trim() === "")
    // ){
    //     throw new ApiError(400 , "fields are empty")
    // }

   const existingUser = User.findOne({
        $or:[{ username } , {email}]
    })
    if(existingUser){
        throw new ApiError(409 , "The username or email already exist")
    }

    // 34.38 mins in youtube Video
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar image is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(409, "Avatar image is required")
    }

    User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase() 
    })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        if (!createdUser){
            throw new ApiError(500 , "Something went Wrong while registering User")
        }

        return res.status(201).json(
            new ApiResponse(200 , createdUser, "User registered successfully")
        )
})

export {
    registerUser,
}