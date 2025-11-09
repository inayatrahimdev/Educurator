# 🚀 Deploy to Azure Web App - Step by Step Guide

## 📋 Complete Step-by-Step Instructions

### Step 1: Create Azure Resources (10 minutes)

#### 1.1 Create Resource Group
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Resource Group"
4. Click "Create"
5. Fill in:
   - **Resource group name**: `educurator-rg`
   - **Region**: `East US`
6. Click "Review + create" → "Create"

#### 1.2 Create SQL Database
1. In Azure Portal, click "Create a resource"
2. Search for "SQL Database"
3. Click "Create"
4. Fill in:
   - **Subscription**: Your subscription
   - **Resource group**: `educurator-rg`
   - **Database name**: `Educurator`
   - **Server**: Click "Create new"
     - **Server name**: `educurator-sql-server` (must be unique)
     - **Location**: `East US`
     - **Authentication method**: SQL authentication
     - **Server admin login**: `educurator-admin`
     - **Password**: Create a strong password (save it!)
     - **Confirm password**: Same password
   - **Compute + storage**: Click "Configure database"
     - Select "Basic" tier (S0) for testing
     - Click "Apply"
5. Click "Review + create" → "Create"
6. Wait for deployment (2-3 minutes)

#### 1.3 Configure SQL Database Firewall
1. Go to your SQL Database → "educurator-sql-server"
2. Click "Networking" in left menu
3. Under "Firewall rules":
   - **Enable**: "Allow Azure services and resources to access this server" ✅
   - Click "Add your client IPv4 address" (optional, for local testing)
4. Click "Save"

#### 1.4 Create Web App
1. In Azure Portal, click "Create a resource"
2. Search for "Web App"
3. Click "Create"
4. Fill in:
   - **Subscription**: Your subscription
   - **Resource group**: `educurator-rg`
   - **Name**: `educurator-app` (must be unique, will be educurator-app.azurewebsites.net)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: East US
   - **App Service Plan**: Click "Create new"
     - **Name**: `educurator-plan`
     - **SKU and size**: Basic B1 (for testing) or Free F1
5. Click "Review + create" → "Create"
6. Wait for deployment (2-3 minutes)

### Step 2: Configure Azure Web App Settings (5 minutes)

1. Go to your Web App → `educurator-app`
2. Click "Configuration" in left menu
3. Click "Application settings" tab
4. Click "+ New application setting" and add each of these:

```
Name: DB_USER
Value: educurator-admin

Name: DB_PASS
Value: [Your SQL Database password]

Name: DB_SERVER
Value: educurator-sql-server.database.windows.net

Name: DB_NAME
Value: Educurator

Name: AZURE_SQL
Value: true

Name: DB_ENCRYPT
Value: true

Name: JWT_SECRET
Value: [Generate a random 32+ character string]

Name: AZURE_OPENAI_ENDPOINT
Value: https://ai-inayat.openai.azure.com/

Name: AZURE_OPENAI_KEY
Value: [Your Azure OpenAI API Key - Get from Azure Portal]

Name: AZURE_OPENAI_DEPLOYMENT
Value: gpt-4

Name: AZURE_OPENAI_API_VERSION
Value: 2024-02-15-preview

Name: NODE_ENV
Value: production

Name: PORT
Value: 8080
```

5. Click "Save" at the top
6. Click "Continue" when prompted

### Step 3: Get Publish Profile (2 minutes)

