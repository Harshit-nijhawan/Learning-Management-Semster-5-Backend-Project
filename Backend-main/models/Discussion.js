const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String, // Markdown supported
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Works for Instructors too if they are in the same collection
        required: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }],
    views: {
        type: Number,
        default: 0,
    },
    isSolved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Virtual for comment count could be useful, but expensive. We'll handle it in aggregation or separate query.

discussionSchema.index({ tags: 1 });
discussionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Discussion", discussionSchema);
