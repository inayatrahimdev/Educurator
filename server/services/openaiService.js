/**
 * Azure OpenAI Service
 * Provides personalized learning recommendations and course suggestions
 */

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
require('dotenv').config();

// Azure OpenAI Configuration
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || 'https://ai-inayat.openai.azure.com/';
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY || '';
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4';
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

let client = null;

/**
 * Initialize OpenAI client
 */
function getClient() {
    if (!client && AZURE_OPENAI_KEY) {
        client = new OpenAIClient(
            AZURE_OPENAI_ENDPOINT,
            new AzureKeyCredential(AZURE_OPENAI_KEY)
        );
    }
    return client;
}

/**
 * Get personalized learning recommendations based on user profile
 * @param {Object} userProfile - User profile with interests, goals, current skills
 * @param {Array} availableCourses - List of available courses
 * @returns {Promise<Object>} Personalized recommendations
 */
async function getPersonalizedRecommendations(userProfile, availableCourses) {
    try {
        const client = getClient();
        if (!client) {
            console.warn('OpenAI client not initialized, returning default recommendations');
            return getDefaultRecommendations(userProfile, availableCourses);
        }

        const { interests = [], difficulty = 'beginner', goals = [], currentSkills = [] } = userProfile;

        const prompt = `You are an expert educational advisor. Based on the following user profile, recommend the best learning path and courses.

User Profile:
- Interests: ${interests.join(', ') || 'Not specified'}
- Current Skill Level: ${difficulty}
- Goals: ${goals.join(', ') || 'Not specified'}
- Current Skills: ${currentSkills.join(', ') || 'None'}

Available Course Categories:
${availableCourses.map(c => `- ${c.title} (${c.tags?.join(', ') || 'No tags'})`).join('\n')}

Provide:
1. Top 5 recommended courses with reasons
2. Learning path sequence
3. Skills they will gain
4. Estimated time to complete
5. Career opportunities after completion

Format as JSON with structure:
{
  "recommendedCourses": [{"courseId": number, "reason": "string", "priority": number}],
  "learningPath": ["course1", "course2", ...],
  "skillsToGain": ["skill1", "skill2", ...],
  "estimatedTime": "string",
  "careerOpportunities": ["opportunity1", "opportunity2", ...],
  "personalizedMessage": "string"
}`;

        const response = await client.getChatCompletions(
            AZURE_OPENAI_DEPLOYMENT,
            [
                {
                    role: 'system',
                    content: 'You are an expert educational advisor who provides personalized learning recommendations. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            {
                temperature: 0.7,
                maxTokens: 1500
            }
        );

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                // Extract JSON from response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (parseError) {
                console.error('Error parsing OpenAI response:', parseError);
            }
        }

        return getDefaultRecommendations(userProfile, availableCourses);
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        return getDefaultRecommendations(userProfile, availableCourses);
    }
}

/**
 * Get default recommendations when OpenAI is not available
 */
function getDefaultRecommendations(userProfile, availableCourses) {
    const { interests = [], difficulty = 'beginner' } = userProfile;
    
    // Filter courses by interests and difficulty
    let recommended = availableCourses.filter(course => {
        const courseTags = course.tags || [];
        const hasInterest = interests.length === 0 || 
            interests.some(interest => 
                courseTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
            );
        return hasInterest;
    });

    // Sort by relevance and limit to 5
    recommended = recommended.slice(0, 5).map((course, index) => ({
        courseId: course.id,
        reason: `Matches your interests in ${interests.join(', ') || 'learning'}`,
        priority: index + 1
    }));

    return {
        recommendedCourses: recommended,
        learningPath: recommended.map(r => `Course ${r.courseId}`),
        skillsToGain: ['Practical skills', 'Industry knowledge', 'Professional development'],
        estimatedTime: '3-6 months',
        careerOpportunities: ['Freelancing', 'Employment', 'Entrepreneurship'],
        personalizedMessage: `Based on your interests, we recommend starting with these courses to build your skills and advance your career.`
    };
}

/**
 * Generate personalized course content suggestions
 * @param {Object} course - Course object
 * @param {Object} userProfile - User profile
 * @returns {Promise<Array>} Suggested content modules
 */
