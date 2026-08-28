import mongoose, { mongo, Mongoose } from "mongoose";


const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message:
    {
        type: String,
        required: true
    },
    rating: {
        type: Number,

    },
    category: {
        type: String,
    }


});
const timerSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    studyTime: {
        type: Number,
        default: 0,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})
timerSchema.index({ createdBy: 1, date: 1 }, { unique: true });

const feedbackModel = mongoose.model("feedbackSchema", feedbackSchema)
const studyTime = mongoose.model("studyTime", timerSchema)

export { feedbackModel, studyTime };