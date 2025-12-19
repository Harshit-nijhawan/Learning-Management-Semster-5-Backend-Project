const UserProgressModel = require("../models/UserProgress");

// Get user's complete progress
const getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let progress = await UserProgressModel.findOne({ user: userId })
      .populate('articlesCompleted.article', 'title slug')
      .populate('problemsSolved.problem', 'title slug difficulty points')
      .populate('bookmarkedArticles.article', 'title slug')
      .populate('bookmarkedProblems.problem', 'title slug difficulty')
      .populate('learningPaths.pathId', 'title slug');
    
    if (!progress) {
      progress = await UserProgressModel.create({ user: userId });
    }
    
    res.json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ message: "Error fetching progress" });
  }
};

// Get user stats/dashboard
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const progress = await UserProgressModel.findOne({ user: userId });
    
    if (!progress) {
      return res.json({
        articlesRead: 0,
        problemsSolved: 0,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0
      });
    }
    
    res.json({
      articlesRead: progress.articlesCompleted.length,
      problemsSolved: progress.problemsSolved.length,
      totalPoints: progress.totalPoints,
      currentStreak: progress.streak.current,
      longestStreak: progress.streak.longest,
      achievements: progress.achievements,
      recentActivity: progress.recentActivity.slice(0, 10),
      categoryStats: progress.categoryStats
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// Get user's bookmarks
const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.query; // 'articles' or 'problems'
    
    const progress = await UserProgressModel.findOne({ user: userId })
      .populate('bookmarkedArticles.article', 'title slug difficulty readTime')
      .populate('bookmarkedProblems.problem', 'title slug difficulty');
    
    if (!progress) {
      return res.json({ articles: [], problems: [] });
    }
    
    if (type === 'articles') {
      return res.json(progress.bookmarkedArticles);
    } else if (type === 'problems') {
      return res.json(progress.bookmarkedProblems);
    } else {
      return res.json({
        articles: progress.bookmarkedArticles,
        problems: progress.bookmarkedProblems
      });
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
};

module.exports = {
  getUserProgress,
  getUserStats,
  getUserBookmarks
};
