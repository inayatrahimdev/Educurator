# 🚀 Azure Deployment Guide - Educurator

Complete guide for deploying Educurator to Azure Web App with Azure SQL Database and Azure OpenAI.

## 📋 Prerequisites

1. Azure Account with active subscription
2. Azure OpenAI Service (already configured: `https://ai-inayat.openai.azure.com/`)
3. GitHub Account
4. Node.js 18+ installed locally

## 🔧 Step 1: Create Azure Resources

### 1.1 Create Azure SQL Database

```bash
# Using Azure CLI
az sql server create \
  --name educurator-sql-server \
  --resource-group educurator-rg \
  --location eastus \
  --admin-user educurator-admin \
  --admin-password YourSecurePassword123!

az sql db create \
  --resource-group educurator-rg \
  --server educurator-sql-server \
  --name Educurator \
  --service-objective S0
```

Or use Azure Portal:
1. Go to Azure Portal → Create Resource → SQL Database
2. Create SQL Server with authentication
3. Create database named "Educurator"
4. Note down server name (e.g., `educurator-sql-server.database.windows.net`)

### 1.2 Create Azure Web App

```bash
# Using Azure CLI
az webapp create \
  --resource-group educurator-rg \
  --plan educurator-plan \
  --name educurator-app \
  --runtime "NODE:18-lts"
```

Or use Azure Portal:
1. Go to Azure Portal → Create Resource → Web App
2. Select Node.js 18 LTS runtime
3. Create App Service Plan (Basic or higher)
4. Name: `educurator-app`

### 1.3 Configure Firewall Rules

Allow Azure services to access SQL Database:
1. Go to SQL Server → Networking
2. Enable "Allow Azure services and resources to access this server"
3. Add your IP address if needed

## 🔑 Step 2: Configure Environment Variables

### 2.1 Azure Web App Configuration

Go to Azure Portal → Web App → Configuration → Application Settings:

```
DB_USER=educurator-admin
DB_PASS=YourSecurePassword123!
DB_SERVER=educurator-sql-server.database.windows.net
DB_NAME=Educurator
AZURE_SQL=true
DB_ENCRYPT=true

JWT_SECRET=your-jwt-secret-key-here-min-32-chars

AZURE_OPENAI_ENDPOINT=https://ai-inayat.openai.azure.com/
AZURE_OPENAI_KEY=your-azure-openai-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

NODE_ENV=production
PORT=8080

CLIENT_URL=https://educurator-app.azurewebsites.net
```

### 2.2 GitHub Secrets

Go to GitHub Repository → Settings → Secrets and variables → Actions:

Add these secrets:

```
AZURE_WEBAPP_PUBLISH_PROFILE
  → Get from: Azure Portal → Web App → Get publish profile

AZURE_CREDENTIALS
  → Create Service Principal:
    az ad sp create-for-rbac --name "educurator-sp" --role contributor \
      --scopes /subscriptions/{subscription-id}/resourceGroups/educurator-rg \
      --sdk-auth

AZURE_SQL_USER=educurator-admin
AZURE_SQL_PASSWORD=YourSecurePassword123!
AZURE_SQL_SERVER=educurator-sql-server.database.windows.net
AZURE_SQL_DATABASE=Educurator

JWT_SECRET=your-jwt-secret-key-here

OPENAI_API_KEY=your-azure-openai-key-here

REACT_APP_API_URL=https://educurator-app.azurewebsites.net/api
```

## 📦 Step 3: Deploy via GitHub Actions

### 3.1 Push to GitHub

```bash
git add .
git commit -m "Prepare for Azure deployment"
git push origin main
```

### 3.2 GitHub Actions will automatically:
1. Build the React app
2. Install server dependencies
3. Deploy to Azure Web App
4. Run database migrations (if configured)

## 🗄️ Step 4: Initialize Database

### Option 1: Using Azure Cloud Shell

```bash
# Connect to Azure SQL Database
az sql db show-connection-string \
  --server educurator-sql-server \
  --name Educurator \
  --client ado.net

# Use the connection string to run initDatabase.js
```

### Option 2: Using Local Machine

Update `.env` file:
```env
DB_USER=educurator-admin
DB_PASS=YourSecurePassword123!
DB_SERVER=educurator-sql-server.database.windows.net
DB_NAME=Educurator
AZURE_SQL=true
DB_ENCRYPT=true
```

Run initialization:
```bash
cd server
npm run init-db
```

### Option 3: Using Azure Portal Query Editor

1. Go to Azure Portal → SQL Database → Query editor
2. Run the SQL script from `database/schema.sql`
3. Run the comprehensive courses insertion

## ✅ Step 5: Verify Deployment

1. **Check Web App**: https://educurator-app.azurewebsites.net
2. **Check API Health**: https://educurator-app.azurewebsites.net/api/health
3. **Test Registration**: Create a new account
4. **Test Personalization**: Check recommendations endpoint

## 🔍 Troubleshooting

### Database Connection Issues

1. Check firewall rules in SQL Server
2. Verify connection string format
3. Check if "Allow Azure services" is enabled
4. Verify credentials in Application Settings

### OpenAI Integration Issues

1. Verify Azure OpenAI endpoint and key
2. Check deployment name matches
3. Verify API version is correct
4. Check Azure OpenAI service is running

### Build/Deployment Issues

1. Check GitHub Actions logs
2. Verify Node.js version (18+)
3. Check build scripts in package.json
4. Verify environment variables are set

## 📊 Monitoring

### Application Insights (Optional)

1. Enable Application Insights in Web App
2. Monitor performance and errors
3. Track API usage and responses

### Log Streaming

```bash
az webapp log tail --name educurator-app --resource-group educurator-rg
```

## 🔒 Security Best Practices

1. ✅ Use strong passwords for SQL Database
2. ✅ Enable HTTPS only in Web App
3. ✅ Use Azure Key Vault for secrets (production)
4. ✅ Enable SQL Database firewall
5. ✅ Use managed identity where possible
6. ✅ Regular security updates

## 💰 Cost Optimization

1. Use Basic App Service Plan for testing
2. Use S0 SQL Database tier for development
3. Scale up only when needed
4. Monitor usage and costs regularly

## 🚀 Next Steps

1. ✅ Set up custom domain
2. ✅ Enable SSL certificate
3. ✅ Configure CDN for static assets
4. ✅ Set up backup strategy
5. ✅ Configure monitoring and alerts

## 📞 Support

For issues:
1. Check Azure Portal logs
2. Review GitHub Actions logs
3. Check Application Insights
4. Review server logs in Kudu console

---

**Your Educurator platform is now live on Azure! 🎉**

