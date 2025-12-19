const LearningPathModel = require("../models/LearningPath");
const UserProgressModel = require("../models/UserProgress");

// Get all learning paths
const getLearningPaths = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    
    const filter = { status: 'published' };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    const paths = await LearningPathModel.find(filter)
      .populate('creator', 'name email')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-modules'); // Don't send full modules in list
    
    const count = await LearningPathModel.countDocuments(filter);
    
    res.json({
      paths,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    res.status(500).json({ message: "Error fetching learning paths" });
  }
};

// Get single learning path by slug
const getLearningPathBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const path = await LearningPathModel.findOne({ slug, status: 'published' })
      .populate('creator', 'name email')
      .populate({
        path: 'modules.items.itemId',
        select: 'title slug difficulty readTime'
      });
    
    if (!path) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    res.json(path);
  } catch (error) {
    console.error("Error fetching learning path:", error);
    res.status(500).json({ message: "Error fetching learning path" });
  }
};

// Create learning path
const createLearningPath = async (req, res) => {
  try {
    const pathData = {
      ...req.body,
      creator: req.user._id
    };
    
    const path = await LearningPathModel.create(pathData);
    
    res.status(201).json({
      message: "Learning path created successfully",
      path
    });
  } catch (error) {
    console.error("Error creating learning path:", error);
    res.status(500).json({ message: "Error creating learning path" });
  }
};

// Enroll in learning path
const enrollInPath = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const path = await LearningPathModel.findById(id);
    
    if (!path) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    // Check if already enrolled
    const alreadyEnrolled = path.enrolledUsers.some(
      uid => uid.toString() === userId.toString()
    );
    
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this path" });
    }
    
    path.enrolledUsers.push(userId);
    path.enrollments += 1;
    await path.save();
    
    // Update user progress
    let progress = await UserProgressModel.findOne({ user: userId });
    if (!progress) {
      progress = await UserProgressModel.create({ user: userId });
    }
    
    progress.learningPaths.push({
      pathId: id,
      progress: 0
    });
    
    await progress.save();
    
    res.json({
      message: "Successfully enrolled in learning path",
      path
    });
  } catch (error) {
    console.error("Error enrolling in path:", error);
    res.status(500).json({ message: "Error enrolling in path" });
  }
};

module.exports = {
  getLearningPaths,
  getLearningPathBySlug,
  createLearningPath,
  enrollInPath
};
