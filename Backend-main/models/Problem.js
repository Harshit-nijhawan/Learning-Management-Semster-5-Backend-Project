const mongoose = require("mongoose");

// GFG-style coding problem/challenge model
const problemSchema = new mongoose.Schema({
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
  
  // Problem statement
  description: {
    type: String,
    required: true
  },
  
  // Category
  category: {
    type: String,
    required: true,
    enum: [
      'Array',
      'String',
      'Linked List',
      'Stack',
      'Queue',
      'Tree',
      'Graph',
      'Dynamic Programming',
      'Greedy',
      'Backtracking',
      'Divide and Conquer',
      'Sorting',
      'Searching',
      'Recursion',
      'Mathematical',
      'Bit Manipulation'
    ]
  },
  
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['School', 'Basic', 'Easy', 'Medium', 'Hard'],
    required: true
  },
  
  // Problem tags
  tags: [{ type: String }],
  
  // Input format explanation
  inputFormat: {
    type: String,
    required: true
  },
  
  // Output format explanation
  outputFormat: {
    type: String,
    required: true
  },
  
  // Constraints
  constraints: [{ type: String }],
  
  // Sample test cases (visible to users)
  sampleTestCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String }
    }
  ],
  
  // Hidden test cases (for evaluation)
  hiddenTestCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ],
  
  // Expected time complexity
  expectedComplexity: {
    time: { type: String },
    space: { type: String }
  },
  
  // Solution approaches
  solutions: [
    {
      approach: { type: String }, // "Brute Force", "Optimal", etc.
      explanation: { type: String },
      complexity: {
        time: { type: String },
        space: { type: String }
      },
      code: [
        {
          language: { 
            type: String,
            enum: ['python', 'java', 'cpp', 'javascript', 'c']
          },
          snippet: { type: String }
        }
      ]
    }
  ],
  
  // Hints (progressive hints)
  hints: [{ type: String }],
  
  // Related problems
  relatedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ],
  
  // Similar problems
  similarProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ],
  
  // Companies that asked this problem
  companies: [{ type: String }],
  
  // Author
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // Statistics
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    successfulSubmissions: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  
  // Points/score for solving
  points: {
    type: Number,
    default: 10
  },
  
  // Is this problem published
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  // Featured problem flag
  isFeatured: {
    type: Boolean,
    default: false
  }
  
}, { timestamps: true });

// Indexes
problemSchema.index({ category: 1, difficulty: 1 });
// slug index not needed as unique: true already creates an index
problemSchema.index({ tags: 1 });

// Auto-generate slug
problemSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const ProblemModel = mongoose.model('Problem', problemSchema);
module.exports = ProblemModel;
