const mongoose = require('mongoose');
const ArticleModel = require('../models/Article');
const ProblemModel = require('../models/Problem');
const LearningPathModel = require('../models/LearningPath');
const StudentModel = require('../models/Students');
const connectDb = require('../utils/db');
require('dotenv').config();

/**
 * Create sample GFG-style content for testing
 * Run: node scripts/createSampleContent.js
 */

const createSampleContent = async () => {
  try {
    await connectDb();

    // Find an instructor user
    const instructor = await StudentModel.findOne({ role: 'instructor' });
    
    if (!instructor) {
      console.log('❌ No instructor found. Please create an instructor user first.');
      console.log('You can register as instructor or change a user role to instructor.');
      process.exit(1);
    }

    console.log(`✅ Using instructor: ${instructor.name} (${instructor.email})`);

    // Check if sample content already exists
    const existingArticle = await ArticleModel.findOne({ title: 'Introduction to Arrays in Python' });
    const existingProblem = await ProblemModel.findOne({ title: 'Two Sum' });
    const existingPath = await LearningPathModel.findOne({ title: 'DSA Beginner Path' });

    if (existingArticle && existingProblem && existingPath) {
      console.log('\n✨ Sample content already exists!');
      console.log('\n📝 Available content:');
      console.log('1. Article: http://localhost:5173/articles/' + existingArticle.slug);
      console.log('2. Problem: http://localhost:5173/problems/' + existingProblem.slug);
      console.log('3. Learning Path: http://localhost:5173/paths/' + existingPath.slug);
      console.log('\n💡 Run this script with --force to recreate sample data');
      process.exit(0);
    }

    // Delete existing if recreating
    if (process.argv.includes('--force')) {
      await ArticleModel.deleteMany({ title: 'Introduction to Arrays in Python' });
      await ProblemModel.deleteMany({ title: 'Two Sum' });
      await LearningPathModel.deleteMany({ title: 'DSA Beginner Path' });
      console.log('🗑️  Deleted existing sample content');
    }

    // Sample Article
    const article1 = await ArticleModel.create({
      title: 'Introduction to Arrays in Python',
      category: 'Python',
      subcategory: 'Data Structures',
      difficulty: 'Beginner',
      description: 'Learn the fundamentals of arrays in Python with practical examples',
      readTime: 8,
      content: [
        {
          sectionTitle: 'What is an Array?',
          sectionType: 'text',
          text: '<p>An array is a collection of elements stored at contiguous memory locations. In Python, we use lists as dynamic arrays.</p>',
          order: 1
        },
        {
          sectionTitle: 'Creating an Array',
          sectionType: 'code',
          code: {
            language: 'python',
            snippet: '# Creating an array (list) in Python\narr = [1, 2, 3, 4, 5]\nprint(arr)\nprint(arr[0])  # Access first element',
            output: '[1, 2, 3, 4, 5]\n1'
          },
          order: 2
        },
        {
          sectionTitle: 'Important Note',
          sectionType: 'note',
          text: 'Python lists are zero-indexed, meaning the first element is at index 0.',
          order: 3
        }
      ],
      codeExamples: [
        {
          language: 'python',
          code: 'arr = [1, 2, 3, 4, 5]\nfor item in arr:\n    print(item)',
          output: '1\n2\n3\n4\n5'
        }
      ],
      complexity: {
        time: 'O(1) for access, O(n) for insertion/deletion',
        space: 'O(n)',
        explanation: 'Arrays provide constant time access but linear time for insertions'
      },
      tags: ['python', 'arrays', 'data-structures', 'beginner'],
      keyPoints: [
        'Arrays store multiple values in contiguous memory',
        'Python uses lists as dynamic arrays',
        'Zero-based indexing',
        'O(1) access time'
      ],
      author: instructor._id,
      status: 'published',
      isFeatured: true
    });

    console.log('✅ Created sample article:', article1.title);

    // Sample Problem
    const problem1 = await ProblemModel.create({
      title: 'Two Sum',
      category: 'Array',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      inputFormat: 'First line: n (size of array)\nSecond line: n space-separated integers (array elements)\nThird line: target integer',
      outputFormat: 'Two space-separated integers representing indices',
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists'
      ],
      sampleTestCases: [
        {
          input: '4\n2 7 11 15\n9',
          output: '0 1',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]'
        },
        {
          input: '3\n3 2 4\n6',
          output: '1 2',
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2]'
        }
      ],
      expectedComplexity: {
        time: 'O(n)',
        space: 'O(n)'
      },
      solutions: [
        {
          approach: 'Hash Table',
          explanation: 'Use a hash map to store elements and their indices. For each element, check if target - element exists in the map.',
          complexity: {
            time: 'O(n)',
            space: 'O(n)'
          },
          code: [
            {
              language: 'python',
              snippet: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []'
            }
          ]
        }
      ],
      hints: [
        'Think about using a data structure that allows fast lookup',
        'Can you solve it in one pass?',
        'Hash tables provide O(1) lookup time'
      ],
      tags: ['array', 'hash-table', 'two-pointers'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple'],
      author: instructor._id,
      points: 20,
      status: 'published',
      isFeatured: true
    });

    console.log('✅ Created sample problem:', problem1.title);

    // Sample Learning Path
    const path1 = await LearningPathModel.create({
      title: 'DSA Beginner Path',
      category: 'DSA Complete',
      difficulty: 'Beginner',
      description: 'Complete beginner-friendly path to learn Data Structures and Algorithms from scratch',
      estimatedDuration: 40, // hours
      modules: [
        {
          moduleTitle: 'Introduction to Arrays',
          moduleDescription: 'Learn array fundamentals',
          order: 1,
          items: [
            {
              itemType: 'article',
              itemId: article1._id,
              order: 1,
              isOptional: false
            },
            {
              itemType: 'problem',
              itemId: problem1._id,
              order: 2,
              isOptional: false
            }
          ]
        }
      ],
      prerequisites: ['Basic programming knowledge in any language'],
      learningOutcomes: [
        'Understand fundamental data structures',
        'Solve basic algorithmic problems',
        'Analyze time and space complexity'
      ],
      targetAudience: ['Beginners', 'Students', 'Interview Prep'],
      skills: ['Problem Solving', 'Coding', 'Algorithms'],
      creator: instructor._id,
      status: 'published',
      isFeatured: true
    });

    console.log('✅ Created sample learning path:', path1.title);

    console.log('\n🎉 Sample content created successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Visit http://localhost:5173/articles/' + article1.slug);
    console.log('2. Visit http://localhost:5173/problems/' + problem1.slug);
    console.log('3. Browse learning paths at /paths');
    console.log('\n✨ Start creating more content from your instructor dashboard!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample content:', error);
    process.exit(1);
  }
};

createSampleContent();
