const mongoose = require("mongoose");

// GFG-style structured learning paths
const learningPathSchema = new mongoose.Schema({
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
  
  description: {
    type: String,
    required: true
  },
  
  // Path category
  category: {
    type: String,
    required: true,
    enum: [
      'DSA Complete',
      'Web Development',
      'Interview Preparation',
      'Competitive Programming',
      'Python',
      'Java',
      'System Design',
      'Machine Learning'
    ]
  },
  
  // Difficulty level of the overall path
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  
  // Estimated duration in hours
  estimatedDuration: {
    type: Number,
    required: true
  },
  
  // Path thumbnail
  thumbnail: {
    type: String
  },
  
  // Modules in the learning path
  modules: [
    {
      moduleTitle: { type: String, required: true },
      moduleDescription: { type: String },
      order: { type: Number, required: true },
      
      // Items in this module (mix of articles and problems)
      items: [
        {
          itemType: {
            type: String,
            enum: ['article', 'problem', 'course'],
            required: true
          },
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'modules.items.itemType'
          },
          order: { type: Number, required: true },
          isOptional: { type: Boolean, default: false }
        }
      ]
    }
  ],
  
  // Prerequisites
  prerequisites: [{ type: String }],
  
  // What you'll learn
  learningOutcomes: [{ type: String }],
  
  // Target audience
  targetAudience: [{ type: String }],
  
  // Skills gained
  skills: [{ type: String }],
  
  // Creator
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // Enrollment count
  enrollments: {
    type: Number,
    default: 0
  },
  
  // Users enrolled
  enrolledUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  
  // Rating
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  
  // Is featured
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
  
}, { timestamps: true });

// Auto-generate slug
learningPathSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const LearningPathModel = mongoose.model('LearningPath', learningPathSchema);
module.exports = LearningPathModel;
