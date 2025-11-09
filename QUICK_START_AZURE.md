# 🚀 Quick Start - Azure Deployment

## Step 1: Azure Resources Setup

### Create Azure SQL Database
```bash
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
```

### Create Azure Web App
```bash
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

## Step 2: Configure GitHub Secrets

Go to: GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:

```
AZURE_WEBAPP_PUBLISH_PROFILE
  → Download from: Azure Portal → Web App → Get publish profile

AZURE_CREDENTIALS
  → Run: az ad sp create-for-rbac --name "educurator-sp" --role contributor \
      --scopes /subscriptions/{subscription-id}/resourceGroups/educurator-rg \
      --sdk-auth

AZURE_SQL_USER=educurator-admin
AZURE_SQL_PASSWORD=YourSecurePassword123!
AZURE_SQL_SERVER=educurator-sql-server.database.windows.net
AZURE_SQL_DATABASE=Educurator

JWT_SECRET=your-secure-jwt-secret-minimum-32-characters-long

OPENAI_API_KEY=your-azure-openai-key-here

REACT_APP_API_URL=https://educurator-app.azurewebsites.net/api
```

## Step 3: Configure Azure Web App Settings

### Option 1: Using Azure Portal
1. Go to Azure Portal → Web App → Configuration
2. Add Application Settings:
   - `DB_USER` = educurator-admin
   - `DB_PASS` = YourSecurePassword123!
   - `DB_SERVER` = educurator-sql-server.database.windows.net
   - `DB_NAME` = Educurator
   - `AZURE_SQL` = true
   - `DB_ENCRYPT` = true
   - `JWT_SECRET` = your-jwt-secret
   - `AZURE_OPENAI_ENDPOINT` = https://ai-inayat.openai.azure.com/
   - `AZURE_OPENAI_KEY` = your-azure-openai-key-here
   - `AZURE_OPENAI_DEPLOYMENT` = gpt-4
   - `NODE_ENV` = production
   - `PORT` = 8080

### Option 2: Using Azure CLI
```bash
az webapp config appsettings set \
  --resource-group educurator-rg \
  --name educurator-app \
  --settings \
    DB_USER="educurator-admin" \
    DB_PASS="YourSecurePassword123!" \
    DB_SERVER="educurator-sql-server.database.windows.net" \
    DB_NAME="Educurator" \
    AZURE_SQL="true" \
    DB_ENCRYPT="true" \
    JWT_SECRET="your-jwt-secret" \
    AZURE_OPENAI_ENDPOINT="https://ai-inayat.openai.azure.com/" \
    AZURE_OPENAI_KEY="your-azure-openai-key-here" \
    AZURE_OPENAI_DEPLOYMENT="gpt-4" \
    NODE_ENV="production" \
    PORT="8080"
```

## Step 4: Push to GitHub

```bash
git add .
git commit -m "Azure deployment ready"
git push origin main
```

GitHub Actions will automatically deploy!

## Step 5: Initialize Database

### Option 1: Using Azure Cloud Shell
```bash
# Connect to database and run initialization
cd server
npm install
npm run init-db
```

### Option 2: Using Local Machine
Update `.env` with Azure SQL credentials and run:
```bash
cd server
npm run init-db
```

## Step 6: Verify Deployment

1. Check Web App: https://educurator-app.azurewebsites.net
2. Check API: https://educurator-app.azurewebsites.net/api/health
3. Test Registration
4. Test Login
5. Test Courses
6. Test Personalization

## ✅ Done!

Your Educurator platform is now live on Azure! 🎉

---

**Next Steps:**
- Set up custom domain
- Enable Application Insights
- Configure monitoring
- Set up backups

