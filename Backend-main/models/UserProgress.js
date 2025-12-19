const mongoose = require("mongoose");

// Track user's learning progress - GFG style
const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  
  // Articles read/completed
  articlesCompleted: [
    {
      article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
      },
      completedAt: { type: Date, default: Date.now },
      timeSpent: { type: Number } // in seconds
    }
  ],
  
  // Problems solved
  problemsSolved: [
    {
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      },
      solvedAt: { type: Date, default: Date.now },
      attempts: { type: Number, default: 1 },
      language: { type: String },
      code: { type: String },
      timeTaken: { type: Number } // in seconds
    }
  ],
  
  // Bookmarked articles
  bookmarkedArticles: [
    {
      article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
      },
      bookmarkedAt: { type: Date, default: Date.now }
    }
  ],
  
  // Bookmarked problems
  bookmarkedProblems: [
    {
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      },
      bookmarkedAt: { type: Date, default: Date.now }
    }
  ],
  
  // Learning path progress
  learningPaths: [
    {
      pathId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningPath'
      },
      progress: { type: Number, default: 0 }, // Percentage
      startedAt: { type: Date, default: Date.now },
      completedAt: { type: Date }
    }
  ],
  
  // Category-wise stats
  categoryStats: [
    {
      category: { type: String },
      problemsSolved: { type: Number, default: 0 },
      articlesRead: { type: Number, default: 0 }
    }
  ],
  
  // Total points/score
  totalPoints: {
    type: Number,
    default: 0
  },
  
  // Streak - consecutive days of activity
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityDate: { type: Date }
  },
  
  // Achievements/badges
  achievements: [
    {
      name: { type: String },
      description: { type: String },
      icon: { type: String },
      earnedAt: { type: Date, default: Date.now }
    }
  ],
  
  // Recent activity
  recentActivity: [
    {
      type: { 
        type: String, 
        enum: ['article_read', 'problem_solved', 'course_completed', 'achievement_earned']
      },
      itemId: { type: mongoose.Schema.Types.ObjectId },
      description: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
  
}, { timestamps: true });

// Update streak on activity
userProgressSchema.methods.updateStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActivity = this.streak.lastActivityDate 
    ? new Date(this.streak.lastActivityDate).setHours(0, 0, 0, 0)
    : null;
  
  if (!lastActivity) {
    this.streak.current = 1;
    this.streak.longest = 1;
  } else {
    const diffDays = (today - lastActivity) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      // Consecutive day
      this.streak.current += 1;
      if (this.streak.current > this.streak.longest) {
        this.streak.longest = this.streak.current;
      }
    } else if (diffDays > 1) {
      // Streak broken
      this.streak.current = 1;
    }
    // If diffDays === 0, same day, no change
  }
  
  this.streak.lastActivityDate = new Date();
};

const UserProgressModel = mongoose.model('UserProgress', userProgressSchema);
module.exports = UserProgressModel;
