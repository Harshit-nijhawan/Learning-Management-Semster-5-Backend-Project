const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true // 'python', 'java', 'cpp', etc.
    },
    verdict: {
        type: String,
        enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Pending'],
        default: 'Pending'
    },
    timeUsed: {
        type: Number, // in seconds
        default: 0
    },
    memoryUsed: {
        type: Number, // in KB
        default: 0
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Prevent multiple submissions for same problem by same user within short time? No, allow it.
// Compound index for quick lookup of user's solved problems
submissionSchema.index({ userId: 1, problemId: 1, verdict: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
