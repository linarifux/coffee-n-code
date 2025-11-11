import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHanlder.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if(existedUser) throw new ApiError(409, "User with email or username already exists!")

    const avatarLocalPath = req.files?.avatar[0]?.path

    if(!avatarLocalPath) throw new ApiError(400, "Avatar file is required!")
        const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImageLocalPath;
    if(! req.files?.coverImage){
        coverImageLocalPath = ""
    }else{
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) throw new ApiError(400, "Avatar file is required!")
        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            username: username.toLowerCase(),
            password
        })

        const createduser = await User.findById(user._id).select(
            "-password -refreshToken" // removed these two fields from the object
        )
        if(!createduser) throw new ApiError(500, "Something went wrong while registering the user!")
            return res.status(201).json(
                new ApiResponse(200, createduser, "User registered successfully")
            )

});

export { registerUser };
