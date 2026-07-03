
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    course: {
        type: String,
        required: true,
    },

    enrollmentDate: {
        type: Date,
        default: Date.now,
    },

    status: {
        type: String,
        enum: ["enrolled", "graduated", "dropped"],
        default: "enrolled",
    },
},
{
    timestamps: true
});

const studentModel = mongoose.model("Student", studentSchema);

// module.exports = studentModel;

const courseSchema = new mongoose.Schema({

     name: {
        type: String,
        required: true,
        unique: true,
    },

    description:{
        type: Number,
        required: true
    },

    duration:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },


},
 {
        timestamps:true
    }

);

const Course = mongoose.model("Course",courseSchema);

//Api Routes

//Course 


app.get("/api/courses", async(req,res)=>{
    try{
        const courses
    }
})

