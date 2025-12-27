const mongoose = require('mongoose');
const DailyQuestion = require('../models/DailyQuestion');
require('dotenv').config({ path: '../.env' }); // Load from parent directory

async function fixSlugs() {
    try {
        const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Students";

        console.log('Connecting to MongoDB at:', MONGO_URL);
        await mongoose.connect(MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const questions = await DailyQuestion.find({});
        console.log(`Found ${questions.length} questions to update.`);

        for (const q of questions) {
            // The pre-save hook we added will automatically generate the slug
            // if it's missing. We just need to save the document.
            // We explicitly mark as modified to be safe, though pre-save checks !this.slug
            if (!q.slug) {
                console.log(`Updating slug for: ${q.title}`);
                await q.save();
                console.log(`  -> New slug: ${q.slug}`);
            } else {
                console.log(`Skipping ${q.title}, already has slug: ${q.slug}`);
            }
        }

        console.log('✅ All questions updated.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating slugs:', error);
        process.exit(1);
    }
}

fixSlugs();
