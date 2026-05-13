# Databricks MCP Server for Cursor

30 powerful tools to manage Databricks directly from Cursor IDE with AI assistance.

## 🚀 Quick Setup

### Prerequisites
- Node.js v14+ (`node --version`) — if missing, run `brew install node`
- Databricks CLI (`databricks --version`) — if missing, run `brew install databricks`
- Databricks account with OAuth access

### Installation

```bash
# 1. Clone or download this directory
git clone https://github.com/nayantarasundarraj-hue/Databricks-cursor-mcp.git ~/databricks-mcp-server
cd ~/databricks-mcp-server

# 2. Install dependencies
npm install

# 3. Verify installation
npm test

# 4. Authenticate with Databricks
databricks auth login --profile dev --host https://YOUR-WORKSPACE.cloud.databricks.com

# 5. Verify your paths (note these down for the config below)
which node
which databricks

# 6. Configure Cursor
```

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "databricks": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/databricks-mcp-server/server.js"
      ],
      "env": {
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
        "DATABRICKS_PROFILE": "dev",
        "DATABRICKS_WORKSPACE_HOST": "YOUR-WORKSPACE.cloud.databricks.com"
      }
    }
  }
}
```

**Important:**
- Replace `YOUR_USERNAME` with your macOS username and `YOUR-WORKSPACE` with your Databricks workspace hostname.
- `DATABRICKS_PROFILE` must match the profile name you used during `databricks auth login`. Common values are `dev`, `affirm-prod`, or `DEFAULT`. Check `~/.databrickscfg` to see your profiles.
- If you get `node: command not found`, run `which node` and replace `"node"` with the full path (e.g. `/opt/homebrew/bin/node`).

### 6. Restart Cursor

**Quit completely** (Command + Q / Alt + F4) and reopen. Wait 10-15 seconds.

## ✅ Verify It Works

In Cursor, ask:
- "List my Databricks clusters"
- "List notebooks in /Users/"
- "Show me available Databricks tools"

## 🛠️ What You Get - 30 Tools

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

- ✅ **Path validation** — all local file operations are restricted to your home directory and /tmp; sensitive paths (.ssh, .aws, .env, .kube, etc.) are blocked
- ✅ **Shell injection prevention** — uses `execFileSync` (not `execSync`), no shell interpretation
- ✅ **Human-in-the-loop (HIL)** — 8 operations require explicit user confirmation: `run_notebook`, `run_job`, `delete_notebook`, `move_notebook`, `stop_cluster`, `restart_cluster`, `upload_to_dbfs`, `install_library`
- ✅ **SQL blocklist** — DDL/DML/Databricks-specific statements (DROP, DELETE, INSERT, COPY INTO, CALL, VACUUM, etc.) require confirmation; read-only SQL runs immediately
- ✅ **Error sanitization** — OAuth tokens, URLs, and internal paths are stripped from error messages
- ✅ **Language validation** — only PYTHON, SQL, SCALA, R accepted for notebook creation
- ✅ **Pinned dependencies** — SDK version locked to prevent supply chain attacks
- ✅ Automatic local backup on notebook edits (timestamped)
- ✅ New Databricks revision on import (UI rollback)

### ⚠️ Agentic Deployment Warning

This MCP exposes both read and write tools in a single server. In an agentic context where the AI processes untrusted content (web pages, Slack messages, RAG documents, emails), a prompt injection could chain read operations (e.g., `get_notebook`, `read_dbfs_file`) with write/exec operations (e.g., `execute_sql`, `upload_to_dbfs`). 

**Recommendations:**
- Do NOT co-install this MCP in an agent that also has tools reading untrusted external content (web fetch, Slack search, RAG over external docs, mailbox readers) without understanding this risk.
- Always review HIL confirmation prompts carefully — they show the full operation details including file paths and SQL queries.
- For high-security environments, consider disabling write tools via `disabledTools` in your Cursor MCP config and only enabling the read-only subset.

## 🐛 Troubleshooting

### "node: command not found"
Cursor doesn't load your shell config (.zshrc), so it may not find `node`. Run `which node` in your terminal and use that full path as the `command` value in your `mcp.json`.

### "databricks not found" on tool calls
Same issue — Cursor can't find the Databricks CLI. Make sure the `PATH` in your config `env` includes the directory from `which databricks` (usually `/opt/homebrew/bin` or `/usr/local/bin`).

### "npm: command not found"
You need Node.js installed:
```bash
brew install node
```
Then retry `npm install`.

### "Cannot find module @modelcontextprotocol/sdk"
```bash
cd ~/databricks-mcp-server
npm install
```

### "Authentication failed" or "Token expired"
```bash
databricks auth login --profile YOUR_PROFILE --host https://YOUR-WORKSPACE.cloud.databricks.com
# Then restart Cursor (Cmd+Q, reopen)
```

### "Profile not found"
Make sure `DATABRICKS_PROFILE` in your `mcp.json` matches a profile in `~/.databrickscfg`. Run `cat ~/.databrickscfg` to check.

### Tools not showing in Cursor
1. Check the absolute path in `mcp.json` is correct
2. Quit Cursor completely (Cmd+Q) and reopen
3. Wait 10-15 seconds
4. Check Settings → MCP for connection status
5. Check logs: View → Output → "Model Context Protocol"

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
  const result = await this.executeCLI(['my-command', 'subcommand', args.param, '--output', 'json']);
  return JSON.parse(result);
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


