# 🚀 Deploy to Azure - Step by Step Guide

## Your Azure OpenAI is Ready! ✅

**Endpoint:** `https://ai-inayat.openai.azure.com/`  
**Key:** `your-azure-openai-key-here`  
**Region:** `eastus`

## 📋 Quick Deployment Steps:

### Step 1: Create Azure Resources (5 minutes)

#### Option A: Using Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Create Resource Group: `educurator-rg`
3. Create SQL Database:
   - Server: Create new SQL server
   - Database name: `Educurator`
   - Pricing tier: Basic (S0) for testing
4. Create Web App:
   - Name: `educurator-app`
   - Runtime: Node.js 18 LTS
   - Plan: Basic (B1) for testing

#### Option B: Using Azure CLI
```bash
# Login to Azure
az login

# Create Resource Group
az group create --name educurator-rg --location eastus

# Create SQL Database
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

# Allow Azure services
az sql server firewall-rule create \
  --resource-group educurator-rg \
  --server educurator-sql-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create Web App
az appservice plan create \
  --name educurator-plan \
  --resource-group educurator-rg \
  --sku B1 \
  --is-linux

az webapp create \
  --resource-group educurator-rg \
  --plan educurator-plan \
  --name educurator-app \
  --runtime "NODE:18-lts"
```

### Step 2: Configure Azure Web App Settings (2 minutes)

Go to Azure Portal → Web App → Configuration → Application Settings

Add these settings:

```
DB_USER=educurator-admin
DB_PASS=YourSecurePassword123!
DB_SERVER=educurator-sql-server.database.windows.net
DB_NAME=Educurator
AZURE_SQL=true
DB_ENCRYPT=true
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters-long
AZURE_OPENAI_ENDPOINT=https://ai-inayat.openai.azure.com/
AZURE_OPENAI_KEY=your-azure-openai-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
NODE_ENV=production
PORT=8080
```

### Step 3: Configure GitHub Secrets (3 minutes)

Go to: GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

1. **AZURE_WEBAPP_PUBLISH_PROFILE**
   - Get from: Azure Portal → Web App → Get publish profile
   - Download the file and copy its contents

2. **AZURE_CREDENTIALS**
   ```bash
   az ad sp create-for-rbac --name "educurator-sp" --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/educurator-rg \
     --sdk-auth
   ```
   Copy the JSON output

3. **AZURE_SQL_USER** = `educurator-admin`
4. **AZURE_SQL_PASSWORD** = `YourSecurePassword123!`
5. **AZURE_SQL_SERVER** = `educurator-sql-server.database.windows.net`
6. **AZURE_SQL_DATABASE** = `Educurator`
7. **JWT_SECRET** = `your-secure-jwt-secret-minimum-32-characters-long`
8. **OPENAI_API_KEY** = `your-azure-openai-key-here`
9. **REACT_APP_API_URL** = `https://educurator-app.azurewebsites.net/api`

### Step 4: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Azure deployment ready with OpenAI integration and 38 comprehensive courses"
git push origin main
```

GitHub Actions will automatically:
- ✅ Build the React app
- ✅ Install dependencies
- ✅ Deploy to Azure Web App
- ✅ Configure environment variables

### Step 5: Initialize Database (2 minutes)

After deployment, initialize the database:

#### Option A: Using Azure Cloud Shell
```bash
# Connect to Web App SSH
az webapp ssh --name educurator-app --resource-group educurator-rg

# Run database initialization
cd /home/site/wwwroot
node scripts/initDatabase.js
```

#### Option B: Using Local Machine
1. Update `server/.env` with Azure SQL credentials
2. Run: `cd server && npm run init-db`

#### Option C: Using Azure Portal Query Editor
1. Go to Azure Portal → SQL Database → Query editor
2. Run the SQL from `database/schema.sql`
3. Run the comprehensive courses insertion

### Step 6: Verify Deployment (2 minutes)

1. **Check Web App**: https://educurator-app.azurewebsites.net
2. **Check API Health**: https://educurator-app.azurewebsites.net/api/health
3. **Test Registration**: Create a new account
4. **Test Login**: Login with credentials
5. **Test Courses**: View course catalog
6. **Test Personalization**: Check recommendations

## ✅ What You Get:

### 🎯 38 Comprehensive Courses:
- Soft Skills (5)
- Technology (15+): AI, Cybersecurity, Blockchain, Web Dev, Mobile, Cloud, Data Science
- Business (5): Marketing, E-Commerce, Startups, Finance, Analytics
- Freelancing (3)
- Teaching (2)
- Design (2)
- Content Creation (2)

### 🤖 AI-Powered Features:
- Personalized course recommendations
- Progress analysis
- Learning questions
- Career guidance

### 🚀 Industry-Level:
- Practical, hands-on courses
- Real-world applications
- Career opportunities
- Money-making skills
- Social impact focus

## 🎉 Success Checklist:

- [ ] Azure resources created
- [ ] GitHub secrets configured
- [ ] Code pushed to GitHub
- [ ] GitHub Actions deployed successfully
- [ ] Database initialized
- [ ] 38 courses loaded
- [ ] Web app accessible
- [ ] Registration works
- [ ] Login works
- [ ] Courses display
- [ ] Personalization works
- [ ] Dashboard works

## 📞 Need Help?

Check these files:
- `AZURE_DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `QUICK_START_AZURE.md` - Quick start guide
- `FINAL_SETUP_SUMMARY.md` - Complete summary

## 🎯 Your Platform Includes:

✅ User Authentication  
✅ 38 Comprehensive Courses  
✅ AI-Powered Personalization  
✅ Progress Tracking  
✅ Dashboard  
✅ Career Guidance  
✅ Industry-Level Content  
✅ Money-Making Skills  
✅ Social Impact Focus  

---

## 🚀 Ready to Deploy!

**Your Educurator platform is fully configured and ready for Azure!**

Follow the steps above to deploy and go live! 🎉

**Everything is ready:**
- ✅ Azure OpenAI configured
- ✅ Database schema updated
- ✅ 38 courses added
- ✅ Personalization features implemented
- ✅ GitHub Actions workflow created
- ✅ Azure configuration files created

**Just create Azure resources, configure secrets, and deploy!**

---

**Built for positive social impact and economic empowerment! 💪🌍**

