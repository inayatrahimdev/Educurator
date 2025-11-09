# 🚀 START HERE - Deploy to Azure Web App

## ⚡ Quick Steps (15 minutes total)

### 1️⃣ Create Azure Resources (5 min)

**Go to Azure Portal:** https://portal.azure.com

#### A. Create Resource Group
- Name: `educurator-rg`
- Region: `East US`

#### B. Create SQL Database
- Server name: `educurator-sql-server` (must be unique)
- Database name: `Educurator`
- Admin: `educurator-admin`
- Password: `YourSecurePassword123!` (save this!)
- Enable: "Allow Azure services" ✅

#### C. Create Web App
- Name: `educurator-app` (must be unique)
- Runtime: Node.js 18 LTS
- OS: Linux
- Plan: Basic B1

---

### 2️⃣ Configure Web App Settings (2 min)

**In Azure Portal → Web App → Configuration → Application settings:**

Add these settings:

```
DB_USER = educurator-admin
DB_PASS = YourSecurePassword123!
DB_SERVER = educurator-sql-server.database.windows.net
DB_NAME = Educurator
AZURE_SQL = true
DB_ENCRYPT = true
JWT_SECRET = your-secure-jwt-secret-minimum-32-characters-long
AZURE_OPENAI_ENDPOINT = https://ai-inayat.openai.azure.com/
AZURE_OPENAI_KEY = [Your Azure OpenAI API Key - See SECRETS_CONFIGURATION.md]
AZURE_OPENAI_DEPLOYMENT = gpt-4
AZURE_OPENAI_API_VERSION = 2024-02-15-preview
NODE_ENV = production
PORT = 8080
```

**Click "Save"**

---

### 3️⃣ Configure GitHub Secrets (3 min)

**Go to:** https://github.com/inayatrahimdev/Educurator/settings/secrets/actions

**Click "New repository secret" for each:**

1. **AZURE_WEBAPP_PUBLISH_PROFILE**
   - Get from: Azure Portal → Web App → "Get publish profile"
   - Download file and copy entire contents

2. **AZURE_CREDENTIALS**
   - Run in Azure Cloud Shell:
   ```bash
   az ad sp create-for-rbac --name "educurator-sp" --role contributor --scopes /subscriptions/{your-subscription-id}/resourceGroups/educurator-rg --sdk-auth
   ```
   - Copy the JSON output

3. **AZURE_SQL_USER** = `educurator-admin`
4. **AZURE_SQL_PASSWORD** = `YourSecurePassword123!`
5. **AZURE_SQL_SERVER** = `educurator-sql-server.database.windows.net`
6. **AZURE_SQL_DATABASE** = `Educurator`
7. **JWT_SECRET** = `your-jwt-secret` (same as in Web App settings)
8. **OPENAI_API_KEY** = `[Your Azure OpenAI API Key - See SECRETS_CONFIGURATION.md]`
9. **REACT_APP_API_URL** = `https://educurator-app.azurewebsites.net/api`

---

### 4️⃣ Deploy (Auto - 5 min)

**GitHub Actions will automatically deploy!**

1. Go to: https://github.com/inayatrahimdev/Educurator/actions
2. Watch the deployment
3. Wait for green checkmark ✅

---

### 5️⃣ Initialize Database (3 min)

**Option A: Azure Cloud Shell (Recommended)**

1. Go to Azure Portal → Cloud Shell (top right)
2. Run:
```bash
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

---

## ✅ Done!

**Your app is live at:** https://educurator-app.azurewebsites.net

## 🎯 Test It:

1. ✅ https://educurator-app.azurewebsites.net/api/health
2. ✅ https://educurator-app.azurewebsites.net
3. ✅ Register a new account
4. ✅ Login
5. ✅ Browse courses

---

## 📝 Important Notes:

- **API Key:** Get your Azure OpenAI key from Azure Portal and add it to Web App settings (see SECRETS_CONFIGURATION.md)
- **Database Password:** Use the same password everywhere
- **JWT Secret:** Must be 32+ characters
- **Web App Name:** Must be unique globally

---

## 🆘 Need Help?

- Check: `DEPLOY_NOW_STEP_BY_STEP.md` for detailed instructions
- Check: `QUICK_DEPLOY_AZURE.md` for CLI commands
- Check: Azure Portal → Web App → Logs for errors

---

## 🎉 Success Checklist:

- [ ] Resource Group created
- [ ] SQL Database created
- [ ] Web App created
- [ ] Web App settings configured
- [ ] GitHub secrets configured
- [ ] GitHub Actions deployed
- [ ] Database initialized
- [ ] App accessible
- [ ] Registration works
- [ ] Login works

---

**Follow these 5 steps and you're done! 🚀**

