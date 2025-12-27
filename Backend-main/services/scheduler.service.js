const cron = require('node-cron');
const DailyQuestion = require('../models/DailyQuestion');
const Problem = require('../models/Problem');

const selectDailyQuestion = async () => {
    try {
        console.log('🔄 Running Daily Question Scheduler...');

        // 1. Check if a question for TODAY explicitly exists
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingQuestion = await DailyQuestion.findOne({
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingQuestion) {
            console.log(`✅ Daily question for ${today.toDateString()} already exists: ${existingQuestion.title}`);
            return;
        }

        // 2. Determine Pattern (Difficulty Rotation)
        // Pattern: Easy -> Medium -> Easy -> Medium -> Hard -> Medium -> Repeat
        const pattern = ['Easy', 'Medium', 'Easy', 'Medium', 'Hard', 'Medium'];
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const targetDifficulty = pattern[dayOfYear % pattern.length];

        console.log(`🎯 Target Difficulty for today: ${targetDifficulty}`);

        // 3. Find a problem that has NOT been used as a Daily Question
        // Get all titles of past daily questions to exclude them
        const pastDailyTitles = await DailyQuestion.find().distinct('title');

        // Find a candidate problem
        const candidateEndpoint = await Problem.aggregate([
            {
                $match: {
                    difficulty: targetDifficulty,
                    status: 'published',
                    title: { $nin: pastDailyTitles } // Exclude already used
                }
            },
            { $sample: { size: 1 } } // Randomly pick one from the pool
        ]);

        let selectedProblem = candidateEndpoint[0];

        // Fallback: If no problem matches the strict criteria (e.g., ran out of Hard problems), relax criteria
        if (!selectedProblem) {
            console.log('⚠️ No fresh problem found matching specific difficulty. Relaxing criteria...');
            const fallbackCandidate = await Problem.aggregate([
                {
                    $match: {
                        status: 'published',
                        title: { $nin: pastDailyTitles }
                    }
                },
                { $sample: { size: 1 } }
            ]);
            selectedProblem = fallbackCandidate[0];
        }

        if (!selectedProblem) {
            console.log('❌ CRITICAL: No new problems available in the database!');
            return;
        }

        // 4. Create the Daily Question entry
        const newDaily = new DailyQuestion({
            title: selectedProblem.title,
            slug: selectedProblem.slug,
            description: selectedProblem.description,
            difficulty: selectedProblem.difficulty,
            tags: selectedProblem.tags,
            date: today,
            testCases: selectedProblem.hiddenTestCases.map(tc => ({ ...tc, isHidden: true })).concat(
                selectedProblem.sampleTestCases.map(tc => ({ ...tc, isHidden: false }))
            ),
            starterCode: {
                // Determine starter code (Problem model usually stores solutions, not starter code templates per se, 
                // but let's try to infer or use empty templates if not available)
                // Or we can modify Problem model to store starter templates. 
                // For now, providing generic empty function signature based on simple heuristics or empty.
                javascript: `// Write your solution for ${selectedProblem.title} here...`,
                python: `# Write your solution for ${selectedProblem.title} here...`,
                java: `// Write your solution for ${selectedProblem.title} here...`,
                cpp: `// Write your solution for ${selectedProblem.title} here...`
            },
            constraints: selectedProblem.constraints ? selectedProblem.constraints.join('\n') : '',
            examples: selectedProblem.sampleTestCases.map((tc, idx) => ({
                input: tc.input,
                output: tc.output,
                explanation: tc.explanation || `Example ${idx + 1}`
            })),
            hints: selectedProblem.hints || []
        });

        await newDaily.save();
        console.log(`✨ Successfully created Daily Question for ${today.toDateString()}: ${newDaily.title}`);

    } catch (error) {
        console.error('❌ Error in SelectDailyQuestion:', error);
    }
};

// Initialize Cron Job
const initCronJobs = () => {
    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', () => {
        selectDailyQuestion();
    });

    // Also run once on server startup to ensure today has a question if missed
    selectDailyQuestion();
};

module.exports = initCronJobs;
