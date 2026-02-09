# Databricks MCP Setup

Get AI-powered Databricks management directly in Cursor! 🚀

---

# 🚀 Recommended: Git Repository Setup

**The easiest way to get Databricks MCP in Cursor is to clone the repository.**

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

# 🤖 Alternative: AI Agent Setup

If you prefer having AI set it up for you:

1. Download these files from the repo:
   - [`server.js`](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/server.js)
   - [`package.json`](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/package.json)
   - [`INSTALLATION.md`](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/INSTALLATION.md)

2. Upload them to Cursor and say:
   ```
   "Set up Databricks MCP using these files"
   ```

3. The AI will configure everything automatically!

---

# 🛠️ What You Get - 30 Tools

## 📖 Browse & Read (5 tools)
- List notebooks and folders
- Read notebook content
- View clusters and jobs
- Get job details

## ⚡ Execute & Monitor (5 tools)
- Run notebooks with parameters
- Check execution status
- Get results
- Cancel runs
- View run history

## ✏️ Edit Notebooks (3 tools - with Auto-Backup!)
- Export notebooks
- Import notebooks (auto-backup before overwriting)
- View revision history

## 🖥️ Manage Clusters (4 tools)
- Start/stop clusters
- Get cluster status
- Restart clusters
- Save costs by stopping idle clusters

## 📋 Job Operations (2 tools)
- Trigger jobs
- View job runs

## 📁 DBFS Operations (4 tools)
- Browse filesystem
- Read files
- Upload/download files

## 🔍 SQL Queries (2 tools)
- Execute SQL on warehouses
- List available warehouses

## 📝 Workspace Management (3 tools)
- Create notebooks
- Delete notebooks
- Move/organize notebooks

## 📦 Library Management (2 tools)
- List installed libraries
- Install new packages

---

# 💡 Example Use Cases

## Edit Notebooks with AI

**You:** "Add import pandas as pd to /Users/me/data_analysis"

**AI:**
- Exports notebook
- Creates automatic backup
- Adds the import
- Uploads back to Databricks
- Shows you what changed

## Save Money

**You:** "Show me all running clusters and stop idle ones"

**AI:**
- Lists all clusters
- Identifies idle clusters
- Stops them
- Estimates cost savings

## Quick Data Queries

**You:** "Run this SQL: SELECT * FROM users LIMIT 10"

**AI:**
- Lists available warehouses
- Executes query
- Returns results instantly

## Automate Workflows

**You:** "Run my ETL notebook on cluster X with date=2024-01-27"

**AI:**
- Finds notebook
- Starts cluster if needed
- Runs with parameters
- Shows you the output

---

# 🔒 Safety Features

Every notebook edit includes:

✅ **Automatic local backup** (timestamped)  
✅ **New Databricks revision** (can rollback in UI)  
✅ **No data loss possible**

Databricks keeps full revision history - you can always restore previous versions!

---

# 🐛 Troubleshooting

## "MCP SDK wasn't accessible"

```bash
cd ~/databricks-mcp-server
npm install
# Restart Cursor
```

## "Authentication failed"

```bash
databricks auth login --profile dev
# Restart Cursor
```

## "Tools not showing"

1. Check path in `~/.cursor/mcp.json` uses absolute path (starts with `/Users/`)
2. Restart Cursor **completely** (Command + Q, then reopen)
3. Wait 10-15 seconds
4. Check logs: View → Output → "Model Context Protocol"

## Still stuck?

- Check the [repository documentation](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp)
- Ask in team chat
- Look at `INSTALLATION.md` in the repo

---

# 📚 Additional Documentation

All docs are in the repository:

- **[README.md](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/README.md)** - Full tool list and examples
- **[QUICK_START_FOR_TEAMMATES.md](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/QUICK_START_FOR_TEAMMATES.md)** - 5-minute setup guide
- **[INSTALLATION.md](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/INSTALLATION.md)** - Detailed installation
- **[UPDATE_GUIDE.md](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/UPDATE_GUIDE.md)** - How to get updates
- **[CONTRIBUTING.md](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp/blob/main/CONTRIBUTING.md)** - How to add new tools

---

# 🎉 Start Using It!

Once set up, just talk to Cursor naturally:

- "List my notebooks in /Users/"
- "Show cluster status"
- "Add error handling to my ETL notebook"
- "Run this query on our data warehouse"

The AI will use the right tools automatically! 🚀

---

**Questions?** Check the [GitHub repository](https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp) or ask in team chat!

