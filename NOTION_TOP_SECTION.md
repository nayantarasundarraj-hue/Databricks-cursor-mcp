# 🚀 Recommended: Git Repository Setup

**The easiest way to get Databricks MCP in Cursor is to clone the repository.**

---

## ⚡ Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp.git ~/databricks-mcp-server
cd ~/databricks-mcp-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Authenticate with Databricks

```bash
databricks auth login --profile dev --host https://affirm-prod-us.cloud.databricks.com
```

This opens your browser - click "Allow" and you're authenticated!

### 4. Configure Cursor

Edit `~/.cursor/mcp.json` (create if it doesn't exist):

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

**⚠️ Replace `YOUR-USERNAME`** with your Mac username (find it with: `whoami`)

### 5. Restart Cursor

- **Quit completely** (Command + Q)
- Reopen
- Wait 10-15 seconds

### 6. Test It!

Ask Cursor: **"List my Databricks clusters"**

✅ You should see your clusters!

---

## 🔄 Getting Updates

When new tools are added:

```bash
cd ~/databricks-mcp-server
git pull
```

Then restart Cursor. **That's it!** You're always up to date.

---

## 💡 Why Use Git?

✅ **One-command updates** - `git pull` gets new tools instantly  
✅ **Always in sync** - Everyone on the team has the same version  
✅ **Easy troubleshooting** - Standard setup for everyone  
✅ **No manual file management** - Git handles everything

---


