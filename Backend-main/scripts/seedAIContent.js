const Course = require('../models/Course');
const Article = require('../models/Article');
const Problem = require('../models/Problem');
const LearningPath = require('../models/LearningPath');

// Sample AI-generated courses
const sampleCourses = [
  {
    title: "Modern React Development",
    description: "Master React.js with hooks, context, and modern patterns. Build scalable applications with confidence.",
    instructor: "AI Generated",
    price: 0,
    duration: "8 weeks",
    level: "intermediate",
    category: "Web Development",
    objectives: [
      "Master React hooks and functional components",
      "Understand state management with Context API",
      "Build responsive and accessible web applications",
      "Implement modern React patterns and best practices"
    ],
    modules: [
      {
        title: "Introduction to Modern React",
        description: "Learn the fundamentals of React with hooks and functional components",
        duration: "1 week"
      },
      {
        title: "State Management & Context API",
        description: "Master state management techniques using React hooks and Context API",
        duration: "1.5 weeks"
      },
      {
        title: "Advanced React Patterns",
        description: "Explore advanced patterns like render props, HOCs, and custom hooks",
        duration: "2 weeks"
      },
      {
        title: "Performance Optimization",
        description: "Learn to optimize React applications for better performance",
        duration: "1.5 weeks"
      },
      {
        title: "Testing React Applications",
        description: "Implement comprehensive testing strategies for React apps",
        duration: "1 week"
      },
      {
        title: "Deployment and Best Practices",
        description: "Deploy React applications and follow industry best practices",
        duration: "1 week"
      }
    ],
    prerequisites: ["Basic JavaScript knowledge", "HTML/CSS fundamentals", "ES6+ syntax"],
    skills: ["React.js", "JavaScript", "Web Development", "Frontend Development"],
    isAIGenerated: true
  },
  {
    title: "Data Structures and Algorithms Mastery",
    description: "Comprehensive course covering essential data structures and algorithms for technical interviews and software development.",
    instructor: "AI Generated",
    price: 0,
    duration: "12 weeks",
    level: "intermediate",
    category: "Computer Science",
    objectives: [
      "Understand fundamental data structures and their operations",
      "Master common algorithms and their time complexities",
      "Solve complex problems using appropriate data structures",
      "Prepare for technical interviews at top companies"
    ],
    modules: [
      {
        title: "Arrays and Strings",
        description: "Master array manipulation and string processing techniques",
        duration: "2 weeks"
      },
      {
        title: "Linked Lists and Stacks",
        description: "Learn linear data structures and their applications",
        duration: "2 weeks"
      },
      {
        title: "Trees and Binary Search Trees",
        description: "Explore hierarchical data structures and tree algorithms",
        duration: "2 weeks"
      },
      {
        title: "Graphs and Graph Algorithms",
        description: "Study graph representation and traversal algorithms",
        duration: "2 weeks"
      },
      {
        title: "Dynamic Programming",
        description: "Master dynamic programming techniques and optimization",
        duration: "2 weeks"
      },
      {
        title: "Advanced Algorithms",
        description: "Explore advanced algorithmic techniques and problem-solving",
        duration: "2 weeks"
      }
    ],
    prerequisites: ["Basic programming knowledge", "Mathematical thinking", "Problem-solving skills"],
    skills: ["Data Structures", "Algorithms", "Problem Solving", "Technical Interviews"],
    isAIGenerated: true
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning concepts, algorithms, and practical applications using Python.",
    instructor: "AI Generated",
    price: 0,
    duration: "10 weeks",
    level: "beginner",
    category: "Data Science",
    objectives: [
      "Understand core machine learning concepts and terminology",
      "Implement basic ML algorithms from scratch",
      "Use popular ML libraries like scikit-learn and pandas",
      "Build and evaluate machine learning models"
    ],
    modules: [
      {
        title: "Introduction to Machine Learning",
        description: "Overview of ML concepts, types, and applications",
        duration: "1 week"
      },
      {
        title: "Data Preprocessing and Analysis",
        description: "Learn to clean, process, and analyze datasets",
        duration: "2 weeks"
      },
      {
        title: "Supervised Learning - Regression",
        description: "Master linear and polynomial regression techniques",
        duration: "2 weeks"
      },
      {
        title: "Supervised Learning - Classification",
        description: "Explore classification algorithms and evaluation metrics",
        duration: "2 weeks"
      },
      {
        title: "Unsupervised Learning",
        description: "Study clustering and dimensionality reduction techniques",
        duration: "2 weeks"
      },
      {
        title: "Model Evaluation and Deployment",
        description: "Learn to evaluate models and deploy ML solutions",
        duration: "1 week"
      }
    ],
    prerequisites: ["Python programming", "Basic statistics", "Linear algebra basics"],
    skills: ["Machine Learning", "Python", "Data Analysis", "Statistical Modeling"],
    isAIGenerated: true
  }
];

