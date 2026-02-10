# 🤖 AI Agent: Set Up Databricks MCP for Cursor

> **IMPORTANT: Give your AI assistant BOTH of these files:**
> 1. This instruction file (SETUP_FOR_AI_AGENT_COMPLETE.md)
> 2. The server code file (mcp-databricks-cli-server.js)

---

## 📋 What This Does

This will configure **30 Databricks tools** in Cursor IDE, enabling:
- ✅ Read, execute, and edit Databricks notebooks
- ✅ Manage clusters (start/stop/restart)
- ✅ Run SQL queries directly
- ✅ Handle DBFS files (upload/download)
- ✅ Execute jobs and monitor runs
- ✅ Install libraries on clusters
- ✅ **Automatic backup protection** when editing notebooks

---

## 🚀 AI Agent Instructions

**Dear AI Assistant,**

The user has provided you with TWO files:
1. **This instruction file** - tells you what to do
2. **mcp-databricks-cli-server.js** - the actual server code (~1,450 lines)

Please help me set up Databricks Model Context Protocol (MCP) integration in Cursor using these files.

---

### Prerequisites to Check

Before we start, verify:

1. **Databricks CLI is installed:**
   ```bash
   databricks --version
   ```
   If not installed, help me install it:
   ```bash
   # macOS
   brew install databricks
   ```

2. **Node.js is installed:**
   ```bash
   node --version
   ```
   Should be v14 or higher. If not: https://nodejs.org/

3. **I have access to a Databricks workspace**
   - I'll provide the workspace URL
   - Example: `company-prod-us.cloud.databricks.com`

---

### Setup Steps

#### Step 1: Authenticate with Databricks

