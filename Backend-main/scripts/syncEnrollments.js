const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const Student = require("../models/Students");
const Course = require("../models/Course");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
        process.exit(1);
    }
};

const syncEnrollments = async () => {
    await connectDb();

    try {
        console.log("🔄 Starting Synchronization...");

        const courses = await Course.find({});
        const students = await Student.find({ role: "student" });

        console.log(`Found ${courses.length} courses and ${students.length} students.`);

        for (const course of courses) {
            // Count how many students have this course in purchasedCourses
            const count = students.filter(student =>
                student.purchasedCourses.some(p => p.toString() === course._id.toString())
            ).length;

            if (course.studentsEnrolled !== count) {
                console.log(`Mismatch for ${course.title}: DB=${course.studentsEnrolled}, Real=${count}. Updating...`);
                course.studentsEnrolled = count;
                await course.save();
            } else {
                console.log(`Verified ${course.title}: ${count} enrolled.`);
            }
        }

        console.log("✅ Synchronization Complete!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Sync Error:", error);
        process.exit(1);
    }
};

syncEnrollments();
