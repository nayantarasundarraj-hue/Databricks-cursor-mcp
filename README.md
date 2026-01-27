# Databricks MCP Server for Cursor

33 powerful tools to manage Databricks directly from Cursor IDE with AI assistance.

## 🚀 Quick Setup

### Prerequisites
- Node.js v14+ (`node --version`)
- Databricks CLI (`databricks --version`)
- Databricks account with OAuth access

### Installation

```bash
# 1. Clone or download this directory
cd ~/databricks-mcp-server

# 2. Install dependencies
npm install

# 3. Verify installation
npm test

# 4. Authenticate with Databricks
databricks auth login --profile dev --host https://YOUR-WORKSPACE.cloud.databricks.com

# 5. Configure Cursor
```

Edit `~/.cursor/mcp.json`:

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
        "DATABRICKS_WORKSPACE_HOST": "YOUR-WORKSPACE.cloud.databricks.com"
      }
    }
  }
}
```

**Important:** Replace `YOUR-USERNAME` and `YOUR-WORKSPACE` with your actual values!

### 6. Restart Cursor

**Quit completely** (Command + Q / Alt + F4) and reopen. Wait 10-15 seconds.

## ✅ Verify It Works

In Cursor, ask:
- "List my Databricks clusters"
- "List notebooks in /Users/"
- "Show me available Databricks tools"

## 🛠️ What You Get - 33 Tools

### 📖 Browse & Read (5)
- `list_notebooks` - Browse folders
- `get_notebook` - Read content
- `list_clusters` - Show clusters
- `list_jobs` - Show jobs
- `get_job_details` - Job info

### ⚡ Execute & Monitor (5)
- `run_notebook` - Execute with parameters
- `get_run` - Check status
- `get_run_output` - Get results
- `cancel_run` - Stop execution
- `list_runs` - View history

### ✏️ Edit Notebooks (3) - with Auto-Backup!
- `export_notebook` - Download
- `import_notebook` - Upload with backup
- `get_notebook_revisions` - View history

### 🖥️ Manage Clusters (4)
- `start_cluster` - Wake up
- `stop_cluster` - Save costs
- `get_cluster_status` - Check status
- `restart_cluster` - Restart

### 📋 Job Operations (2)
- `run_job` - Trigger jobs
- `get_job_runs` - View runs

### 📁 DBFS Operations (4)
- `list_dbfs` - Browse filesystem
- `read_dbfs_file` - Read files
- `upload_to_dbfs` - Upload
- `download_from_dbfs` - Download

### 🔍 SQL Queries (2)
- `execute_sql` - Run queries
- `list_sql_warehouses` - List warehouses

### 📝 Workspace Management (3)
- `create_notebook` - Create new
- `delete_notebook` - Remove
- `move_notebook` - Organize

### 📦 Library Management (2)
- `list_cluster_libraries` - Show installed
- `install_library` - Add packages

## 💡 Usage Examples

**Edit code safely:**
```
"Add import pandas as pd to /Users/me/notebook"
```

**Save money:**
```
"Stop all idle clusters"
```

**Query data:**
```
"Run this SQL on warehouse abc123: SELECT * FROM users LIMIT 10"
```

**Automate workflows:**
```
"Run /Users/me/ETL on cluster X with params date=2024-01-20"
```

## 🔒 Safety Features

Every notebook edit:
- ✅ Automatic local backup (timestamped)
- ✅ New Databricks revision (UI rollback)
- ✅ No data loss possible

## 🐛 Troubleshooting

### "MCP SDK wasn't accessible"
```bash
cd ~/databricks-mcp-server
npm install
```

### "Authentication failed"
```bash
databricks auth login --profile dev
```

### "Token expired"
```bash
databricks auth login --profile dev
# Then restart Cursor
```

### Tools not showing
1. Check absolute path in `mcp.json`
2. Restart Cursor completely (Quit + Reopen)
3. Wait 10-15 seconds
4. Check logs: View → Output → "Model Context Protocol"

## 📁 Project Structure

```
databricks-mcp-server/
├── server.js           # Main MCP server (1,380 lines)
├── package.json        # Dependencies
├── node_modules/       # Installed packages (auto-created)
└── README.md          # This file
```

## 🤝 Contributing

To add new tools:

1. Add method in `server.js`:
```javascript
async myNewTool(args) {
  const result = await this.executeCLI('databricks ...');
  return result;
}
```

2. Register in `setupHandlers()`:
```javascript
case 'my_new_tool':
  const result = await this.myNewTool(args);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
```

3. Add tool definition in `ListToolsRequestSchema` handler

4. Test and commit!

## 📝 License

MIT - Feel free to modify and share

## 💬 Support

Issues? Check troubleshooting above or ask the team!


