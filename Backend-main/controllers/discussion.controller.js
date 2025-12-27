const Discussion = require("../models/Discussion");
const Comment = require("../models/Comment");
const Student = require("../models/Students");

// Create a new discussion
exports.createDiscussion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        // Process tags (comma separated or array)
        let processedTags = [];
        if (Array.isArray(tags)) processedTags = tags;
        else if (typeof tags === 'string') processedTags = tags.split(',').map(t => t.trim());

        const newDiscussion = new Discussion({
            title,
            content,
            tags: processedTags,
            author: req.user.id,
        });

        await newDiscussion.save();

        // Populate author for immediate return
        await newDiscussion.populate('author', 'name profileImage role');

        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error("Error creating discussion:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all discussions with filters
exports.getDiscussions = async (req, res) => {
    try {
        const { sort, tag, search } = req.query;

        let query = {};
        if (tag) query.tags = tag;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        let discussions = Discussion.find(query)
            .populate('author', 'name profileImage role')
            .select('-content'); // Optimize list view, don't load full content

        // Sorting logic
        if (sort === 'hot') {
            // Simple hot algo: most upvotes this week? or total. Mongoose sort logic is limited for array length.
            // We will default to most upvotes for simplicity or just recent for now if array sort is hard without aggregation.
            // Using aggregation is better for 'hot', but let's stick to basics first.
            // We can sort by views as proxy for hot, or just creation date.
            // Actually, let's do aggregation to sort by upvotes length
            discussions = Discussion.aggregate([
                { $match: query },
                {
                    $addFields: {
                        upvotesCount: { $size: "$upvotes" }
                    }
                },
                { $sort: { upvotesCount: -1, createdAt: -1 } },
                {
                    $lookup: {
                        from: "students",
                        localField: "author",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                { $unwind: "$author" },
                {
                    $project: {
                        "author.password": 0,
                        "author.enrolledCourses": 0
                    }
                }
            ]);

            const results = await discussions;
            return res.status(200).json(results);

        } else if (sort === 'unanswered') {
            // Logic for unanswered (needs lookup on comments, complex)
            // Simplified: just Newest
            discussions = discussions.sort({ createdAt: -1 });
        } else {
            // Default Newest
            discussions = discussions.sort({ createdAt: -1 });
        }

        const results = await discussions;

        // Get comment counts for each discussion (inefficient but works for small scale)
        const enhancedResults = await Promise.all(results.map(async (d) => {
            const commentCount = await Comment.countDocuments({ discussionId: d._id });
            return {
                ...d.toObject ? d.toObject() : d,
                commentCount
            };
        }));

        res.status(200).json(enhancedResults);
    } catch (error) {
        console.error("Error fetching discussions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get single discussion by ID
exports.getDiscussionById = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id)
            .populate('author', 'name profileImage role');

        if (!discussion) return res.status(404).json({ message: "Discussion not found" });

        // Increment views
        discussion.views += 1;
        await discussion.save();

        res.status(200).json(discussion);
    } catch (error) {
        console.error("Error fetching discussion:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Toggle Upvote on Discussion
exports.voteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ message: "Not found" });

        const userId = req.user.id;
        const index = discussion.upvotes.indexOf(userId);

        if (index === -1) {
            discussion.upvotes.push(userId); // Upvote
        } else {
            discussion.upvotes.splice(index, 1); // Remove upvote
        }

        await discussion.save();
        res.status(200).json(discussion);
    } catch (error) {
        console.error("Error voting:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- COMMENTS ---

// Add a comment
exports.addComment = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const { id } = req.params; // discussionId

        const newComment = new Comment({
            content,
            discussionId: id,
            author: req.user.id,
            parentId: parentId || null
        });

        await newComment.save();
        await newComment.populate('author', 'name profileImage role');

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get comments for a discussion
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ discussionId: req.params.id })
            .populate('author', 'name profileImage role')
            .sort({ createdAt: 1 }); // Oldest first for chronological order

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Toggle Upvote on Comment
exports.voteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Not found" });

        const userId = req.user.id;
        const index = comment.upvotes.indexOf(userId);

        if (index === -1) {
            comment.upvotes.push(userId);
        } else {
            comment.upvotes.splice(index, 1);
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error voting comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
