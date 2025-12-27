const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Students',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp']
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'wrong-answer', 'runtime-error', 'time-limit-exceeded']
  },
  passedTests: {
    type: Number,
    default: 0
  },
  totalTests: {
    type: Number,
    default: 0
  },
  runtime: {
    type: Number
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const dailyQuestionSchema = new mongoose.Schema({
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
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  tags: [{
    type: String
  }],
  date: {
    type: Date,
    required: true,
    unique: true
  },
  testCases: [testCaseSchema],
  starterCode: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' },
    cpp: { type: String, default: '' }
  },
  constraints: {
    type: String
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  hints: [{
    type: String
  }],
  submissions: [submissionSchema],
  acceptanceRate: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  totalAccepted: {
    type: Number,
    default: 0
  },
  videoUrl: {
    type: String,
    trim: true
  },
  theory: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster date-based queries
dailyQuestionSchema.index({ date: -1 });

// Method to get today's question
dailyQuestionSchema.statics.getTodaysQuestion = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let question = await this.findOne({
    date: { $gte: today, $lt: tomorrow }
  });

  // If no question for today, get the latest question
  if (!question) {
    question = await this.findOne().sort({ date: -1 });
  }

  return question;
};

// Method to update acceptance rate
dailyQuestionSchema.methods.updateAcceptanceRate = function () {
  if (this.totalSubmissions > 0) {
    this.acceptanceRate = ((this.totalAccepted / this.totalSubmissions) * 100).toFixed(2);
  }
};

// Auto-generate slug
dailyQuestionSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const DailyQuestion = mongoose.model('DailyQuestion', dailyQuestionSchema);

module.exports = DailyQuestion;
