# ⚡ Quick Deploy to Azure - 5 Steps

## 🚀 Fastest Way to Deploy

### Step 1: Create Azure Resources (5 min)

**Using Azure Portal:**
1. Go to [Azure Portal](https://portal.azure.com)
2. Create Resource Group: `educurator-rg`
3. Create SQL Database:
   - Server: `educurator-sql-server`
   - Database: `Educurator`
   - User: `educurator-admin`
   - Password: `YourSecurePassword123!`
4. Create Web App:
   - Name: `educurator-app`
   - Runtime: Node.js 18 LTS
   - Plan: Basic B1

**Using Azure CLI (Faster):**
```bash
az login

# Create everything
az group create --name educurator-rg --location eastus

az sql server create --name educurator-sql-server --resource-group educurator-rg --location eastus --admin-user educurator-admin --admin-password YourSecurePassword123!

az sql db create --resource-group educurator-rg --server educurator-sql-server --name Educurator --service-objective S0

az sql server firewall-rule create --resource-group educurator-rg --server educurator-sql-server --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0

az appservice plan create --name educurator-plan --resource-group educurator-rg --sku B1 --is-linux

az webapp create --resource-group educurator-rg --plan educurator-plan --name educurator-app --runtime "NODE:18-lts"
```

### Step 2: Configure Web App Settings (2 min)

**In Azure Portal:**
1. Go to Web App → Configuration → Application settings
2. Add these settings:

```
DB_USER=educurator-admin
DB_PASS=YourSecurePassword123!
DB_SERVER=educurator-sql-server.database.windows.net
DB_NAME=Educurator
AZURE_SQL=true
DB_ENCRYPT=true
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters-long
AZURE_OPENAI_ENDPOINT=https://ai-inayat.openai.azure.com/
AZURE_OPENAI_KEY=[Your Azure OpenAI API Key - Get from Azure Portal]
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
NODE_ENV=production
PORT=8080
```

**Or using Azure CLI:**
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
    JWT_SECRET="your-jwt-secret-32-chars-min" \
    AZURE_OPENAI_ENDPOINT="https://ai-inayat.openai.azure.com/" \
    AZURE_OPENAI_KEY="[Your Azure OpenAI API Key]" \
    AZURE_OPENAI_DEPLOYMENT="gpt-4" \
    NODE_ENV="production" \
    PORT="8080"
```

### Step 3: Configure GitHub Secrets (3 min)

1. Go to: https://github.com/inayatrahimdev/Educurator/settings/secrets/actions
2. Click "New repository secret" and add:

**AZURE_WEBAPP_PUBLISH_PROFILE:**
- Get from: Azure Portal → Web App → Get publish profile
- Download and copy entire contents

**AZURE_CREDENTIALS:**
```bash
az ad sp create-for-rbac --name "educurator-sp" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/educurator-rg --sdk-auth
```
- Copy the JSON output

**Other Secrets:**
- `AZURE_SQL_USER` = `educurator-admin`
- `AZURE_SQL_PASSWORD` = `YourSecurePassword123!`
- `AZURE_SQL_SERVER` = `educurator-sql-server.database.windows.net`
- `AZURE_SQL_DATABASE` = `Educurator`
- `JWT_SECRET` = `your-jwt-secret`
- `OPENAI_API_KEY` = `[Your Azure OpenAI API Key - Get from Azure Portal]`
- `REACT_APP_API_URL` = `https://educurator-app.azurewebsites.net/api`

### Step 4: Deploy via GitHub Actions (Auto)

1. GitHub Actions will automatically deploy when you push
2. Go to: https://github.com/inayatrahimdev/Educurator/actions
3. Watch the deployment progress
4. Wait for it to complete (5-10 minutes)

### Step 5: Initialize Database (3 min)

**Option A: Azure Cloud Shell**
```bash
# In Azure Cloud Shell
git clone https://github.com/inayatrahimdev/Educurator.git
cd Educurator/server
npm install
export DB_USER="educurator-admin"
export DB_PASS="YourSecurePassword123!"
export DB_SERVER="educurator-sql-server.database.windows.net"
export DB_NAME="Educurator"
export AZURE_SQL="true"
export DB_ENCRYPT="true"
npm run init-db
```

**Option B: Local Machine**
1. Update `server/.env` with Azure SQL credentials
2. Run: `cd server && npm run init-db`

## ✅ Done!

Your app is now live at: **https://educurator-app.azurewebsites.net**

## 🎯 Verify:

1. ✅ https://educurator-app.azurewebsites.net/api/health
2. ✅ https://educurator-app.azurewebsites.net
3. ✅ Test registration
4. ✅ Test login
5. ✅ View courses

---

**That's it! Your app is deployed! 🎉**

