# 🚀 Educurator - Azure Deployment Ready

## Industry-Level Personalized Learning Platform

Educurator is a comprehensive, AI-powered learning platform designed to help individuals gain practical skills, earn money, support their families, and make a positive impact on society.

## ✨ Features

### 🎯 Core Features
- ✅ User Authentication (Signup/Login)
- ✅ Comprehensive Course Library (40+ courses)
- ✅ Personalized Learning Recommendations (Azure OpenAI)
- ✅ Progress Tracking
- ✅ Dashboard with Personalized Experience
- ✅ Course Categories: Soft Skills, Technology, Business, Freelancing, Teaching, Design, Content Creation

### 🤖 AI-Powered Personalization
- Personalized course recommendations based on user profile
- Progress analysis and feedback
- Learning path suggestions
- Adaptive learning questions

### 📚 Course Domains

#### Soft Skills
- Effective Communication
- Negotiation Mastery
- Leadership & Team Management
- Time Management & Productivity
- Emotional Intelligence

#### Technology
- AI & Machine Learning
- Cybersecurity
- Blockchain & Web3
- Full-Stack Web Development
- Mobile App Development
- Cloud Computing
- Data Science

#### Business & Entrepreneurship
- Digital Marketing
- E-Commerce & Online Business
- Startup Entrepreneurship
- Financial Literacy & Investment
- Business Analytics

#### Freelancing
- Freelancing Fundamentals
- Upwork & Fiverr Mastery
- Freelance Business Scaling

#### Teaching & Education
- Online Teaching & Course Creation
- Educational Technology

#### Design & Creative
- UI/UX Design
- Graphic Design & Branding

#### Content Creation
- Content Writing & Blogging
- Video Production & YouTube

## 🏗️ Architecture

### Backend
- Node.js + Express
- Azure SQL Database
- Azure OpenAI Integration
- JWT Authentication
- RESTful API

### Frontend
- React
- Redux Toolkit
- Material-UI
- Responsive Design

### Deployment
- Azure Web App
- Azure SQL Database
- GitHub Actions CI/CD
- Azure OpenAI Service

## 📋 Prerequisites

1. Azure Account
2. Azure OpenAI Service (configured)
3. Node.js 18+
4. Azure SQL Database

## 🚀 Quick Start

### Local Development

1. **Clone Repository**
```bash
git clone <repository-url>
cd Educurator
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Update .env with your configuration
npm run init-db
npm start
```

3. **Setup Frontend**
```bash
cd client
npm install
npm start
```

### Azure Deployment

See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for complete deployment guide.

## 🔧 Configuration

### Environment Variables

#### Database
```
DB_USER=your-db-user
DB_PASS=your-db-password
DB_SERVER=your-server.database.windows.net
DB_NAME=Educurator
AZURE_SQL=true
DB_ENCRYPT=true
```

#### Azure OpenAI
```
AZURE_OPENAI_ENDPOINT=https://ai-inayat.openai.azure.com/
AZURE_OPENAI_KEY=your-azure-openai-key
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

#### JWT
```
JWT_SECRET=your-jwt-secret-key-minimum-32-characters
```

## 📊 Database Schema

### Tables
- **Users**: User accounts and preferences
- **Courses**: Course catalog (40+ courses)
- **Modules**: Course content modules
- **UserCourses**: User enrollment and progress
- **Notifications**: User notifications

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/:id/enroll` - Enroll in course

### Personalization
- `GET /api/personalization/recommendations` - Get personalized recommendations
- `GET /api/personalization/progress-analysis` - Get progress analysis
- `GET /api/personalization/questions/:courseId` - Get learning questions

## 🎓 Course Categories

1. **Soft Skills** (5 courses)
2. **Technology** (15+ courses)
   - AI & Machine Learning
   - Cybersecurity
   - Blockchain
   - Web Development
   - Mobile Development
   - Cloud Computing
   - Data Science
3. **Business** (5 courses)
4. **Freelancing** (3 courses)
5. **Teaching** (2 courses)
6. **Design** (2 courses)
7. **Content Creation** (2 courses)

## 🤖 AI Features

### Personalized Recommendations
- Analyzes user interests, goals, and current skills
- Recommends best learning path
- Suggests career opportunities
- Provides personalized learning message

### Progress Analysis
- Tracks learning progress
- Identifies strengths and areas for improvement
- Suggests next steps
- Provides motivational feedback

### Learning Questions
- Generates personalized questions
- Tests practical understanding
- Identifies knowledge gaps
- Encourages critical thinking

## 🌟 Key Benefits

### For Learners
- 🎯 Personalized learning paths
- 💰 Skills to earn money
- 👨‍👩‍👧‍👦 Support family
- 🌍 Positive social impact
- 🚀 Career advancement

### For Society
- 📈 Economic empowerment
- 🎓 Skill development
- 💼 Job creation
- 🌱 Community growth
- 🔄 Knowledge sharing

## 📱 Responsive Design

- Mobile-friendly interface
- Tablet optimization
- Desktop experience
- Cross-browser compatibility

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- SQL injection prevention
- CORS configuration
- Helmet security headers
- Input validation

## 📈 Scalability

- Azure SQL Database (scalable)
- Connection pooling
- Efficient queries
- Caching ready
- Load balancing ready

## 🚀 Deployment

### GitHub Actions
- Automatic deployment on push to main
- Build and test
- Deploy to Azure Web App
- Database migrations

### Azure Resources
- Azure Web App
- Azure SQL Database
- Azure OpenAI Service
- Application Insights (optional)

## 📝 License

ISC

## 🤝 Contributing

Contributions welcome! Please read contributing guidelines.

## 📞 Support

For issues and questions:
1. Check documentation
2. Review Azure logs
3. Check GitHub Issues
4. Contact support

## 🎉 Getting Started

1. Set up Azure resources
2. Configure environment variables
3. Deploy via GitHub Actions
4. Initialize database
5. Start learning!

---

**Built with ❤️ for positive social impact and economic empowerment**

