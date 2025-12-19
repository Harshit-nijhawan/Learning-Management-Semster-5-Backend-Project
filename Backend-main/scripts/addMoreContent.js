const mongoose = require('mongoose');
const ArticleModel = require('../models/Article');
const ProblemModel = require('../models/Problem');
const LearningPathModel = require('../models/LearningPath');
const CourseModel = require('../models/Course');
const StudentModel = require('../models/Students');
const connectDb = require('../utils/db');
require('dotenv').config();

/**
 * Add comprehensive sample content
 * Run: node scripts/addMoreContent.js
 */

const addMoreContent = async () => {
  try {
    await connectDb();

    // Find an instructor user
    let instructor = await StudentModel.findOne({ role: 'instructor' });
    
    if (!instructor) {
      console.log('⚠️  No instructor found. Creating default instructor...');
      const { hashPassword } = require('../utils/passwordUtils');
      const hashedPassword = await hashPassword('instructor123');
      
      instructor = await StudentModel.create({
        name: 'Instructor Demo',
        email: 'instructor@learnify.com',
        password: hashedPassword,
        number: '9876543210',
        role: 'instructor'
      });
      
      console.log('✅ Created instructor account:');
      console.log('   Email: instructor@learnify.com');
      console.log('   Password: instructor123');
    }

    console.log(`\n✅ Using instructor: ${instructor.name} (${instructor.email})`);

    // Sample Articles
    const articles = [
      {
        title: 'Understanding Linked Lists',
        category: 'Data Structures',
        subcategory: 'Linked Lists',
        difficulty: 'Beginner',
        description: 'Master the fundamentals of linked lists with clear examples',
        readTime: 10,
        content: [
          {
            sectionTitle: 'What is a Linked List?',
            sectionType: 'text',
            text: '<p>A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a reference to the next node.</p>',
            order: 1
          },
          {
            sectionTitle: 'Creating a Node',
            sectionType: 'code',
            code: {
              language: 'python',
              snippet: 'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None',
              output: ''
            },
            order: 2
          }
        ],
        tags: ['linked-list', 'data-structures', 'python'],
        author: instructor._id,
        status: 'published',
        isFeatured: true
      },
      {
        title: 'Binary Search Algorithm',
        category: 'Algorithms',
        subcategory: 'Searching',
        difficulty: 'Medium',
        description: 'Learn the efficient binary search algorithm',
        readTime: 12,
        content: [
          {
            sectionTitle: 'Binary Search Overview',
            sectionType: 'text',
            text: '<p>Binary search is an efficient algorithm for finding an item in a sorted list. It works by repeatedly dividing the search interval in half.</p>',
            order: 1
          },
          {
            sectionTitle: 'Implementation',
            sectionType: 'code',
            code: {
              language: 'python',
              snippet: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
              output: ''
            },
            order: 2
          }
        ],
        tags: ['binary-search', 'algorithms', 'searching'],
        author: instructor._id,
        status: 'published'
      },
      {
        title: 'Introduction to Dynamic Programming',
        category: 'Algorithms',
        subcategory: 'Dynamic Programming',
        difficulty: 'Hard',
        description: 'Master the art of dynamic programming',
        readTime: 20,
        content: [
          {
            sectionTitle: 'What is DP?',
            sectionType: 'text',
            text: '<p>Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems.</p>',
            order: 1
          }
        ],
        tags: ['dynamic-programming', 'algorithms', 'optimization'],
        author: instructor._id,
        status: 'published',
        isFeatured: true
      },
      {
        title: 'Stack Data Structure',
        category: 'Data Structures',
        subcategory: 'Stack',
        difficulty: 'Beginner',
        description: 'Learn about LIFO (Last In First Out) data structure',
        readTime: 8,
        content: [
          {
            sectionTitle: 'Stack Basics',
            sectionType: 'text',
            text: '<p>A stack is a linear data structure that follows the LIFO principle.</p>',
            order: 1
          }
        ],
        tags: ['stack', 'data-structures', 'LIFO'],
        author: instructor._id,
        status: 'published'
      },
      {
        title: 'Queue Implementation',
        category: 'Data Structures',
        subcategory: 'Queue',
        difficulty: 'Beginner',
        description: 'Understanding FIFO (First In First Out) structure',
        readTime: 8,
        content: [
          {
            sectionTitle: 'Queue Basics',
            sectionType: 'text',
            text: '<p>A queue is a linear data structure that follows the FIFO principle.</p>',
            order: 1
          }
        ],
        tags: ['queue', 'data-structures', 'FIFO'],
        author: instructor._id,
        status: 'published'
      }
    ];

    console.log('\n📝 Creating Articles...');
    for (const articleData of articles) {
      const existing = await ArticleModel.findOne({ title: articleData.title });
      if (!existing) {
        await ArticleModel.create(articleData);
        console.log(`   ✅ ${articleData.title}`);
      } else {
        console.log(`   ⏭️  ${articleData.title} (already exists)`);
      }
    }

    // Sample Problems
    const problems = [
      {
        title: 'Valid Parentheses',
        category: 'Stack',
        difficulty: 'Easy',
        description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        inputFormat: 'A string of brackets',
        outputFormat: 'Boolean (true/false)',
        constraints: ['1 <= s.length <= 10^4'],
        sampleTestCases: [
          {
            input: '()',
            output: 'true',
            explanation: 'Valid parentheses'
          },
          {
            input: '()[]{}',
            output: 'true',
            explanation: 'All types of valid parentheses'
          }
        ],
        tags: ['stack', 'string', 'easy'],
        companies: ['Google', 'Amazon', 'Microsoft'],
        author: instructor._id,
        points: 15,
        status: 'published',
        isFeatured: true
      },
      {
        title: 'Reverse Linked List',
        category: 'Linked List',
        difficulty: 'Easy',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        inputFormat: 'Head of linked list',
        outputFormat: 'Head of reversed linked list',
        constraints: ['The number of nodes in the list is the range [0, 5000]'],
        sampleTestCases: [
          {
            input: '1->2->3->4->5',
            output: '5->4->3->2->1',
            explanation: 'Reversed linked list'
          }
        ],
        tags: ['linked-list', 'recursion'],
        companies: ['Facebook', 'Amazon', 'Google'],
        author: instructor._id,
        points: 20,
        status: 'published',
        isFeatured: true
      },
      {
        title: 'Binary Search',
        category: 'Array',
        difficulty: 'Easy',
        description: 'Given a sorted array of integers, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
        inputFormat: 'Sorted array and target value',
        outputFormat: 'Index or -1',
        constraints: ['1 <= nums.length <= 10^4', 'All elements are unique'],
        sampleTestCases: [
          {
            input: '[-1,0,3,5,9,12]\n9',
            output: '4',
            explanation: '9 exists in nums and its index is 4'
          }
        ],
        tags: ['array', 'binary-search'],
        companies: ['Amazon', 'Microsoft'],
        author: instructor._id,
        points: 15,
        status: 'published'
      },
      {
        title: 'Merge Two Sorted Lists',
        category: 'Linked List',
        difficulty: 'Easy',
        description: 'Merge two sorted linked lists and return it as a sorted list.',
        inputFormat: 'Two sorted linked lists',
        outputFormat: 'Merged sorted linked list',
        constraints: ['The number of nodes in both lists is in the range [0, 50]'],
        sampleTestCases: [
          {
            input: '1->2->4\n1->3->4',
            output: '1->1->2->3->4->4',
            explanation: 'Merged sorted list'
          }
        ],
        tags: ['linked-list', 'recursion', 'merge'],
        companies: ['Amazon', 'Google', 'Facebook'],
        author: instructor._id,
        points: 20,
        status: 'published'
      },
      {
        title: 'Maximum Subarray',
        category: 'Array',
        difficulty: 'Medium',
        description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
        inputFormat: 'Array of integers',
        outputFormat: 'Maximum sum',
        constraints: ['1 <= nums.length <= 10^5'],
        sampleTestCases: [
          {
            input: '[-2,1,-3,4,-1,2,1,-5,4]',
            output: '6',
            explanation: '[4,-1,2,1] has the largest sum = 6'
          }
        ],
        tags: ['array', 'dynamic-programming', 'kadane'],
        companies: ['Amazon', 'Microsoft', 'Google'],
        author: instructor._id,
        points: 30,
        status: 'published',
        isFeatured: true
      },
      {
        title: 'Climbing Stairs',
        category: 'Dynamic Programming',
        difficulty: 'Easy',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        inputFormat: 'Integer n',
        outputFormat: 'Number of ways',
        constraints: ['1 <= n <= 45'],
        sampleTestCases: [
          {
            input: '3',
            output: '3',
            explanation: 'Three ways: 1+1+1, 1+2, 2+1'
          }
        ],
        tags: ['dynamic-programming', 'math'],
        companies: ['Amazon', 'Google'],
        author: instructor._id,
        points: 15,
        status: 'published'
      }
    ];

    console.log('\n💻 Creating Problems...');
    for (const problemData of problems) {
      const existing = await ProblemModel.findOne({ title: problemData.title });
      if (!existing) {
        await ProblemModel.create(problemData);
        console.log(`   ✅ ${problemData.title}`);
      } else {
        console.log(`   ⏭️  ${problemData.title} (already exists)`);
      }
    }

    // Sample Courses
    const courses = [
      {
        title: 'Complete Python Programming',
        description: 'Master Python from basics to advanced topics',
        category: 'Programming',
        level: 'Beginner',
        price: 499,
        duration: '10 hours',
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500',
        instructor: instructor._id,
        syllabus: [
          'Python Basics',
          'Data Structures',
          'Object-Oriented Programming',
          'File Handling',
          'Web Development with Flask'
        ],
        requirements: ['Basic computer knowledge'],
        learningOutcomes: ['Write Python programs', 'Build web applications']
      },
      {
        title: 'Data Structures Mastery',
        description: 'Complete guide to data structures and algorithms',
        category: 'Computer Science',
        level: 'Intermediate',
        price: 799,
        duration: '20 hours',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
        instructor: instructor._id,
        syllabus: [
          'Arrays and Strings',
          'Linked Lists',
          'Stacks and Queues',
          'Trees and Graphs',
          'Advanced Algorithms'
        ],
        requirements: ['Programming knowledge in any language'],
        learningOutcomes: ['Master DSA', 'Crack coding interviews']
      },
      {
        title: 'Web Development Bootcamp',
        description: 'Full-stack web development with React and Node.js',
        category: 'Web Development',
        level: 'Intermediate',
        price: 1299,
        duration: '30 hours',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500',
        instructor: instructor._id,
        syllabus: [
          'HTML/CSS/JavaScript',
          'React.js',
          'Node.js and Express',
          'MongoDB',
          'Full-stack Projects'
        ],
        requirements: ['Basic programming knowledge'],
        learningOutcomes: ['Build full-stack applications', 'Deploy to cloud']
      }
    ];

    console.log('\n📚 Creating Courses...');
    for (const courseData of courses) {
      const existing = await CourseModel.findOne({ title: courseData.title });
      if (!existing) {
        await CourseModel.create(courseData);
        console.log(`   ✅ ${courseData.title}`);
      } else {
        console.log(`   ⏭️  ${courseData.title} (already exists)`);
      }
    }

    // Get created content for learning paths
    const createdArticles = await ArticleModel.find({ author: instructor._id }).limit(3);
    const createdProblems = await ProblemModel.find({ author: instructor._id }).limit(3);

    // Learning Paths
    const learningPaths = [
      {
        title: 'Complete DSA Path',
        category: 'DSA Complete',
        difficulty: 'Beginner',
        description: 'Master data structures and algorithms from scratch',
        estimatedDuration: 60,
        modules: [
          {
            moduleTitle: 'Arrays and Strings',
            moduleDescription: 'Fundamental array operations',
            order: 1,
            items: createdArticles.slice(0, 2).map((article, idx) => ({
              itemType: 'article',
              itemId: article._id,
              order: idx + 1,
              isOptional: false
            }))
          },
          {
            moduleTitle: 'Practice Problems',
            moduleDescription: 'Solve array problems',
            order: 2,
            items: createdProblems.slice(0, 2).map((problem, idx) => ({
              itemType: 'problem',
              itemId: problem._id,
              order: idx + 1,
              isOptional: false
            }))
          }
        ],
        prerequisites: ['Basic programming knowledge'],
        learningOutcomes: ['Master DSA concepts', 'Solve coding problems'],
        targetAudience: ['Students', 'Job Seekers'],
        skills: ['Problem Solving', 'Coding'],
        creator: instructor._id,
        status: 'published',
        isFeatured: true
      },
      {
        title: 'Interview Preparation Path',
        category: 'Interview Preparation',
        difficulty: 'Intermediate',
        description: 'Prepare for technical interviews at top companies',
        estimatedDuration: 40,
        modules: [
          {
            moduleTitle: 'Core Concepts',
            moduleDescription: 'Essential interview topics',
            order: 1,
            items: createdArticles.slice(0, 1).map((article, idx) => ({
              itemType: 'article',
              itemId: article._id,
              order: idx + 1,
              isOptional: false
            }))
          }
        ],
        prerequisites: ['DSA knowledge'],
        learningOutcomes: ['Crack interviews', 'Problem-solving skills'],
        targetAudience: ['Job Seekers'],
        skills: ['Interview Skills'],
        creator: instructor._id,
        status: 'published'
      }
    ];

    console.log('\n🎯 Creating Learning Paths...');
    for (const pathData of learningPaths) {
      const existing = await LearningPathModel.findOne({ title: pathData.title });
      if (!existing) {
        await LearningPathModel.create(pathData);
        console.log(`   ✅ ${pathData.title}`);
      } else {
        console.log(`   ⏭️  ${pathData.title} (already exists)`);
      }
    }

    // Summary
    const totalArticles = await ArticleModel.countDocuments();
    const totalProblems = await ProblemModel.countDocuments();
    const totalCourses = await CourseModel.countDocuments();
    const totalPaths = await LearningPathModel.countDocuments();

    console.log('\n🎉 Content Creation Complete!');
    console.log('\n📊 Database Summary:');
    console.log(`   📝 Articles: ${totalArticles}`);
    console.log(`   💻 Problems: ${totalProblems}`);
    console.log(`   📚 Courses: ${totalCourses}`);
    console.log(`   🎯 Learning Paths: ${totalPaths}`);
    
    console.log('\n🌐 Visit your application:');
    console.log('   🏠 Home: http://localhost:5173/');
    console.log('   📝 Articles: http://localhost:5173/articles');
    console.log('   💻 Problems: http://localhost:5173/problems');
    console.log('   🎯 Paths: http://localhost:5173/paths');
    console.log('   📚 Courses: http://localhost:5173/show-courses');

    if (instructor.email === 'instructor@learnify.com') {
      console.log('\n👤 Instructor Login:');
      console.log('   Email: instructor@learnify.com');
      console.log('   Password: instructor123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addMoreContent();
