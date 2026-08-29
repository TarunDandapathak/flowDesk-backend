import { task } from "../models/task.model.js";
import jwt from "jsonwebtoken";
import { dailyTask } from "../models/task.model.js";
import { feedbackModel, studyTime } from "../models/feedback.models.js";
import authControllers from "../models/auth.models.js";

async function addTask(req, res) {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !priority) {
      return res.status(400).json({
        success: false,
        message: "Title and priority are required",
      });
    }

    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    const newTask = new task({
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      createdBy: decoded.id,
    });

    await newTask.save();

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function editTask(req, res) {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !priority || !status || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, priority, status and due date are required",
      });
    }

    const existingTask = await task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you are not authorized",
      });
    }

    let completeDate = existingTask.completeDate;

    if (status === "done" && existingTask.status !== "done") {
      completeDate = new Date();
    }

    if (status !== "done") {
      completeDate = null;
    }

    const updatedTask = await task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        status,
        dueDate: new Date(dueDate),
        completeDate,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Task edited successfully",
      task: updatedTask,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function deleteTask(req, res) {
  try {
    const checkCorrectUser = await task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (req.user.id.toString() === checkCorrectUser.createdBy.toString()) {
      let deleTask = await task.findByIdAndDelete(req.params.id);
      if (deleTask == null) {
        return res.status(404).json({
          success: false,
          message: "id is not valid",

        });
      }
      return res.status(204).json({
        success: true,
        message: "Task deleted successfully",

      })
    };
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
async function getData(req, res) {

  try {
    // console.log(req.user);
    const tasks = await task.find({
      createdBy: req.user.id
    });
    return res.status(200).json({
      success: true,
      tasks
    });

  } catch (error) {
    // console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
}
// async function getDailyData(req, res) {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);

//         const dailyTaskData = await dailyTask.findOne({
//             createdBy: req.user.id,
//             date: {
//                 $gte: today,
//                 $lt: tomorrow,
//             },
//         });
//         res.status(200).json({
//             success:true,
//             message:"Daily Tasks Data"
//         })

//     } catch (error) {

//     }
// }

async function feedback(req, res) {
  try {
    const { rating, message, category } = req.body;



    // console.log(req.user);
    // console.log(req.user.fullName);

    if (message && req.user) {

      const userName = await authControllers.findById(req.user.id || req.user._id);
      const feedback = await feedbackModel.create({
        rating,
        message,
        category,
        name: userName.fullName
      });

      res.status(200).json({
        success: true,
        message: "Successfully added the data"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Fill up the message box"
      });
    }
  } catch (err) {
    // console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to submit data"
    });
  }
}
async function studyTimer(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const duration = Number(req.body.durationInSeconds);

    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration provided"
      });
    }

    // Normalize date to exact 00:00:00.000 UTC of current day
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    // Atomic Upsert: Finds today's document or creates it, then increments studyTime
    const updatedRecord = await studyTime.findOneAndUpdate(
      {
        createdBy: userId,
        date: startOfDay
      },
      {
        $inc: { studyTime: duration }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Study time recorded successfully",
      data: updatedRecord
    });

  } catch (error) {
    console.error("Study timer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record study time"
    });
  }
}

async function getStudyTime(req, res) {
  try {
    const userId = req.user.id || req.user._id;

    const studyData = await studyTime.findOne({ createdBy: userId });

    if (!studyData) {
      return res.status(404).json({
        success: false,
        message: "Study time data not found"
      });
    }
    // console.log(userId)

    // console.log(studyData);

    return res.status(200).json({
      success: true,
      message: "Study time data fetched successfully",
      studyData
    });

  } catch (error) {
    console.error("Error fetching study time:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}



export default { addTask, editTask, deleteTask, getData, feedback, studyTimer, getStudyTime };