async function generateCourseContent(course, userProfile) {
    try {
        const client = getClient();
        if (!client) {
            return [];
        }

        const prompt = `Generate practical, industry-level learning modules for this course:

Course: ${course.title}
Description: ${course.description}
Tags: ${course.tags?.join(', ') || 'General'}

User Level: ${userProfile.difficulty || 'beginner'}
User Goals: ${userProfile.goals?.join(', ') || 'Skill development'}

Create 5-7 practical modules that:
1. Are hands-on and practical
2. Include real-world examples
3. Help earn money and support family
4. Create positive social impact
5. Are industry-level and cutting-edge

Format as JSON array:
[
  {
    "title": "string",
    "content": "string",
    "orderIndex": number,
    "learningObjectives": ["obj1", "obj2"],
    "practicalExercises": ["exercise1", "exercise2"],
    "realWorldApplications": ["app1", "app2"]
  }
]`;

        const response = await client.getChatCompletions(
            AZURE_OPENAI_DEPLOYMENT,
            [
                {
                    role: 'system',
                    content: 'You are an expert course designer. Create practical, industry-level learning content. Always respond with valid JSON array only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            {
                temperature: 0.8,
                maxTokens: 2000
            }
        );

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (parseError) {
                console.error('Error parsing OpenAI response:', parseError);
            }
        }

        return [];
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        return [];
    }
}

/**
 * Analyze user progress and provide personalized feedback
 * @param {Object} userProgress - User progress data
 * @param {Object} userProfile - User profile
 * @returns {Promise<Object>} Personalized feedback and suggestions
 */
async function analyzeProgress(userProgress, userProfile) {
    try {
        const client = getClient();
        if (!client) {
            return {
                feedback: 'Keep up the good work! Continue learning and practicing.',
                suggestions: ['Complete current courses', 'Practice regularly', 'Apply skills in real projects'],
                nextSteps: ['Continue current learning path', 'Explore advanced topics']
            };
        }

        const prompt = `Analyze this learner's progress and provide personalized feedback:

User Profile:
- Level: ${userProfile.difficulty}
- Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}

Progress Data:
${JSON.stringify(userProgress, null, 2)}

Provide:
1. Encouraging feedback
2. Areas for improvement
3. Next steps and recommendations
4. Motivation for continuing learning

Format as JSON:
{
  "feedback": "string",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "nextSteps": ["step1", "step2"],
  "motivationalMessage": "string"
}`;

        const response = await client.getChatCompletions(
            AZURE_OPENAI_DEPLOYMENT,
            [
                {
                    role: 'system',
                    content: 'You are a supportive learning coach. Provide encouraging, constructive feedback. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            {
                temperature: 0.7,
                maxTokens: 1000
            }
        );

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (parseError) {
                console.error('Error parsing OpenAI response:', parseError);
            }
        }

        return {
            feedback: 'Keep up the good work! Continue learning and practicing.',
            suggestions: ['Complete current courses', 'Practice regularly', 'Apply skills in real projects'],
            nextSteps: ['Continue current learning path', 'Explore advanced topics']
        };
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        return {
            feedback: 'Keep up the good work! Continue learning and practicing.',
            suggestions: ['Complete current courses', 'Practice regularly', 'Apply skills in real projects'],
            nextSteps: ['Continue current learning path', 'Explore advanced topics']
        };
    }
}

/**
 * Generate personalized learning questions for assessment
 * @param {Object} course - Course object
 * @param {Object} userProfile - User profile
 * @returns {Promise<Array>} Learning questions
 */
async function generateLearningQuestions(course, userProfile) {
    try {
        const client = getClient();
        if (!client) {
            return [];
        }

        const prompt = `Generate 5 practical learning questions for this course:

Course: ${course.title}
User Level: ${userProfile.difficulty || 'beginner'}

Questions should:
1. Test practical understanding
2. Be relevant to real-world applications
3. Help identify knowledge gaps
4. Encourage critical thinking

Format as JSON array:
[
  {
    "question": "string",
    "type": "multiple_choice" | "short_answer" | "practical",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "string",
    "explanation": "string"
  }
]`;

        const response = await client.getChatCompletions(
            AZURE_OPENAI_DEPLOYMENT,
            [
                {
                    role: 'system',
                    content: 'You are an expert educator. Create practical, relevant learning questions. Always respond with valid JSON array only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            {
                temperature: 0.7,
                maxTokens: 1500
            }
        );

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (parseError) {
                console.error('Error parsing OpenAI response:', parseError);
            }
        }

        return [];
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        return [];
    }
}

module.exports = {
    getPersonalizedRecommendations,
    generateCourseContent,
    analyzeProgress,
    generateLearningQuestions,
    getClient
};
