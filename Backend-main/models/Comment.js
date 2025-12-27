const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    discussionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discussion",
        required: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null, // If null, it's a top-level comment. If set, it's a reply.
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }],
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
