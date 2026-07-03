// =======================================
// IMPORT PACKAGES
// =======================================
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const winston = require("winston");

// =======================================
// IMPORT STUDENT MODEL
// =======================================
const studentModel = require("./db.js");

// =======================================
// LOAD ENVIRONMENT VARIABLES
// =======================================
dotenv.config();

// =======================================
// CREATE EXPRESS APPLICATION
// =======================================
const app = express();

// =======================================
// MIDDLEWARE
// =======================================
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// =======================================
// DATABASE CONNECTION
// =======================================
mongoose
    .connect(process.env.MONGODB_URL || "mongodb://localhost:27017/school", {
    })
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
        console.error("❌ Error connecting to MongoDB:", err);
    });

// =======================================
// WINSTON LOGGER
// =======================================
const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        new winston.transports.File({
            filename: "error.log",
            level: "error",
        }),

        new winston.transports.File({
            filename: "combined.log",
        }),

        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

// =======================================
// MORGAN LOGGER
// =======================================
app.use(
    morgan(
        "Method: :method | URL: :url | Status: :status | Response Time: :response-time ms"
    )
);

// =======================================
// CUSTOM API LOGGER MIDDLEWARE
// =======================================
const apiLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration} ms`,
        });
    });

    next();
};

app.use(apiLogger);

// =======================================
// TEST ROUTE
// =======================================
app.get("/api/courses", async(req, res) => {
    try{
        const courses = await course.find.sort ({name:1});
        logger.info(`Retrieved ${courses.length} Courses was created with sucess`)
    }
    
});

// =======================================
// EXAMPLE ROUTE USING STUDENT MODEL
// =======================================
app.get("/students", async (req, res, next) => {
    try {
        const students = await studentModel.find();
        res.json(students);
    } catch (err) {
        next(err);
    }
});

// =======================================
// ERROR HANDLING MIDDLEWARE
// =======================================
app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.method !== "GET" ? req.body : undefined,
    });

    res.status(500).json({
        success: false,
        error: "Internal Server Error",
    });
});

// =======================================
// START SERVER
// =======================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});