import express from "express";
import { task } from "../models/task.model.js";
import taskController from "../controllers/task.controllers.js";
import verifyLogin from "../middleware/veriftLogin.js";
const router = express.Router();

router.post("/user/task", verifyLogin, taskController.addTask);
router.patch("/user/:id/task", verifyLogin, taskController.editTask);
router.delete("/user/:id/task", verifyLogin, taskController.deleteTask);
router.get("/user/task", verifyLogin, taskController.getData);
// router.get("/user/dailytask", verifyLogin, taskController.getDailyData);
router.post("/user/feedback", verifyLogin, taskController.feedback);
router.post("/user/timer", verifyLogin, taskController.studyTimer);
router.get("/user/timer", verifyLogin, taskController.getStudyTime);
export default router;