# 🚀 Azure Deployment Checklist

## Pre-Deployment

### 1. Azure Resources Setup
- [ ] Create Azure Resource Group
- [ ] Create Azure SQL Database
- [ ] Create Azure Web App
- [ ] Configure Azure OpenAI Service
- [ ] Set up firewall rules for SQL Database
- [ ] Enable "Allow Azure services" in SQL Database

### 2. GitHub Repository Setup
- [ ] Push code to GitHub
- [ ] Configure GitHub Secrets:
  - [ ] `AZURE_WEBAPP_PUBLISH_PROFILE`
  - [ ] `AZURE_CREDENTIALS`
  - [ ] `AZURE_SQL_USER`
  - [ ] `AZURE_SQL_PASSWORD`
  - [ ] `AZURE_SQL_SERVER`
  - [ ] `AZURE_SQL_DATABASE`
  - [ ] `JWT_SECRET`
  - [ ] `OPENAI_API_KEY`
  - [ ] `REACT_APP_API_URL`

### 3. Environment Configuration
- [ ] Update `.env.example` with Azure values
- [ ] Verify all environment variables are set
- [ ] Test database connection locally with Azure SQL
- [ ] Verify OpenAI API key works

## Deployment Steps

### 4. GitHub Actions
- [ ] Push code to `main` branch
- [ ] Monitor GitHub Actions workflow
- [ ] Verify build succeeds
- [ ] Verify deployment succeeds

### 5. Azure Web App Configuration
- [ ] Verify Application Settings are set
- [ ] Check Node.js version (18 LTS)
- [ ] Verify startup command: `node server.js`
- [ ] Enable HTTPS only
- [ ] Configure custom domain (optional)

### 6. Database Initialization
- [ ] Run database initialization script
- [ ] Verify all tables are created
- [ ] Verify comprehensive courses are inserted
- [ ] Test database queries

### 7. Testing
- [ ] Test health endpoint: `/api/health`
- [ ] Test user registration
- [ ] Test user login
- [ ] Test course listing
- [ ] Test personalized recommendations
- [ ] Test progress tracking
- [ ] Test dashboard functionality

## Post-Deployment

### 8. Monitoring
- [ ] Set up Application Insights
- [ ] Configure log streaming
- [ ] Set up alerts
- [ ] Monitor performance
- [ ] Track errors

### 9. Security
- [ ] Enable HTTPS only
- [ ] Verify CORS settings
- [ ] Check SQL injection prevention
- [ ] Verify authentication works
- [ ] Test authorization

### 10. Optimization
- [ ] Enable CDN for static assets
- [ ] Configure caching
- [ ] Optimize database queries
- [ ] Monitor resource usage
- [ ] Scale as needed

## Troubleshooting

### Common Issues
- [ ] Database connection errors
- [ ] OpenAI API errors
- [ ] Build failures
- [ ] Deployment errors
- [ ] Environment variable issues

### Verification Commands
```bash
# Check Web App status
az webapp show --name educurator-app --resource-group educurator-rg

# Check logs
az webapp log tail --name educurator-app --resource-group educurator-rg

# Test database connection
az sql db show-connection-string --server educurator-sql-server --name Educurator
```

## Success Criteria

- [ ] Application is accessible via HTTPS
- [ ] All API endpoints work
- [ ] Database is connected and working
- [ ] OpenAI integration works
- [ ] User registration/login works
- [ ] Courses are displayed
- [ ] Personalization works
- [ ] Dashboard loads correctly
- [ ] No critical errors in logs

## Next Steps

- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up backup strategy
- [ ] Configure monitoring alerts
- [ ] Plan for scaling
- [ ] Document API
- [ ] Create user guide

---

**Ready for production! 🎉**

