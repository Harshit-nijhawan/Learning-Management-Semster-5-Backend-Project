const express = require('express');
const router = express.Router();
const dailyQuestionController = require('../controllers/dailyQuestion.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/role.middleware');

// Public routes (require authentication)
router.get('/today', authMiddleware, dailyQuestionController.getTodaysQuestion);
router.get('/my-submissions', authMiddleware, dailyQuestionController.getUserSubmissions);
router.post('/submit', authMiddleware, dailyQuestionController.submitSolution);
router.get('/my-stats', authMiddleware, dailyQuestionController.getUserStats);

// Admin routes
router.get('/all', 
  authMiddleware, 
  checkRole('admin'), 
  dailyQuestionController.getAllDailyQuestions
);

router.post('/create', 
  authMiddleware, 
  checkRole('admin'), 
  dailyQuestionController.createDailyQuestion
);

module.exports = router;
