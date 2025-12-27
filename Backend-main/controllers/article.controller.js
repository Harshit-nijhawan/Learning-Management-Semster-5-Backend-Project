const ArticleModel = require("../models/Article");
const UserProgressModel = require("../models/UserProgress");

// Get all published articles with filters
const getArticles = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      difficulty,
      tag,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$text = { $search: search };
    }



    const articles = await ArticleModel.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Don't send full content in list

    const count = await ArticleModel.countDocuments(filter);
    console.log(`DEBUG: Found ${articles.length} articles. Total count: ${count}`);

    res.json({
      articles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
};

// Get single article by slug
const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await ArticleModel.findOne({ slug, status: 'published' })
      .populate('author', 'name email')
      .populate('prerequisites', 'title slug')
      .populate('relatedArticles', 'title slug difficulty readTime');

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Increment view count - fail silently if validation error occurs
    // to ensure user still gets the article content
    try {
      article.views += 1;
      await article.save();
    } catch (saveError) {
      console.warn("Could not update view count for article:", saveError.message);
    }

    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Error fetching article" });
  }
};

// Create new article (instructor/admin only)
const createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      author: req.user._id
    };

    const article = await ArticleModel.create(articleData);

    res.status(201).json({
      message: "Article created successfully",
      article
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Error creating article", error: error.message });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    let article = await ArticleModel.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check authorization
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields manually to trigger pre-save hooks (for slug generation)
    // and validators
    const allowedUpdates = [
      'title', 'category', 'subcategory', 'difficulty',
      'description', 'readTime', 'content', 'tags', 'status'
    ];

    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        article[update] = req.body[update];
      }
    });

    article.lastUpdatedBy = req.user._id;

    const updated = await article.save();

    res.json({
      message: "Article updated successfully",
      article: updated
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Error updating article", error: error.message });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ArticleModel.findByIdAndDelete(id);

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Error deleting article" });
  }
};

// Like/unlike article
const toggleLikeArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const article = await ArticleModel.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const hasLiked = article.likedBy.some(id => id.toString() === userId.toString());

    if (hasLiked) {
      // Unlike
      article.likedBy = article.likedBy.filter(id => id.toString() !== userId.toString());
      article.likes = Math.max(0, article.likes - 1);
    } else {
      // Like
      article.likedBy.push(userId);
      article.likes += 1;
    }

    await article.save();

    res.json({
      message: hasLiked ? "Article unliked" : "Article liked",
      likes: article.likes,
      hasLiked: !hasLiked
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error updating like" });
  }
};

// Bookmark/unbookmark article
const toggleBookmarkArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const article = await ArticleModel.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Get or create user progress
    let progress = await UserProgressModel.findOne({ user: userId });
    if (!progress) {
      progress = await UserProgressModel.create({ user: userId });
    }

    const hasBookmarked = progress.bookmarkedArticles.some(
      b => b.article.toString() === id
    );

    if (hasBookmarked) {
      // Remove bookmark
      progress.bookmarkedArticles = progress.bookmarkedArticles.filter(
        b => b.article.toString() !== id
      );
      article.bookmarkedBy = article.bookmarkedBy.filter(
        uid => uid.toString() !== userId.toString()
      );
    } else {
      // Add bookmark
      progress.bookmarkedArticles.push({ article: id });
      article.bookmarkedBy.push(userId);
    }

    await progress.save();
    await article.save();

    res.json({
      message: hasBookmarked ? "Bookmark removed" : "Article bookmarked",
      isBookmarked: !hasBookmarked
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ message: "Error updating bookmark" });
  }
};

// Mark article as completed
const markArticleCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { timeSpent } = req.body;

    let progress = await UserProgressModel.findOne({ user: userId });
    if (!progress) {
      progress = await UserProgressModel.create({ user: userId });
    }

    // Check if already completed
    const alreadyCompleted = progress.articlesCompleted.some(
      a => a.article.toString() === id
    );

    if (!alreadyCompleted) {
      progress.articlesCompleted.push({
        article: id,
        timeSpent: timeSpent || 0
      });

      // Update streak
      progress.updateStreak();

      // Add to recent activity
      progress.recentActivity.unshift({
        type: 'article_read',
        itemId: id,
        description: 'Completed an article'
      });

      // Keep only last 50 activities
      if (progress.recentActivity.length > 50) {
        progress.recentActivity = progress.recentActivity.slice(0, 50);
      }

      await progress.save();
    }

    res.json({
      message: "Article marked as completed",
      progress
    });
  } catch (error) {
    console.error("Error marking article completed:", error);
    res.status(500).json({ message: "Error updating progress" });
  }
};

// Get featured articles
const getFeaturedArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find({
      status: 'published',
      isFeatured: true
    })
      .populate('author', 'name email')
      .limit(10)
      .select('-content');

    res.json(articles);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    res.status(500).json({ message: "Error fetching featured articles" });
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLikeArticle,
  toggleBookmarkArticle,
  markArticleCompleted,
  getFeaturedArticles
};
