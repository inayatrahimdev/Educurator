# 🔐 Secrets Configuration Guide

## ⚠️ Important: API Keys and Secrets

For security, API keys and secrets are NOT stored in the repository. You need to configure them in:

1. **Azure Web App** - Application Settings
2. **GitHub Secrets** - For CI/CD deployment

## 🔑 Azure OpenAI Configuration

### Your Azure OpenAI Details:

**Endpoint:** `https://ai-inayat.openai.azure.com/`  
**Region:** `eastus`  
**Deployment:** `gpt-4`  
**API Version:** `2024-02-15-preview`

### API Key:
Your Azure OpenAI API key needs to be configured in:

1. **Azure Web App Settings:**
   ```
   AZURE_OPENAI_KEY=your-actual-api-key-here
   ```

2. **GitHub Secrets:**
   ```
   OPENAI_API_KEY=your-actual-api-key-here
   ```

**⚠️ DO NOT commit the actual API key to the repository!**

## 📋 Complete Environment Variables

### For Azure Web App:

```
DB_USER=your-db-user
DB_PASS=your-db-password
DB_SERVER=your-server.database.windows.net
DB_NAME=Educurator
AZURE_SQL=true
DB_ENCRYPT=true
JWT_SECRET=your-jwt-secret-minimum-32-characters
AZURE_OPENAI_ENDPOINT=https://ai-inayat.openai.azure.com/
AZURE_OPENAI_KEY=your-actual-azure-openai-key
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
NODE_ENV=production
PORT=8080
```

### For GitHub Secrets:

```
AZURE_WEBAPP_PUBLISH_PROFILE
AZURE_CREDENTIALS
AZURE_SQL_USER
AZURE_SQL_PASSWORD
AZURE_SQL_SERVER
AZURE_SQL_DATABASE
JWT_SECRET
OPENAI_API_KEY
REACT_APP_API_URL
```

## 🔒 Security Best Practices

1. ✅ Never commit secrets to Git
2. ✅ Use environment variables
3. ✅ Use Azure Key Vault for production (optional)
4. ✅ Rotate keys regularly
5. ✅ Use different keys for dev/prod

## 📝 How to Get Your API Key

1. Go to Azure Portal
2. Navigate to your Azure OpenAI resource
3. Go to "Keys and Endpoint"
4. Copy the key
5. Add it to Azure Web App settings and GitHub secrets

---

**Remember: Keep your API keys secure and never share them publicly!**

