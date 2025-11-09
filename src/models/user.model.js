import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { configDotenv } from "dotenv";
configDotenv()


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// hashing password before saving it to db
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 8)
    next()
})

// checking password is correct or wrong
userSchema.methods.isPasswordCorrect = async function (password) {
    await bcrypt.compare(password, this.password)
}

// adding secret token to session
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
      {
      _id: this._id,
      username: this.username,
      fullName: this.fullname,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: 'RS256'
    },
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    },
    (err, token) => {
      if(err) console.error(err)
        return token
    }

    )
}
userSchema.methods.generateRefreshToken = function(){}


export const User = mongoose.model("User", userSchema);
