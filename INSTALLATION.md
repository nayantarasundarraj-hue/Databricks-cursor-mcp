# Installation Guide for Teammates

## 🎯 Quick Setup (First Time)

### 1. Clone the Repository

```bash
cd ~/
git clone <YOUR_GITHUB_REPO_URL> databricks-mcp-server
cd databricks-mcp-server
```

### 2. Install Dependencies

```bash
npm install
```

This installs the MCP SDK locally. Takes ~10 seconds.

### 3. Authenticate with Databricks

```bash
databricks auth login --profile dev --host https://affirm-prod-us.cloud.databricks.com
```

- Opens browser for OAuth login
- Saves credentials to `~/.databrickscfg` (local only, not in repo)

### 4. Configure Cursor

Edit `~/.cursor/mcp.json` (create if doesn't exist):

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

**⚠️ IMPORTANT:** Replace `YOUR-USERNAME` with your actual Mac username!

To find it: `echo ~`

### 5. Restart Cursor

- **Quit completely** (Command + Q)
- Reopen
- Wait 10-15 seconds

### 6. Test It!

In Cursor, ask:
- "List my Databricks clusters"
- "Show available Databricks tools"

---

## 🔄 Updating (When New Tools Are Added)

When someone adds new tools to the repo:

```bash
cd ~/databricks-mcp-server
git pull
```

**That's it!** New tools are available immediately.

If you see any npm errors:

```bash
npm install
```

Then **restart Cursor** (Command + Q and reopen).

---

## 🐛 Troubleshooting

### "MCP SDK wasn't accessible"
```bash
cd ~/databricks-mcp-server
npm install
# Restart Cursor
```

### "Authentication failed"
```bash
databricks auth login --profile dev
# Restart Cursor
```

### "Token expired"
```bash
databricks auth login --profile dev
# Restart Cursor
```

### Tools not showing up
1. Check path in `~/.cursor/mcp.json` is absolute (starts with `/Users/`)
2. Restart Cursor **completely** (Quit + Reopen)
3. Wait 10-15 seconds
4. Check logs: View → Output → "Model Context Protocol"

---

## 🎨 For AI Setup (Alternative)

If you prefer using AI to set this up:

1. Clone the repo
2. Upload these files to Cursor chat:
   - `INSTALLATION.md` (this file)
   - `package.json`
   - Path to cloned repo
3. Say: "Set up Databricks MCP using this repo"

AI will configure everything automatically!

---

## 📁 What Gets Committed vs. Local

### ✅ In Git (Shared)
- `server.js` - The actual MCP server
- `package.json` - Dependencies list
- `README.md` - Documentation
- `.gitignore` - What not to commit

### ❌ Local Only (Not in Git)
- `node_modules/` - Installed packages (run `npm install`)
- `package-lock.json` - Exact versions (auto-generated)
- `.databrickscfg` - Your credentials (personal)
- `~/.cursor/mcp.json` - Your Cursor config (personal)

---

## 🤝 Contributing New Tools

### Adding a Tool

1. **Pull latest:**
```bash
git pull
```

2. **Edit `server.js`:**
   - Add method (e.g., `async myNewTool()`)
   - Add case in `CallToolRequestSchema` handler
   - Add tool definition in `ListToolsRequestSchema`

3. **Test locally:**
```bash
npm test  # Syntax check
# Restart Cursor and test the tool
```

4. **Commit & Push:**
```bash
git add server.js
git commit -m "Add new tool: myNewTool"
git push
```

5. **Notify team:**
"New tool available! Run `git pull` in ~/databricks-mcp-server"

### Example: Adding a "backup_notebook" tool

See `server.js` lines 361-444 for export/import examples.

---

## 🎯 Next Steps

After setup:
1. Read `README.md` for all 30 tools
2. Try example workflows
3. Start using AI to manage Databricks!

---

## 💬 Questions?

Ask in team chat or check `README.md` for full documentation!

