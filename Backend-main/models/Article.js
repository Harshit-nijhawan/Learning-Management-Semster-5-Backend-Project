const mongoose = require("mongoose");

// GFG-style article/tutorial model
const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  
  slug: { 
    type: String, 
    unique: true,
    lowercase: true
  },
  
  // Main category (DSA, Web Development, Python, Java, etc.)
  category: {
    type: String,
    required: true,
    enum: [
      'Data Structures',
      'Algorithms',
      'Web Development',
      'Python',
      'Java',
      'JavaScript',
      'C++',
      'Database',
      'System Design',
      'Machine Learning',
      'Interview Preparation',
      'Competitive Programming'
    ]
  },
  
  // Subcategory (Array, Tree, React, etc.)
  subcategory: {
    type: String,
    required: true
  },
  
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'],
    default: 'Beginner'
  },
  
  // Short description/summary
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Estimated reading time in minutes
  readTime: {
    type: Number,
    default: 5
  },
  
  // Main content sections - GFG style with examples
  content: [
    {
      sectionTitle: { type: String, required: true },
      sectionType: {
        type: String,
        enum: ['text', 'code', 'example', 'note', 'image', 'table'],
        default: 'text'
      },
      text: { type: String }, // Markdown or HTML content
      code: {
        language: { type: String }, // 'python', 'javascript', 'cpp', etc.
        snippet: { type: String },
        output: { type: String }
      },
      image: { type: String }, // Image URL
      order: { type: Number, required: true }
    }
  ],
  
  // Code examples with multiple languages
  codeExamples: [
    {
      language: { 
        type: String, 
        enum: ['python', 'java', 'cpp', 'javascript', 'c', 'csharp']
      },
      code: { type: String, required: true },
      output: { type: String }
    }
  ],
  
  // Time and Space Complexity (for algorithm articles)
  complexity: {
    time: { type: String },
    space: { type: String },
    explanation: { type: String }
  },
  
  // Prerequisites - links to other articles
  prerequisites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    }
  ],
  
  // Related articles
  relatedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    }
  ],
  
  // Key points / Summary
  keyPoints: [{ type: String }],
  
  // Tags for search and categorization
  tags: [{ type: String }],
  
  // Author (instructor)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // View count
  views: {
    type: Number,
    default: 0
  },
  
  // Likes/upvotes
  likes: {
    type: Number,
    default: 0
  },
  
  // Users who liked this article
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  
  // Users who bookmarked
  bookmarkedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  
  // Is this article published or draft
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  // Featured article flag
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Table of contents (auto-generated from sections)
  tableOfContents: [
    {
      title: { type: String },
      anchor: { type: String },
      level: { type: Number } // h2, h3, etc.
    }
  ],
  
  // SEO meta data
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
  
  // Last updated by
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }
  
}, { timestamps: true });

// Index for search
articleSchema.index({ title: 'text', description: 'text', tags: 'text' });
articleSchema.index({ category: 1, subcategory: 1 });
articleSchema.index({ difficulty: 1 });
// slug index not needed as unique: true already creates an index

// Auto-generate slug from title
articleSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const ArticleModel = mongoose.model('Article', articleSchema);
module.exports = ArticleModel;
