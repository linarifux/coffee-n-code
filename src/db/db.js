import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {DB_NAME} from '../constants.js'
dotenv.config()
const MONGO_URI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        console.log(`MongoDB server connected... to the host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('MongoDB connection FAILED!---', error);
        process.exit(1)
    }
    
}

export default connectDB