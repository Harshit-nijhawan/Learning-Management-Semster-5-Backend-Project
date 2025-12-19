const mongoose = require('mongoose');
const DailyQuestion = require('../models/DailyQuestion');
require('dotenv').config();

const sampleQuestions = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    date: new Date(),
    testCases: [
      {
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
        isHidden: false
      },
      {
        input: "[3,2,4], 6",
        expectedOutput: "[1,2]",
        isHidden: false
      },
      {
        input: "[3,3], 6",
        expectedOutput: "[0,1]",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
    // Write your code here
    
}

// Test your solution
console.log(solution([2,7,11,15], 9)); // Expected: [0,1]`,
      python: "# Coming soon",
      java: "// Coming soon",
      cpp: "// Coming soon"
    },
    constraints: `• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    hints: [
      "Try using a hash map to store values you've seen.",
      "For each number, check if (target - current number) exists in your hash map.",
      "The time complexity can be O(n) with a hash map approach."
    ]
  },
  {
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: "Easy",
    tags: ["Two Pointers", "String"],
    date: new Date(Date.now() + 86400000), // Tomorrow
    testCases: [
      {
        input: "['h','e','l','l','o']",
        expectedOutput: "['o','l','l','e','h']",
        isHidden: false
      },
      {
        input: "['H','a','n','n','a','h']",
        expectedOutput: "['h','a','n','n','a','H']",
        isHidden: false
      },
      {
        input: "['a']",
        expectedOutput: "['a']",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function solution(s) {
    // Write your code here
    
}

// Test your solution
const test = ['h','e','l','l','o'];
solution(test);
console.log(test); // Expected: ['o','l','l','e','h']`,
      python: "# Coming soon",
      java: "// Coming soon",
      cpp: "// Coming soon"
    },
    constraints: `• 1 <= s.length <= 10^5
• s[i] is a printable ascii character.`,
    examples: [
      {
        input: "s = ['h','e','l','l','o']",
        output: "['o','l','l','e','h']",
        explanation: "The string is reversed in-place."
      },
      {
        input: "s = ['H','a','n','n','a','h']",
        output: "['h','a','n','n','a','H']",
        explanation: "The palindrome is reversed."
      }
    ],
    hints: [
      "Use two pointers approach - one at the start and one at the end.",
      "Swap characters at both pointers and move them towards the center.",
      "Stop when the pointers meet in the middle."
    ]
  },
  {
    title: "Valid Palindrome",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    difficulty: "Easy",
    tags: ["Two Pointers", "String"],
    date: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
    testCases: [
      {
        input: "'A man, a plan, a canal: Panama'",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "'race a car'",
        expectedOutput: "false",
        isHidden: false
      },
      {
        input: "' '",
        expectedOutput: "true",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function solution(s) {
    // Write your code here
    
}

// Test your solution
console.log(solution("A man, a plan, a canal: Panama")); // Expected: true`,
      python: "# Coming soon",
      java: "// Coming soon",
      cpp: "// Coming soon"
    },
    constraints: `• 1 <= s.length <= 2 * 10^5
• s consists only of printable ASCII characters.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: 'After cleaning, it becomes "amanaplanacanalpanama" which is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: 'After cleaning, it becomes "raceacar" which is not a palindrome.'
      }
    ],
    hints: [
      "First, clean the string by removing non-alphanumeric characters and converting to lowercase.",
      "Use two pointers to compare characters from both ends.",
      "You can also solve this without creating a new string for better space complexity."
    ]
  },
  {
    title: "Maximum Subarray",
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    date: new Date(Date.now() + 3 * 86400000),
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6",
        isHidden: false
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "[5,4,-1,7,8]",
        expectedOutput: "23",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function solution(nums) {
    // Write your code here
    
}

// Test your solution
console.log(solution([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6`,
      python: "# Coming soon",
      java: "// Coming soon",
      cpp: "// Coming soon"
    },
    constraints: `• 1 <= nums.length <= 10^5
• -10^4 <= nums[i] <= 10^4`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1."
      }
    ],
    hints: [
      "Think about Kadane's Algorithm.",
      "Keep track of the current sum and the maximum sum seen so far.",
      "If current sum becomes negative, reset it to 0."
    ]
  },
  {
    title: "Merge Two Sorted Lists",
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    date: new Date(Date.now() + 4 * 86400000),
    testCases: [
      {
        input: "[1,2,4], [1,3,4]",
        expectedOutput: "[1,1,2,3,4,4]",
        isHidden: false
      },
      {
        input: "[], []",
        expectedOutput: "[]",
        isHidden: false
      },
      {
        input: "[], [0]",
        expectedOutput: "[0]",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} list1
 * @param {number[]} list2
 * @return {number[]}
 */
function solution(list1, list2) {
    // For simplicity, work with arrays
    // Write your code here
    
}

// Test your solution
console.log(solution([1,2,4], [1,3,4])); // Expected: [1,1,2,3,4,4]`,
      python: "# Coming soon",
      java: "// Coming soon",
      cpp: "// Coming soon"
    },
    constraints: `• The number of nodes in both lists is in the range [0, 50].
• -100 <= Node.val <= 100
• Both list1 and list2 are sorted in non-decreasing order.`,
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Merge both sorted lists into one sorted list."
      }
    ],
    hints: [
      "Use two pointers to traverse both lists.",
      "Compare elements and add the smaller one to the result.",
      "Can you solve it recursively?"
    ]
  }
];

async function seedDailyQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing daily questions
    await DailyQuestion.deleteMany({});
    console.log('🗑️  Cleared existing daily questions');

    // Insert sample questions
    await DailyQuestion.insertMany(sampleQuestions);
    console.log(`✅ Successfully seeded ${sampleQuestions.length} daily questions`);

    // Display seeded questions
    console.log('\n📋 Seeded Questions:');
    sampleQuestions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.title} (${q.difficulty}) - ${new Date(q.date).toDateString()}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding daily questions:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDailyQuestions();
