# Contributing to Databricks MCP Server

## 🎯 Quick Start for Contributors

### Adding New Tools

All tools are in `server.js`. Follow this pattern:

---

## 📝 Step-by-Step Guide

### 1. Create the Method

Add a new async method in the `DatabricksCLIMCPServer` class:

```javascript
async myNewTool(arg1, arg2) {
  try {
    const output = await this.executeCLI(`databricks <command> ${arg1} --output json`);
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Failed to do thing: ${error.message}`);
  }
}
```

**Location:** After line 476, before `setupHandlers()`

### 2. Register the Tool Definition

In `setupHandlers()`, add to the `tools` array:

```javascript
{
  name: 'my_new_tool',
  description: 'Clear description of what this does',
  inputSchema: {
    type: 'object',
    properties: {
      arg1: {
        type: 'string',
        description: 'What is this argument?',
      },
      arg2: {
        type: 'number',
        description: 'What is this for?',
        default: 10,
      },
    },
    required: ['arg1'],
  },
},
```

**Location:** In `ListToolsRequestSchema` handler, after line 959

### 3. Add the Handler

In the `CallToolRequestSchema` handler, add a new case:

```javascript
case 'my_new_tool': {
  const results = await this.myNewTool(args.arg1, args.arg2 || 10);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
}
```

**Location:** After line 1351, before the `default` case

---

## 🔍 Real Example: Adding "list_warehouses_by_size"

### Step 1: Method
```javascript
async listWarehousesBySize() {
  try {
    const output = await this.executeCLI('databricks sql warehouses list --output json');
    const result = JSON.parse(output);
    const warehouses = result.warehouses || [];
    
    // Sort by size
    return warehouses.sort((a, b) => {
      const sizeOrder = { 'X-Small': 1, 'Small': 2, 'Medium': 3, 'Large': 4, 'X-Large': 5 };
      return sizeOrder[a.cluster_size] - sizeOrder[b.cluster_size];
    });
  } catch (error) {
    throw new Error(`Failed to list warehouses: ${error.message}`);
  }
}
```

### Step 2: Tool Definition
```javascript
{
  name: 'list_warehouses_by_size',
  description: 'List SQL warehouses sorted by size (X-Small to X-Large)',
  inputSchema: {
    type: 'object',
    properties: {},
  },
},
```

### Step 3: Handler
```javascript
case 'list_warehouses_by_size': {
  const results = await this.listWarehousesBySize();
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
}
```

---

## ✅ Testing Your Tool

### 1. Syntax Check
```bash
npm test
```

### 2. Manual Test
```bash
# Restart Cursor completely (Command + Q)
# Then ask AI:
"Use the my_new_tool to do X"
```

### 3. Check Logs
View → Output → "Model Context Protocol"

---

## 📋 Commit Guidelines

### Good Commit Messages
```bash
git commit -m "Add list_warehouses_by_size tool"
git commit -m "Fix export_notebook error handling"
git commit -m "Update docs for new SQL tools"
```

### Bad Commit Messages
```bash
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "wip"
```

---

## 🔄 Workflow

### Before Starting
```bash
git pull  # Get latest changes
```

### Making Changes
```bash
# Edit server.js
npm test  # Check syntax
# Test in Cursor
git add server.js
git commit -m "Add X tool"
git push
```

### After Pushing
Notify team: "New tool available! Run `git pull` in ~/databricks-mcp-server"

---

## 🛠️ Common Patterns

### Pattern 1: Simple List Command
```javascript
async listSomething() {
  const output = await this.executeCLI('databricks <thing> list --output json');
  const result = JSON.parse(output);
  return result.<things> || [];
}
```

### Pattern 2: Get by ID
```javascript
async getSomething(id) {
  const output = await this.executeCLI(`databricks <thing> get ${id} --output json`);
  return JSON.parse(output);
}
```

### Pattern 3: Action with Confirmation
```javascript
async doSomething(id, params = {}) {
  const jsonParams = JSON.stringify(params);
  const output = await this.executeCLI(
    `databricks <thing> do ${id} --json '${jsonParams}' --output json`
  );
  return JSON.parse(output);
}
```

### Pattern 4: File Operations
```javascript
async downloadSomething(remotePath, localPath) {
  const fs = require('fs');
  const content = await this.executeCLI(`databricks <thing> export ${remotePath}`);
  fs.writeFileSync(localPath, content);
  return { path: localPath, size: content.length };
}
```

---

## 🎯 Ideas for New Tools

### Already Have (30 tools)
- ✅ Notebooks: list, get, export, import
- ✅ Clusters: list, start, stop, restart, status
- ✅ Jobs: list, run, get details, get runs
- ✅ DBFS: list, read, upload, download
- ✅ SQL: execute, list warehouses
- ✅ Libraries: list, install

### Potential Additions
- 🔮 **Notebook Search:** Search by content/name
- 🔮 **Cluster Cost Tracking:** Estimate costs
- 🔮 **Job Scheduling:** Create/update job schedules
- 🔮 **Delta Table Ops:** Optimize, vacuum, describe
- 🔮 **Secrets Management:** List scopes, get values
- 🔮 **Unity Catalog:** List catalogs, schemas, tables
- 🔮 **Repos Integration:** Git sync for notebooks

---

## 📖 Resources

### Databricks CLI Docs
```bash
databricks --help
databricks <command> --help
databricks <command> <subcommand> --help
```

### Example Commands
```bash
# List all subcommands
databricks --help

# See options for clusters
databricks clusters --help

# JSON output (always use this)
databricks clusters list --output json
```

### Databricks CLI Reference
https://docs.databricks.com/en/dev-tools/cli/index.html

---

## 🐛 Common Issues

### CLI Command Returns Error
```javascript
// Add better error context
throw new Error(`Failed to do X: ${error.message}\nCommand: ${command}`);
```

### JSON Parsing Fails
```javascript
// Some CLI commands return text, not JSON
const output = await this.executeCLI(`databricks <cmd>`);
// Don't parse if not JSON format
return { content: output };
```

### Need to Pass Complex JSON
```javascript
// Escape quotes properly
const jsonString = JSON.stringify(params).replace(/"/g, '\\"');
await this.executeCLI(`databricks cmd --json "${jsonString}"`);
```

---

## 🤝 Code Review Checklist

Before pushing:
- [ ] Method has clear name
- [ ] Error handling included
- [ ] Tool description is clear
- [ ] Required vs optional params correct
- [ ] `npm test` passes
- [ ] Tested in Cursor with AI
- [ ] Updated `README.md` if adding major feature

---

## 💡 Pro Tips

1. **Test error cases:** Try with invalid IDs, missing params
2. **Check CLI docs:** `databricks <command> --help`
3. **Look at existing tools:** Copy patterns from `server.js`
4. **Use JSON output:** Always `--output json` for consistency
5. **Document defaults:** Show default values in descriptions

---

## 🎨 Style Guidelines

### Naming
- Methods: `camelCase` (e.g., `runNotebook`)
- Tool names: `snake_case` (e.g., `run_notebook`)
- Variables: `camelCase`

### Comments
- Add comments for complex logic only
- Don't comment obvious code
- Explain "why", not "what"

### Error Messages
- Be specific: "Failed to start cluster: timeout" ✅
- Not generic: "Error" ❌

---

## 📞 Questions?

- Check existing tools in `server.js` for patterns
- Ask in team chat
- Review Databricks CLI docs
- Test with `databricks <cmd> --help`

Happy contributing! 🚀