1. Go to your Web App → `educurator-app`
2. Click "Get publish profile" button (top right)
3. Download the `.PublishSettings` file
4. Open it in a text editor
5. Copy the entire contents (you'll need this for GitHub)

### Step 4: Configure GitHub Secrets (5 minutes)

1. Go to your GitHub repository: https://github.com/inayatrahimdev/Educurator
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret" and add each:

**Secret 1: AZURE_WEBAPP_PUBLISH_PROFILE**
- Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
- Value: Paste the entire contents of the `.PublishSettings` file you downloaded

**Secret 2: AZURE_CREDENTIALS**
- Name: `AZURE_CREDENTIALS`
- Value: Run this command in Azure Cloud Shell or local Azure CLI:
```bash
az ad sp create-for-rbac --name "educurator-sp" --role contributor \
  --scopes /subscriptions/{your-subscription-id}/resourceGroups/educurator-rg \
  --sdk-auth
```
- Copy the JSON output and paste it as the value

**Secret 3-9: Database and API Secrets**
- `AZURE_SQL_USER` = `educurator-admin`
- `AZURE_SQL_PASSWORD` = `[Your SQL Database password]`
- `AZURE_SQL_SERVER` = `educurator-sql-server.database.windows.net`
- `AZURE_SQL_DATABASE` = `Educurator`
- `JWT_SECRET` = `[Same as in Azure Web App settings]`
- `OPENAI_API_KEY` = `[Your Azure OpenAI API Key - Get from Azure Portal]`
- `REACT_APP_API_URL` = `https://educurator-app.azurewebsites.net/api`

### Step 5: Update GitHub Actions Workflow (2 minutes)

The workflow should work automatically, but verify:
1. Go to `.github/workflows/azure-webapps-deploy.yml`
2. Make sure the app name matches: `educurator-app`

### Step 6: Trigger Deployment (1 minute)

1. Go to your GitHub repository
2. Click "Actions" tab
3. You should see the workflow running automatically
4. Or manually trigger by making a small commit:
```bash
git commit --allow-empty -m "Trigger Azure deployment"
git push
```

### Step 7: Initialize Database (5 minutes)

After deployment, initialize the database:

#### Option A: Using Azure Cloud Shell (Recommended)
1. Go to Azure Portal
2. Click the Cloud Shell icon (top right)
3. Run these commands:
```bash
# Install Node.js if needed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Clone your repository
git clone https://github.com/inayatrahimdev/Educurator.git
cd Educurator/server

# Install dependencies
npm install

# Set environment variables
export DB_USER="educurator-admin"
export DB_PASS="[Your SQL password]"
export DB_SERVER="educurator-sql-server.database.windows.net"
export DB_NAME="Educurator"
export AZURE_SQL="true"
export DB_ENCRYPT="true"

# Initialize database
npm run init-db
```

#### Option B: Using Local Machine
1. Update `server/.env` file with Azure SQL credentials
2. Run: `cd server && npm run init-db`

#### Option C: Using Azure Portal Query Editor
1. Go to Azure Portal → SQL Database → `Educurator`
2. Click "Query editor" in left menu
3. Login with your SQL credentials
4. Run the SQL from `database/schema.sql`
5. Manually insert courses or use the init script

### Step 8: Verify Deployment (2 minutes)

1. **Check Web App URL**: https://educurator-app.azurewebsites.net
2. **Check API Health**: https://educurator-app.azurewebsites.net/api/health
3. **Test Registration**: Create a new account
4. **Test Login**: Login with credentials
5. **Test Courses**: View course catalog
6. **Test Personalization**: Check recommendations

## ✅ Success Checklist

- [ ] Resource Group created
- [ ] SQL Database created
- [ ] SQL Database firewall configured
- [ ] Web App created
- [ ] Web App settings configured
- [ ] Publish profile downloaded
- [ ] GitHub secrets configured
- [ ] GitHub Actions workflow running
- [ ] Database initialized
- [ ] 38 courses loaded
- [ ] Web app accessible
- [ ] API responding
- [ ] Registration works
- [ ] Login works

## 🎯 Quick Commands Summary

### Create Resources (Azure CLI):
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
  --admin-password YourPassword123!

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

### Configure Web App Settings (Azure CLI):
```bash
az webapp config appsettings set \
  --resource-group educurator-rg \
  --name educurator-app \
  --settings \
    DB_USER="educurator-admin" \
    DB_PASS="YourPassword123!" \
    DB_SERVER="educurator-sql-server.database.windows.net" \
    DB_NAME="Educurator" \
    AZURE_SQL="true" \
    DB_ENCRYPT="true" \
    JWT_SECRET="your-jwt-secret-32-chars-min" \
    AZURE_OPENAI_ENDPOINT="https://ai-inayat.openai.azure.com/" \
    AZURE_OPENAI_KEY="[Your Azure OpenAI API Key]" \
    AZURE_OPENAI_DEPLOYMENT="gpt-4" \
    AZURE_OPENAI_API_VERSION="2024-02-15-preview" \
    NODE_ENV="production" \
    PORT="8080"
```

## 🔍 Troubleshooting

### Deployment Fails
- Check GitHub Actions logs
- Verify all secrets are set
- Check Azure Web App logs

### Database Connection Fails
- Verify firewall rules
- Check credentials
- Verify "Allow Azure services" is enabled

### App Not Loading
- Check Web App logs
- Verify environment variables
- Check if database is initialized

## 📞 Need Help?

1. Check Azure Portal logs
2. Check GitHub Actions logs
3. Review `AZURE_DEPLOYMENT.md`
4. Check `DEPLOYMENT_CHECKLIST.md`

## 🎉 After Deployment

Your app will be live at: **https://educurator-app.azurewebsites.net**

---

**Follow these steps and your app will be live on Azure! 🚀**

