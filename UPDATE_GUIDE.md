# Update Guide - For When New Tools Are Added

## 🎯 For Teammates: Getting Updates

### Super Simple Version

```bash
cd ~/databricks-mcp-server
git pull
```

**That's it!** Restart Cursor if you want to use new tools immediately.

---

## 📖 Detailed Steps

### 1. Pull Latest Code

```bash
cd ~/databricks-mcp-server
git pull origin main
```

### 2. Install Any New Dependencies (Rare)

```bash
npm install
```

This is usually automatic, but run it if you see errors.

### 3. Restart Cursor

- Quit Cursor completely (Command + Q / Alt + F4)
- Reopen
- Wait 10-15 seconds

New tools are now available!

---

## ✅ Verify You Have Latest Version

Ask Cursor:
```
"What Databricks tools are available?"
```

Or check `server.js` version:
```bash
head -1 ~/databricks-mcp-server/package.json | grep version
```

---

## 🔄 When to Update?

### Update When:
- ✅ Team announces new tools
- ✅ Bug fixes are pushed
- ✅ You see "unknown tool" error
- ✅ Once a week to stay current

### Don't Need to Update:
- ❌ Your current tools work fine
- ❌ No new features you need
- ❌ You just updated yesterday

---

## 🎯 What Gets Updated?

### Files That Change
- `server.js` - New tools, bug fixes
- `README.md` - Documentation updates
- `package.json` - Version bumps (rare)

### Files That DON'T Change (Your Local Config)
- `~/.cursor/mcp.json` - Your Cursor config
- `~/.databrickscfg` - Your credentials
- `node_modules/` - Auto-updated if needed

---

## 🚨 Troubleshooting Updates

### "Git pull failed: uncommitted changes"

You probably edited files. Save your changes:

```bash
# Save your local changes
git stash

# Get updates
git pull

# Reapply your changes
git stash pop
```

### "npm install" shows errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### New tools not showing after update

1. **Restart Cursor completely** (Command + Q)
2. Wait 10-15 seconds
3. Check logs: View → Output → "Model Context Protocol"

### "Error: Failed to load MCP server"

```bash
# Verify syntax
cd ~/databricks-mcp-server
npm test

# If errors, pull again
git pull
npm install
```

---

## 📊 Update Frequency

### Recommended Schedule

**Weekly Check** (Friday afternoons):
```bash
cd ~/databricks-mcp-server
git pull
# If anything updated, restart Cursor
```

**On-Demand** (when notified):
```bash
git pull  # Someone added cool new tool!
```

---

## 🔔 Stay Notified

### Option 1: Team Chat
Watch for: "🚀 New Databricks MCP tool: X"

### Option 2: GitHub Watch
Star the repo and "Watch" for notifications

### Option 3: Weekly Team Sync
Updates announced in standup

---

## 🤔 Should I Update Right Now?

### ✅ Yes, Update Now If:
- Someone just added a tool you need
- You're getting "unknown tool" errors
- It's been over a week
- Team says "breaking changes"

### ⏰ Can Wait If:
- Everything works fine
- You're in the middle of something
- Updated in last 2-3 days
- No new features announced

---

## 📝 Update Log

Want to see what changed?

```bash
cd ~/databricks-mcp-server
git log --oneline -10
```

Shows last 10 commits:
```
a1b2c3d Add backup_all_notebooks tool
e4f5g6h Fix cluster status error handling
h7i8j9k Update README with examples
```

---

## 🎯 Quick Reference Card

```bash
# ====================================
# QUICK UPDATE COMMANDS
# ====================================

# 1. Update code
cd ~/databricks-mcp-server && git pull

# 2. Install new deps (if any)
npm install

# 3. Restart Cursor
# Command + Q (Mac) or Alt + F4 (Windows)

# 4. Test
# Ask Cursor: "List Databricks tools"
```

---

## 💡 Pro Tips

1. **Update on Friday:** If issues arise, weekend to fix
2. **Read commit messages:** `git log` shows what changed
3. **Test after update:** Try one command before deep work
4. **Keep local changes minimal:** Don't edit `server.js` directly (or use branches)

---

## 🤝 Contributing Updates

Want to add tools yourself? See `CONTRIBUTING.md`

Workflow:
1. Pull latest: `git pull`
2. Edit `server.js`
3. Test locally
4. Push: `git push`
5. Notify team

---

## 🆘 Emergency: Rollback

Something broke after update?

```bash
cd ~/databricks-mcp-server

# See recent commits
git log --oneline -5

# Rollback to previous commit
git reset --hard HEAD~1

# Or rollback to specific commit
git reset --hard a1b2c3d

# Restart Cursor
```

---

## 📞 Questions?

- "Update not working?" → Check troubleshooting section above
- "Want to add a tool?" → See `CONTRIBUTING.md`
- "Broke something?" → Use rollback section above
- "General questions?" → Ask in team chat

Keep your tools fresh! 🚀