// Sample AI-generated articles
const sampleArticles = [
  {
    title: "Understanding React Hooks: A Complete Guide",
    content: `# Understanding React Hooks: A Complete Guide

React Hooks revolutionized the way we write React components by allowing us to use state and other React features in functional components. This comprehensive guide will walk you through everything you need to know about React Hooks.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They were introduced in React 16.8 and have since become the standard way of writing React components.

### Key Benefits of Hooks:
- **Simplified Logic**: No need for class components in most cases
- **Reusable Logic**: Custom hooks allow sharing stateful logic between components
- **Better Performance**: Optimized rendering with proper dependency management
- **Cleaner Code**: More readable and maintainable component structure

## Core Hooks

### useState Hook
The \`useState\` hook allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect Hook
The \`useEffect\` hook lets you perform side effects in functional components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []); // Empty dependency array means this runs once
  
  return <div>{data ? \`Data: \${data}\` : 'Loading...'}</div>;
}
\`\`\`

## Advanced Hooks

### useContext Hook
Provides a way to consume context without nesting:

\`\`\`javascript
import React, { useContext } from 'react';

const UserContext = React.createContext();

function UserProfile() {
  const user = useContext(UserContext);
  return <div>Hello, {user.name}!</div>;
}
\`\`\`

### useReducer Hook
For complex state logic, similar to Redux:

\`\`\`javascript
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
\`\`\`

## Custom Hooks

Custom hooks let you extract component logic into reusable functions:

\`\`\`javascript
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowWidth;
}

// Usage in component
function ResponsiveComponent() {
  const windowWidth = useWindowWidth();
  
  return <div>Window width: {windowWidth}px</div>;
}
\`\`\`

## Best Practices

1. **Rules of Hooks**: Always call hooks at the top level, never inside loops, conditions, or nested functions
2. **Dependency Arrays**: Always include all dependencies in useEffect arrays
3. **Custom Hook Naming**: Always start custom hook names with "use"
4. **Performance Optimization**: Use useMemo and useCallback for expensive operations
5. **Clean Up**: Always clean up subscriptions and timers in useEffect return functions

## Conclusion

React Hooks have transformed React development by making functional components more powerful and reusable. They provide a cleaner, more intuitive way to manage state and side effects while promoting better code organization and reusability.

Start incorporating hooks into your React applications today and experience the improved developer experience they provide!`,
    summary: "A comprehensive guide to React Hooks, covering core hooks like useState and useEffect, advanced hooks, custom hooks, and best practices for modern React development.",
    author: "AI Generated",
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "Programming"],
    readTime: "8 min read",
    takeaways: [
      "React Hooks simplify state management in functional components",
      "useEffect replaces lifecycle methods for side effects",
      "Custom hooks enable reusable stateful logic",
      "Following the Rules of Hooks is crucial for proper functionality",
      "Hooks improve code readability and maintainability"
    ],
    isAIGenerated: true
  },
  {
    title: "Introduction to Machine Learning: Concepts and Applications",
    content: `# Introduction to Machine Learning: Concepts and Applications

Machine Learning (ML) has become one of the most transformative technologies of our time, powering everything from recommendation systems to autonomous vehicles. This article provides a comprehensive introduction to ML concepts and their real-world applications.

## What is Machine Learning?

Machine Learning is a subset of Artificial Intelligence (AI) that enables computers to learn and improve from experience without being explicitly programmed. Instead of following pre-programmed instructions, ML systems use algorithms to analyze data, identify patterns, and make predictions or decisions.

### Key Characteristics:
- **Data-Driven**: Learns from historical data
- **Pattern Recognition**: Identifies complex patterns in data
- **Adaptive**: Improves performance over time
- **Automated Decision Making**: Makes predictions without human intervention

## Types of Machine Learning

### 1. Supervised Learning
Uses labeled training data to learn a mapping from inputs to outputs.

**Common Algorithms:**
- Linear Regression
- Decision Trees
- Random Forest
- Support Vector Machines (SVM)
- Neural Networks

**Applications:**
- Email spam detection
- Image classification
- Price prediction
- Medical diagnosis

**Example:**
\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Sample code for house price prediction
X_train, X_test, y_train, y_test = train_test_split(features, prices, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`

### 2. Unsupervised Learning
Finds hidden patterns in data without labeled examples.

**Common Algorithms:**
- K-Means Clustering
- Hierarchical Clustering
- Principal Component Analysis (PCA)
- Association Rules

**Applications:**
- Customer segmentation
- Anomaly detection
- Data compression
- Market basket analysis

### 3. Reinforcement Learning
Learns through interaction with an environment using rewards and penalties.

**Applications:**
- Game playing (AlphaGo, Chess)
- Robotics
- Autonomous vehicles
- Trading systems

## Machine Learning Workflow

### 1. Data Collection
Gather relevant, high-quality data from various sources.

### 2. Data Preprocessing
Clean and prepare data for analysis:
- Handle missing values
- Remove outliers
- Normalize/standardize features
- Encode categorical variables

### 3. Feature Engineering
Select and create relevant features that help the model learn effectively.

### 4. Model Selection
Choose appropriate algorithms based on:
- Problem type (classification, regression, clustering)
- Data size and complexity
- Performance requirements
- Interpretability needs

### 5. Training
Train the model using the prepared data.

### 6. Evaluation
Assess model performance using appropriate metrics:
- **Classification**: Accuracy, Precision, Recall, F1-score
- **Regression**: Mean Squared Error (MSE), R-squared
- **Clustering**: Silhouette score, Inertia

### 7. Deployment
Deploy the model to production environment for real-world use.

## Real-World Applications

### Healthcare
- **Medical Imaging**: Detecting tumors in X-rays and MRI scans
- **Drug Discovery**: Identifying potential new medications
- **Personalized Treatment**: Tailoring treatments to individual patients
- **Epidemic Prediction**: Modeling disease spread patterns

### Finance
- **Fraud Detection**: Identifying suspicious transactions
- **Algorithmic Trading**: Automated investment strategies
- **Credit Scoring**: Assessing loan default risk
- **Risk Management**: Portfolio optimization

### Technology
- **Search Engines**: Improving search result relevance
- **Recommendation Systems**: Netflix, Amazon, Spotify recommendations
- **Natural Language Processing**: Chatbots, language translation
- **Computer Vision**: Facial recognition, object detection

### Transportation
- **Route Optimization**: GPS navigation systems
- **Autonomous Vehicles**: Self-driving car technology
- **Traffic Management**: Optimizing traffic flow
- **Predictive Maintenance**: Vehicle maintenance scheduling

## Getting Started with Machine Learning

### Essential Skills
1. **Programming**: Python or R
2. **Mathematics**: Statistics, linear algebra, calculus
3. **Data Analysis**: Pandas, NumPy, data visualization
4. **ML Libraries**: scikit-learn, TensorFlow, PyTorch

### Learning Path
1. **Foundation**: Statistics and programming basics
2. **Tools**: Learn Python/R and ML libraries
3. **Practice**: Work on projects with real datasets
4. **Specialization**: Focus on specific domains (NLP, Computer Vision, etc.)
5. **Advanced Topics**: Deep learning, MLOps, model deployment

### Common Challenges
- **Data Quality**: Incomplete or biased data
- **Overfitting**: Model performs well on training data but poorly on new data
- **Feature Selection**: Choosing relevant features
- **Interpretability**: Understanding how models make decisions
- **Scalability**: Handling large datasets and real-time requirements

## Future of Machine Learning

### Emerging Trends
- **AutoML**: Automated machine learning model development
- **Explainable AI**: Making ML models more interpretable
- **Edge Computing**: Running ML on mobile and IoT devices
- **Federated Learning**: Training models without centralizing data
- **Quantum Machine Learning**: Leveraging quantum computing

### Ethical Considerations
- **Bias and Fairness**: Ensuring ML systems are fair and unbiased
- **Privacy**: Protecting user data and privacy
- **Transparency**: Making AI decisions explainable
- **Accountability**: Establishing responsibility for AI decisions

## Conclusion

Machine Learning is transforming industries and creating new possibilities for solving complex problems. As data continues to grow exponentially, ML will become even more crucial for extracting insights and automating decisions.

Whether you're a student, professional, or entrepreneur, understanding ML concepts and applications will be increasingly valuable. Start with the basics, practice with real data, and gradually explore more advanced topics to build your ML expertise.

The future belongs to those who can harness the power of data and machine learning to create intelligent solutions!`,
    summary: "An introductory guide to machine learning concepts, types, workflow, and real-world applications across various industries.",
    author: "AI Generated",
    category: "Data Science",
    tags: ["Machine Learning", "AI", "Data Science", "Python", "Algorithms"],
    readTime: "12 min read",
    takeaways: [
      "Machine learning enables computers to learn from data without explicit programming",
      "Three main types: supervised, unsupervised, and reinforcement learning",
      "ML workflow involves data collection, preprocessing, modeling, and deployment",
      "Applications span healthcare, finance, technology, and transportation",
      "Essential skills include programming, mathematics, and data analysis"
    ],
    isAIGenerated: true
  }
];

// Sample AI-generated problems
const sampleProblems = [
  {
    title: "Two Sum Problem",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    difficulty: "easy",
    inputFormat: "The first line contains an integer n, the length of the array. The second line contains n space-separated integers representing the array. The third line contains the target integer.",
    outputFormat: "Return two integers representing the indices of the two numbers that add up to the target.",
    examples: [
      {
        input: "4\\n2 7 11 15\\n9",
        output: "0 1",
        explanation: "Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
      },
      {
        input: "3\\n3 2 4\\n6",
        output: "1 2",
        explanation: "Because nums[1] + nums[2] = 2 + 4 = 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists"
    ],
    hint: "Use a hash map to store the complement of each number and its index as you iterate through the array.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["Array", "Hash Table", "Two Pointers"],
    isAIGenerated: true
  },
  {
    title: "Valid Parentheses",
    statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "easy",
    inputFormat: "A single line containing a string s of parentheses characters.",
    outputFormat: "Return 'true' if the string is valid, 'false' otherwise.",
    examples: [
      {
        input: "()",
        output: "true",
        explanation: "The string contains a valid pair of parentheses."
      },
      {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are properly matched and nested."
      },
      {
        input: "(]",
        output: "false",
        explanation: "The brackets are not properly matched."
      }
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'."
    ],
    hint: "Use a stack to keep track of opening brackets. When you encounter a closing bracket, check if it matches the most recent opening bracket.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["String", "Stack", "Parentheses"],
    isAIGenerated: true
  },
  {
    title: "Binary Tree Inorder Traversal",
    statement: "Given the root of a binary tree, return the inorder traversal of its nodes' values. Inorder traversal visits nodes in the order: left subtree, root, right subtree.",
    difficulty: "medium",
    inputFormat: "The first line contains the number of nodes n. The following lines describe the binary tree structure.",
    outputFormat: "Return an array of integers representing the inorder traversal of the binary tree.",
    examples: [
      {
        input: "Tree: [1,null,2,3]\\n  1\\n   \\\\\\n    2\\n   /\\n  3",
        output: "[1,3,2]",
        explanation: "Inorder traversal: left subtree (empty), root (1), right subtree (3,2)"
      },
      {
        input: "Tree: []",
        output: "[]",
        explanation: "Empty tree returns empty array."
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100]",
      "-100 ≤ Node.val ≤ 100"
    ],
    hint: "Use recursion or an iterative approach with a stack. For recursion: traverse left, visit root, traverse right.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is the height of the tree",
    tags: ["Binary Tree", "Traversal", "Recursion", "Stack"],
    isAIGenerated: true
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing AI-generated content
    await Course.deleteMany({ isAIGenerated: true });
    await Article.deleteMany({ isAIGenerated: true });
    await Problem.deleteMany({ isAIGenerated: true });

    // Insert sample courses
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`✅ Inserted ${insertedCourses.length} sample courses`);

    // Insert sample articles
    const insertedArticles = await Article.insertMany(sampleArticles);
    console.log(`✅ Inserted ${insertedArticles.length} sample articles`);

    // Insert sample problems
    const insertedProblems = await Problem.insertMany(sampleProblems);
    console.log(`✅ Inserted ${insertedProblems.length} sample problems`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Sample data includes:');
    console.log(`   - ${insertedCourses.length} AI-generated courses`);
    console.log(`   - ${insertedArticles.length} AI-generated articles`);
    console.log(`   - ${insertedProblems.length} AI-generated problems`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

module.exports = { seedDatabase };