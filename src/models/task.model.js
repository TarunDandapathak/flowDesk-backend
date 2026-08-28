import mongoose from "mongoose";

// =========================
// TASK SCHEMA
// =========================

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    // edited 
    completeDate: {
      type: Date,
      default: null
    },

    // This is the deadline.
    // It has NO effect on dailyTask grouping.
    dueDate: {
      type: Date,
      default: Date.now,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// =========================
// DAILY TASK SCHEMA
// =========================

const dailyTaskSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The day the task was CREATED
    date: {
      type: Date,
      required: true,
    },

    // All task IDs created by this user on this day
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
      },
    ],
  },
  {
    timestamps: true,
  }
);


// =========================
// ONE USER + ONE DAY
// = ONE OBJECT
// =========================

dailyTaskSchema.index(
  {
    createdBy: 1,
    date: 1,
  },
  {
    unique: true,
  }
);


// =========================
// DAILY TASK MODEL
// =========================

const dailyTask = mongoose.model(
  "dailyTask",
  dailyTaskSchema
);


// =========================
// POST SAVE MIDDLEWARE
// =========================

taskSchema.post("save", async function (doc, next) {
  try {

    // ====================================
    // GET TODAY
    // ====================================

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // ====================================
    // GET TOMORROW
    // ====================================

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );


    // ====================================
    // FIND TODAY'S OBJECT
    // FOR THIS USER
    // ====================================

    let daily = await dailyTask.findOne({
      createdBy: doc.createdBy,

      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });


    // ====================================
    // IF TODAY'S OBJECT ALREADY EXISTS
    // ====================================

    if (daily) {

      daily.tasks.push(doc._id);

      await daily.save();

    }


    // ====================================
    // IF TODAY'S OBJECT DOES NOT EXIST
    // ====================================

    else {

      await dailyTask.create({
        createdBy: doc.createdBy,

        date: today,

        tasks: [
          doc._id
        ],
      });

    }


    // ====================================
    // FINISH MIDDLEWARE
    // ====================================

    next();

  } catch (error) {

    next(error);

  }
});


// =========================
// TASK MODEL
// =========================

const task = mongoose.model(
  "task",
  taskSchema
);


// =========================
// EXPORT
// =========================

export {
  task,
  dailyTask,
};