Help me run this command (I'll provide my workspace URL):

```bash
databricks auth login --profile dev --host https://[MY-WORKSPACE-URL]
```

**Example:**
```bash
databricks auth login --profile dev --host https://company-prod-us.cloud.databricks.com
```

This will:
- Open a browser for OAuth login
- Save credentials to `~/.databrickscfg`
- Store tokens in `~/.databricks/token-cache.json`

**Test it worked:**
```bash
databricks clusters list --profile dev
```

---

#### Step 2: Save the MCP Server File

The user has provided you with `mcp-databricks-cli-server.js` (~1,450 lines).

Help me save it to a permanent location:

**Recommended location:**
```bash
mkdir -p ~/databricks-mcp
```

**Save the file as:**
`~/databricks-mcp/mcp-databricks-cli-server.js`

**Make it executable:**
```bash
chmod +x ~/databricks-mcp/mcp-databricks-cli-server.js
```

**Verify it's valid JavaScript:**
```bash
node -c ~/databricks-mcp/mcp-databricks-cli-server.js
```
Should return nothing (no errors).

---

#### Step 3: Install MCP SDK

```bash
npm install -g @modelcontextprotocol/sdk
```

**Verify installation:**
```bash
npm list -g @modelcontextprotocol/sdk
```

---

#### Step 4: Configure Cursor MCP Settings

Help me create/edit `~/.cursor/mcp.json`:

**Full configuration:**

```json
{
  "mcpServers": {
    "databricks": {
      "command": "node",
      "args": ["/Users/[USERNAME]/databricks-mcp/mcp-databricks-cli-server.js"],
      "env": {
        "DATABRICKS_CONFIG_PROFILE": "dev",
        "DATABRICKS_WORKSPACE_HOST": "[WORKSPACE-URL]"
      }
    }
  }
}
```

**Replace:**
- `[USERNAME]` with the actual username (get from `whoami`)
- `[WORKSPACE-URL]` with the actual workspace URL (without `https://`)

**Example:**
```json
{
  "mcpServers": {
    "databricks": {
      "command": "node",
      "args": ["/Users/nayantara.sundarraj/databricks-mcp/mcp-databricks-cli-server.js"],
      "env": {
        "DATABRICKS_CONFIG_PROFILE": "dev",
        "DATABRICKS_WORKSPACE_HOST": "company-prod-us.cloud.databricks.com"
      }
    }
  }
}
```

**If mcp.json already exists with other servers, ADD the databricks entry:**

```json
{
  "mcpServers": {
    "existing-server": { ... },
    "databricks": {
      "command": "node",
      "args": ["/Users/[USERNAME]/databricks-mcp/mcp-databricks-cli-server.js"],
      "env": {
        "DATABRICKS_CONFIG_PROFILE": "dev",
        "DATABRICKS_WORKSPACE_HOST": "[WORKSPACE-URL]"
      }
    }
  }
}
```

---

#### Step 5: Add Security to .gitignore

Help me add these to `.gitignore` in the workspace root:

```bash
echo ".cursor/" >> .gitignore
echo "databricks_backups/" >> .gitignore
```

This prevents committing sensitive credentials to version control.

---

#### Step 6: Restart Cursor

**CRITICAL:** Tell the user they MUST:

1. **Quit Cursor completely** (Command + Q on Mac, Alt + F4 on Windows)
2. **Wait 5 seconds**
3. **Reopen Cursor**
4. **Wait 10-15 seconds** for MCP initialization

**Don't just reload** - must fully quit and reopen!

---

### Verification

After Cursor restarts, help the user test these commands:

**Test 1: List clusters**
```
User says to Cursor AI: "List my Databricks clusters"
```
Should show cluster information.

**Test 2: List notebooks**
```
User says: "List notebooks in /Users/my-email@company.com/"
```
Should show notebooks.

**Test 3: Export a notebook**
```
User says: "Export /Users/me/TestNotebook to ~/test.py"
```
Should download the notebook.

**Test 4: Import with backup**
```
User says: "Import ~/test.py back to /Users/me/TestNotebook"
```
Should upload and create automatic backup in `databricks_backups/`.

---

### If Tests Fail

**Check MCP logs:**
- In Cursor: View → Output → Select "Model Context Protocol"
- Look for connection errors

**Common issues:**

1. **"MCP server not found"**
   - Verify absolute path in mcp.json is correct
   - Check file exists: `ls -la ~/databricks-mcp/mcp-databricks-cli-server.js`

2. **"Authentication failed"**
   - Re-run: `databricks auth login --profile dev`
   - Verify: `databricks clusters list --profile dev`

3. **"Module not found"**
   - Re-install: `npm install -g @modelcontextprotocol/sdk`

4. **"Token expired"**
   - Refresh: `databricks auth login --profile dev`
   - Restart Cursor

---

## 📊 What the User Gets

**30 Databricks Tools:**

### 📖 Workspace & Discovery (5)
- list_notebooks - Browse folders
- get_notebook - Read content
- list_clusters - Show all clusters
- list_jobs - Show all jobs
- get_job_details - Detailed job info

### ⚡ Notebook Execution (5)
- run_notebook - Execute with parameters
- get_run - Check status
- get_run_output - Get results
- cancel_run - Stop execution
- list_runs - View history

### ✏️ Notebook Editing (3) ⭐ NEW!
- export_notebook - Download (SOURCE/JUPYTER/HTML/DBC)
- import_notebook - Upload with auto-backup
- get_notebook_revisions - View revision info

### 🖥️ Cluster Management (4)
- start_cluster - Wake up clusters
- stop_cluster - Save costs
- get_cluster_status - Detailed info
- restart_cluster - Restart

### 📋 Job Operations (2)
- run_job - Trigger jobs
- get_job_runs - Execution history

### 📁 DBFS Operations (4)
- list_dbfs - Browse filesystem
- read_dbfs_file - Read content
- upload_to_dbfs - Upload files
- download_from_dbfs - Download files

### 🔍 SQL Queries (2)
- execute_sql - Run queries
- list_sql_warehouses - List warehouses

### 📝 Workspace Management (3)
- create_notebook - Create new
- delete_notebook - Remove
- move_notebook - Organize

### 📦 Library Management (2)
- list_cluster_libraries - Show installed
- install_library - Add packages

---

## 🔒 Safety & Security Features

**Triple Protection for Notebook Edits:**

1. **Automatic Local Backups**
   - Created before every import
   - Timestamped: `Notebook_backup_2026-01-23T14-30-45.py`
   - Saved to: `databricks_backups/` folder

2. **Databricks Revision History**
   - Every import creates new revision
   - View all versions in UI (clock icon)
   - One-click restore

3. **Restore from Either Source**
   - Import backup file → restore local version
   - Use Databricks UI → restore any revision
   - **No data loss possible!**

**Security Measures:**

4. **Shell Injection Prevention**
   - Uses `execFileSync` instead of `execSync` (no shell involved)
   - All CLI arguments passed as arrays, never interpolated into shell strings

5. **Human-in-the-Loop (HIL) Confirmation**
   - Destructive operations require explicit `confirm: true` parameter
   - Affected tools: `delete_notebook`, `move_notebook`, `restart_cluster`, `stop_cluster`, `upload_to_dbfs`
   - AI must ask the user before executing these operations

6. **OAuth 2.0 U2M Authentication**
   - Browser-based SSO login (no stored passwords)
   - Tokens managed by Databricks CLI
   - Automatic token refresh

---

## ✅ Success Criteria

The setup is complete when:

- ✅ All 30 tools available in Cursor
- ✅ Can list clusters and notebooks
- ✅ Can execute notebooks and see results
- ✅ Can export notebooks to local files
- ✅ Can import notebooks with automatic backups
- ✅ Backups appear in `databricks_backups/`
- ✅ Can rollback via backups or Databricks UI
- ✅ OAuth authentication works (no IP ACL issues)

---

## 💡 Example Usage

After setup, the user can say:

**Editing:**
- "Add import pandas as pd to /Users/me/Analysis"
- "Fix the typo 'groubpy' in /Users/me/ETL"
- "Add error handling to all notebooks in /Users/me/prod/"

**Cluster Management:**
- "Stop all idle clusters to save money"
- "Start cluster X and run notebook Y"

**Data Analysis:**
- "Run this SQL query on warehouse abc123: SELECT * FROM users"
- "Execute /Users/me/DataPipeline on cluster X with params Y=10"

**File Operations:**
- "Export all notebooks in /Users/me/project/ to ~/git/"
- "Upload dataset.csv to DBFS /FileStore/"

---

## 🎉 Setup Complete!

**Total Tools:** 30
**Setup Time:** ~5-10 minutes
**Safety Layers:** 3 (local backup, Databricks revisions, restore options)
**Status:** Production Ready ✅

---

## 📞 Support

If issues occur:
1. Check Troubleshooting section above
2. Review Cursor logs: View → Output → "Model Context Protocol"
3. Verify authentication: `databricks clusters list --profile dev`
4. Check syntax: `node -c ~/databricks-mcp/mcp-databricks-cli-server.js`

---

**Remember:** The user provided you with 2 files:
1. This instruction file ✓
2. mcp-databricks-cli-server.js (the actual server code) ✓

Use both to complete the setup!


