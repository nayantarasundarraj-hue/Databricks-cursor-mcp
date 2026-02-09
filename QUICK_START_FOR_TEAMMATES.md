# Quick Start for Teammates

## ⚡ 5-Minute Setup

### Prerequisites Check
```bash
node --version        # Need v14+
databricks --version  # Need CLI installed
echo ~                # Remember this path
```

---

## 🚀 Setup Steps

### 1. Clone Repository (30 seconds)

```bash
cd ~/
git clone <REPO_URL> databricks-mcp-server
cd databricks-mcp-server
```

**Replace `<REPO_URL>`** with actual GitHub URL (team will provide).

### 2. Install Dependencies (10 seconds)

```bash
npm install
```

### 3. Authenticate Databricks (2 minutes)

```bash
databricks auth login --profile dev --host https://affirm-prod-us.cloud.databricks.com
```

- Opens browser
- Click "Allow"
- Close browser
- You're authenticated!

### 4. Configure Cursor (1 minute)

Create/edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "databricks": {
      "command": "node",
      "args": [
        "/Users/YOUR-USERNAME/databricks-mcp-server/server.js"
      ],
      "env": {
        "DATABRICKS_PROFILE": "dev",
        "DATABRICKS_WORKSPACE_HOST": "affirm-prod-us.cloud.databricks.com"
      }
    }
  }
}
```

**🚨 CRITICAL:** Replace `YOUR-USERNAME` with your Mac username!

Find it: `whoami`

### 5. Restart Cursor (30 seconds)

- **Quit** (Command + Q)
- **Reopen**
- **Wait** 10-15 seconds

### 6. Test It! (30 seconds)

Ask Cursor:
```
"List my Databricks clusters"
```

You should see your clusters! ✅

---

## 🎉 You're Done!

### What You Can Do Now:

**Edit notebooks:**
```
"Add import pandas as pd to /Users/me/notebook"
```

**Save money:**
```
"Show me which clusters are running and how much they cost"
```

**Run queries:**
```
"List all SQL warehouses"
```

**Automate:**
```
"Run /Users/me/etl_notebook on cluster X"
```

---

## 📚 Next Steps

- **Read full docs:** `cat README.md`
- **See all 30 tools:** Ask Cursor "What Databricks tools are available?"
- **Learn to update:** Read `UPDATE_GUIDE.md`
- **Add tools:** Read `CONTRIBUTING.md`

---

## 🐛 Something Broken?

### "MCP SDK wasn't accessible"
```bash
cd ~/databricks-mcp-server && npm install
# Restart Cursor
```

### "Authentication failed"
```bash
databricks auth login --profile dev
# Restart Cursor
```

### "Tools not showing"
1. Check path in `~/.cursor/mcp.json` is absolute (starts with `/Users/`)
2. Restart Cursor **completely**
3. Wait 15 seconds
4. Check: View → Output → "Model Context Protocol"

### Still stuck?
- Check `INSTALLATION.md` for detailed troubleshooting
- Ask in team chat
- Check GitHub issues

---

## 🔄 Getting Updates

When new tools are added:

```bash
cd ~/databricks-mcp-server
git pull
# Restart Cursor
```

That's it! ✅

---

## 📞 Help

- **Setup issues:** `INSTALLATION.md`
- **Using tools:** `README.md`
- **Updates:** `UPDATE_GUIDE.md`
- **Contributing:** `CONTRIBUTING.md`
- **Team chat:** Ask away!

---

## ✅ Checklist

- [ ] Cloned repository
- [ ] Ran `npm install`
- [ ] Authenticated with Databricks
- [ ] Edited `~/.cursor/mcp.json` with **my username**
- [ ] Restarted Cursor completely
- [ ] Tested: "List my Databricks clusters"
- [ ] It works! 🎉

Welcome to the team! 🚀

