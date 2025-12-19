import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

class GeminiAPIService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async generateCourse(topic, difficulty = 'intermediate', saveToDatabase = false) {
    try {
      const response = await this.api.post('/ai/generate-course', {
        topic,
        difficulty,
        generateAndSave: saveToDatabase
      });
      return response.data;
    } catch (error) {
      console.error('Error generating course:', error);
      throw this.handleError(error);
    }
  }

  async generateArticle(topic, category = 'technology', saveToDatabase = false) {
    try {
      const response = await this.api.post('/ai/generate-article', {
        topic,
        category,
        generateAndSave: saveToDatabase
      });
      return response.data;
    } catch (error) {
      console.error('Error generating article:', error);
      throw this.handleError(error);
    }
  }

  async generateProblem(topic, difficulty = 'medium', saveToDatabase = false) {
    try {
      const response = await this.api.post('/ai/generate-problem', {
        topic,
        difficulty,
        generateAndSave: saveToDatabase
      });
      return response.data;
    } catch (error) {
      console.error('Error generating problem:', error);
      throw this.handleError(error);
    }
  }

  async generateLearningPath(subject, goalLevel = 'advanced', saveToDatabase = false) {
    try {
      const response = await this.api.post('/ai/generate-learning-path', {
        subject,
        goalLevel,
        generateAndSave: saveToDatabase
      });
      return response.data;
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw this.handleError(error);
    }
  }

  async askTutor(question, context = '') {
    try {
      const response = await this.api.post('/ai/ask-tutor', {
        question,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Error asking AI tutor:', error);
      throw this.handleError(error);
    }
  }

  async generateQuiz(topic, numQuestions = 5, difficulty = 'medium') {
    try {
      const response = await this.api.post('/ai/generate-quiz', {
        topic,
        numQuestions,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw this.handleError(error);
    }
  }

  async improveCourse(courseId, currentContent) {
    try {
      const response = await this.api.post('/ai/improve-course', {
        courseId,
        currentContent
      });
      return response.data;
    } catch (error) {
      console.error('Error getting course improvement suggestions:', error);
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response && error.response.data && error.response.data.error) {
      return new Error(error.response.data.error);
    }
    return error;
  }
}

export default new GeminiAPIService();