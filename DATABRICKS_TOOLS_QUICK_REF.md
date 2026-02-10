# Databricks Tools Quick Reference

## 🎯 30 Tools - Quick Lookup ⭐ Updated!

### ⚡ Execution (5)
| Tool | What It Does |
|------|--------------|
| `run_notebook` | Execute notebook on cluster |
| `get_run` | Check execution status |
| `get_run_output` | Get results from run |
| `cancel_run` | Stop running execution |
| `list_runs` | View recent runs |

### 🖥️ Clusters (5)
| Tool | What It Does |
|------|--------------|
| `list_clusters` | Show all clusters |
| `get_cluster_status` | Detailed cluster info |
| `start_cluster` | Wake up stopped cluster |
| `stop_cluster` | Shut down cluster (save $) |
| `restart_cluster` | Restart cluster |

### 📋 Jobs (4)
| Tool | What It Does |
|------|--------------|
| `list_jobs` | Show all jobs |
| `get_job_details` | Job configuration |
| `run_job` | Trigger job |
| `get_job_runs` | Job execution history |

### 📁 DBFS Files (4)
| Tool | What It Does |
|------|--------------|
| `list_dbfs` | Browse DBFS folders |
| `read_dbfs_file` | Read file content |
| `upload_to_dbfs` | Upload local → DBFS |
| `download_from_dbfs` | Download DBFS → local |

### 🔍 SQL (2)
| Tool | What It Does |
|------|--------------|
| `list_sql_warehouses` | Show SQL warehouses |
| `execute_sql` | Run SQL query |

### 📝 Workspace (5)
| Tool | What It Does |
|------|--------------|
| `list_notebooks` | Browse notebooks |
| `get_notebook` | Read notebook content |
| `create_notebook` | Create new notebook |
| `delete_notebook` | Remove notebook |
| `move_notebook` | Rename/move notebook |

### 📦 Libraries (2)
| Tool | What It Does |
|------|--------------|
| `list_cluster_libraries` | Show installed libs |
| `install_library` | Add package to cluster |

### ✏️ Edit/Export (3) ⭐ NEW!
| Tool | What It Does |
|------|--------------|
| `export_notebook` | Download notebook to local |
| `import_notebook` | Upload with auto-backup |
| `get_notebook_revisions` | View revision info |

---

## 🚀 Top 12 Most Useful Commands ⭐ Updated!

1. **"List my clusters"** → `list_clusters`
2. **"Run notebook X on cluster Y"** → `run_notebook`
3. **"Export notebook X to local"** → `export_notebook` ⭐ NEW!
4. **"Import file to notebook X"** → `import_notebook` ⭐ NEW!
5. **"Check run status"** → `get_run`
6. **"Show results"** → `get_run_output`
7. **"Start cluster X"** → `start_cluster`
8. **"Stop cluster X"** → `stop_cluster`
9. **"List files in DBFS"** → `list_dbfs`
10. **"Run this SQL query"** → `execute_sql`
11. **"What jobs do I have?"** → `list_jobs`
12. **"Install pandas"** → `install_library`

---

## 💰 Cost-Saving Tips

```
✅ DO: Stop clusters when done
✅ DO: Use execute_sql for quick queries
✅ DO: Monitor run durations

❌ DON'T: Leave clusters running overnight
❌ DON'T: Use large clusters for small tasks
❌ DON'T: Forget to cancel failed runs
```

---

## ⚡ Quick Workflows

### Run Notebook
```
list_clusters → start_cluster → run_notebook → get_run → get_run_output → stop_cluster
```

### Edit Notebook ⭐ NEW!
```
export_notebook → (edit locally) → import_notebook (auto-backup)
```

### Quick Query
```
list_sql_warehouses → execute_sql
```

### Deploy Code
```
create_notebook → install_library → restart_cluster → run_notebook
```

### File Operations
```
list_dbfs → read_dbfs_file → download_from_dbfs
```

---

## 🔧 Common Parameters

### Cluster ID
Format: `"1234-567890-abc123"`
Get from: `list_clusters`

### Notebook Path
Format: `"/Users/email@company.com/notebook-name"`
Get from: `list_notebooks`

### Job ID
Format: `12345` (number)
Get from: `list_jobs`

### DBFS Path
Format: `"dbfs:/FileStore/path/to/file"`
Get from: `list_dbfs`

### Warehouse ID
Format: `"abc123def456"`
Get from: `list_sql_warehouses`

---

## 📍 Where to Find IDs

| Need | Use Tool | Look For |
|------|----------|----------|
| Cluster ID | `list_clusters` | cluster_id field |
| Job ID | `list_jobs` | job_id field |
| Run ID | `run_notebook` or `list_runs` | run_id field |
| Warehouse ID | `list_sql_warehouses` | id field |
| Notebook Path | `list_notebooks` | path field |

---

## 🎯 Use Cases at a Glance

| I Want To... | Use This |
|--------------|----------|
| Train a model | `run_notebook` |
| Edit notebook code | `export_notebook` + `import_notebook` ⭐ |
| Add imports | `export_notebook` + `import_notebook` ⭐ |
| Fix bugs safely | `import_notebook` (auto-backup) ⭐ |
| Check if cluster is up | `get_cluster_status` |
| Save money | `stop_cluster` |
| Query data quickly | `execute_sql` |
| Check results | `get_run_output` |
| Upload dataset | `upload_to_dbfs` |
| Install package | `install_library` |
| Create new analysis | `create_notebook` |
| Trigger pipeline | `run_job` |
| View logs | `read_dbfs_file` |
| Version control notebooks | `export_notebook` (save to git) ⭐ |

---

**Restart Cursor to activate all 30 tools!** 🚀

⭐ **NEW:** 3 export/import/edit tools with auto-backup protection!

---

## 🔒 Security Notes

**Human Approval Required** for these destructive tools:
| Tool | Requires `confirm: true` |
|------|--------------------------|
| `delete_notebook` | ✅ Yes |
| `move_notebook` | ✅ Yes |
| `restart_cluster` | ✅ Yes |
| `stop_cluster` | ✅ Yes |
| `upload_to_dbfs` | ✅ Yes |

**Shell Injection Prevention:** Server uses `execFileSync` (no shell), all args passed as arrays.

