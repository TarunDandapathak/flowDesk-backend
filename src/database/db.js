//here we only connect the db 
import mongoose from "mongoose";

let connectDB = () => {
    if (!process.env.MONGODB_URL) {
        throw new Error("mongodb environment variable is not define");
    }
    // console.log(process.env.MONGODB_URL);
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("mongodb connected");
        })
        .catch((err) => {
            console.log(`mongodb connection error ${err}`)
        })
}

export default connectDB;


