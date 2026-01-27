#!/usr/bin/env node
/**
 * Databricks MCP Server - CLI-based version
 * Uses Databricks CLI (which handles OAuth) instead of direct API calls
 * This might bypass IP ACL if OAuth is configured with exceptions
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { execSync } = require('child_process');

class DatabricksCLIMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'databricks-cli-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.workspaceHost = process.env.DATABRICKS_WORKSPACE_HOST;
    this.setupHandlers();
  }

  async executeCLI(command) {
    try {
      // Use databricks command (new CLI is in PATH via Homebrew)
      // New CLI uses OAuth authentication stored in ~/.databrickscfg
      
      // Set Databricks host/profile if provided
      const env = { ...process.env };
      if (process.env.DATABRICKS_WORKSPACE_HOST) {
        env.DATABRICKS_HOST = `https://${process.env.DATABRICKS_WORKSPACE_HOST}`;
      }
      if (process.env.DATABRICKS_PROFILE) {
        env.DATABRICKS_PROFILE = process.env.DATABRICKS_PROFILE;
      }

      const result = execSync(command, {
        encoding: 'utf-8',
        env: env,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      return result.trim();
    } catch (error) {
      throw new Error(`CLI command failed: ${error.message}`);
    }
  }

  async listWorkspaceItems(path = '/') {
    try {
      // New CLI uses 'list' command and supports JSON output
      const output = await this.executeCLI(`databricks workspace list ${path} --output json`);
      const items = JSON.parse(output);
      
      // CLI returns array directly, not wrapped in objects
      const itemsArray = Array.isArray(items) ? items : (items.objects || []);
      
      // Convert to consistent format
      return itemsArray.map(item => ({
        object_type: item.object_type,
        path: item.path,
        name: item.path.split('/').pop(),
        language: item.language || null,
        object_id: item.object_id
      }));
    } catch (error) {
      throw new Error(`Failed to list workspace: ${error.message}`);
    }
  }

  async getNotebook(path) {
    try {
      // New CLI uses 'export' command
      const content = await this.executeCLI(`databricks workspace export "${path}" --format SOURCE`);
      
      return {
        path: path,
        content: content,
        format: 'SOURCE'
      };
    } catch (error) {
      throw new Error(`Failed to get notebook: ${error.message}`);
    }
  }

  async listClusters() {
    try {
      const output = await this.executeCLI('databricks clusters list --output json');
      const clusters = JSON.parse(output);
      return Array.isArray(clusters) ? clusters : clusters.clusters || [];
    } catch (error) {
      throw new Error(`Failed to list clusters: ${error.message}`);
    }
  }

  async listJobs() {
    try {
      const output = await this.executeCLI('databricks jobs list --output json');
      const jobs = JSON.parse(output);
      return Array.isArray(jobs) ? jobs : jobs.jobs || [];
    } catch (error) {
      throw new Error(`Failed to list jobs: ${error.message}`);
    }
  }

  async getJobDetails(jobId) {
    try {
      const output = await this.executeCLI(`databricks jobs get ${jobId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to get job details: ${error.message}`);
    }
  }

  async runNotebook(notebookPath, clusterId, notebookParams = {}) {
    try {
      // Build the notebook task JSON
      const taskJson = {
        run_name: `Notebook run: ${notebookPath.split('/').pop()}`,
        existing_cluster_id: clusterId,
        notebook_task: {
          notebook_path: notebookPath,
          base_parameters: notebookParams
        }
      };

      // Submit the run using databricks runs submit
      const jsonString = JSON.stringify(taskJson).replace(/"/g, '\\"');
      const output = await this.executeCLI(`databricks runs submit --json "${jsonString}" --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to run notebook: ${error.message}`);
    }
  }

  async getRun(runId) {
    try {
      const output = await this.executeCLI(`databricks runs get ${runId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to get run: ${error.message}`);
    }
  }

  async getRunOutput(runId) {
    try {
      const output = await this.executeCLI(`databricks runs get-output ${runId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to get run output: ${error.message}`);
    }
  }

  async cancelRun(runId) {
    try {
      const output = await this.executeCLI(`databricks runs cancel ${runId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to cancel run: ${error.message}`);
    }
  }

  async listRuns(limit = 25) {
    try {
      const output = await this.executeCLI(`databricks runs list --limit ${limit} --output json`);
      const result = JSON.parse(output);
      return result.runs || [];
    } catch (error) {
      throw new Error(`Failed to list runs: ${error.message}`);
    }
  }

  // Cluster Management
  async startCluster(clusterId) {
    try {
      const output = await this.executeCLI(`databricks clusters start ${clusterId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to start cluster: ${error.message}`);
    }
  }

  async stopCluster(clusterId) {
    try {
      const output = await this.executeCLI(`databricks clusters stop ${clusterId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to stop cluster: ${error.message}`);
    }
  }

  async getClusterStatus(clusterId) {
    try {
      const output = await this.executeCLI(`databricks clusters get ${clusterId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to get cluster status: ${error.message}`);
    }
  }

  async restartCluster(clusterId) {
    try {
      const output = await this.executeCLI(`databricks clusters restart ${clusterId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to restart cluster: ${error.message}`);
    }
  }

  // Job Operations
  async runJob(jobId, notebookParams = {}) {
    try {
      const params = Object.keys(notebookParams).length > 0 
        ? `--notebook-params '${JSON.stringify(notebookParams)}'` 
        : '';
      const output = await this.executeCLI(`databricks jobs run-now ${jobId} ${params} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to run job: ${error.message}`);
    }
  }

  async getJobRuns(jobId, limit = 25) {
    try {
      const output = await this.executeCLI(`databricks jobs list-runs --job-id ${jobId} --limit ${limit} --output json`);
      const result = JSON.parse(output);
      return result.runs || [];
    } catch (error) {
      throw new Error(`Failed to get job runs: ${error.message}`);
    }
  }

  // DBFS Operations
  async listDbfs(path = '/') {
    try {
      const output = await this.executeCLI(`databricks fs ls ${path} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to list DBFS: ${error.message}`);
    }
  }

  async readDbfsFile(path) {
    try {
      const output = await this.executeCLI(`databricks fs cat ${path}`);
      return { path, content: output };
    } catch (error) {
      throw new Error(`Failed to read DBFS file: ${error.message}`);
    }
  }

  async uploadToDbfs(localPath, dbfsPath) {
    try {
      const output = await this.executeCLI(`databricks fs cp ${localPath} ${dbfsPath} --overwrite`);
      return { local_path: localPath, dbfs_path: dbfsPath, status: output };
    } catch (error) {
      throw new Error(`Failed to upload to DBFS: ${error.message}`);
    }
  }

  async downloadFromDbfs(dbfsPath, localPath) {
    try {
      const output = await this.executeCLI(`databricks fs cp ${dbfsPath} ${localPath} --overwrite`);
      return { dbfs_path: dbfsPath, local_path: localPath, status: output };
    } catch (error) {
      throw new Error(`Failed to download from DBFS: ${error.message}`);
    }
  }

  // SQL Operations
  async executeSql(warehouseId, query) {
    try {
      // Create a temporary file for the query
      const queryJson = JSON.stringify({
        warehouse_id: warehouseId,
        statement: query
      });
      const output = await this.executeCLI(`databricks sql execute --warehouse-id ${warehouseId} --statement "${query.replace(/"/g, '\\"')}" --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to execute SQL: ${error.message}`);
    }
  }

  async listSqlWarehouses() {
    try {
      const output = await this.executeCLI('databricks sql warehouses list --output json');
      const result = JSON.parse(output);
      return result.warehouses || [];
    } catch (error) {
      throw new Error(`Failed to list SQL warehouses: ${error.message}`);
    }
  }

  // Workspace Management
  async createNotebook(path, language = 'PYTHON', content = '') {
    try {
      // Create a temp file with content
      const tempFile = `/tmp/notebook_${Date.now()}.${language.toLowerCase()}`;
      require('fs').writeFileSync(tempFile, content);
      const output = await this.executeCLI(`databricks workspace import ${tempFile} ${path} --language ${language} --format SOURCE --overwrite`);
      require('fs').unlinkSync(tempFile);
      return { path, status: 'created' };
    } catch (error) {
      throw new Error(`Failed to create notebook: ${error.message}`);
    }
  }

  async deleteNotebook(path) {
    try {
      const output = await this.executeCLI(`databricks workspace delete ${path}`);
      return { path, status: 'deleted' };
    } catch (error) {
      throw new Error(`Failed to delete notebook: ${error.message}`);
    }
  }

  async moveNotebook(sourcePath, destPath) {
    try {
      const output = await this.executeCLI(`databricks workspace export ${sourcePath} --format SOURCE`);
      await this.executeCLI(`databricks workspace import /dev/stdin ${destPath} --format SOURCE --overwrite`, output);
      await this.executeCLI(`databricks workspace delete ${sourcePath}`);
      return { source: sourcePath, destination: destPath, status: 'moved' };
    } catch (error) {
      throw new Error(`Failed to move notebook: ${error.message}`);
    }
  }

  // Library Management
  async listClusterLibraries(clusterId) {
    try {
      const output = await this.executeCLI(`databricks libraries cluster-status --cluster-id ${clusterId} --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to list cluster libraries: ${error.message}`);
    }
  }

  async installLibrary(clusterId, librarySpec) {
    try {
      // librarySpec should be like: { pypi: { package: "pandas==1.3.0" } }
      const specJson = JSON.stringify({ libraries: [librarySpec] });
      const output = await this.executeCLI(`databricks libraries install --cluster-id ${clusterId} --json '${specJson}' --output json`);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to install library: ${error.message}`);
    }
  }

  // Export/Import Operations
  async exportNotebook(notebookPath, localPath, format = 'SOURCE') {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Export from Databricks
      const content = await this.executeCLI(`databricks workspace export "${notebookPath}" --format ${format}`);
      
      // Ensure directory exists
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write to local file
      fs.writeFileSync(localPath, content);
      
      return {
        notebook_path: notebookPath,
        local_path: localPath,
        format: format,
        size_bytes: content.length,
        status: 'exported'
      };
    } catch (error) {
      throw new Error(`Failed to export notebook: ${error.message}`);
    }
  }

  async importNotebook(localPath, notebookPath, language = 'PYTHON', createBackup = true) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      let backupInfo = null;
      
      // Auto-backup: Check if notebook exists and create backup
      if (createBackup) {
        try {
          // Try to export existing notebook as backup
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          const notebookName = path.basename(notebookPath, path.extname(notebookPath));
          const backupDir = path.join(path.dirname(localPath), 'databricks_backups');
          const backupPath = path.join(backupDir, `${notebookName}_backup_${timestamp}.py`);
          
          // Ensure backup directory exists
          if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
          }
          
          // Try to export existing notebook
          const existingContent = await this.executeCLI(`databricks workspace export "${notebookPath}" --format SOURCE`);
          fs.writeFileSync(backupPath, existingContent);
          
          backupInfo = {
            backup_created: true,
            backup_path: backupPath,
            backup_size_bytes: existingContent.length
          };
        } catch (error) {
          // Notebook might not exist yet, that's okay
          backupInfo = {
            backup_created: false,
            reason: 'Notebook does not exist yet or could not be exported'
          };
        }
      }
      
      // Import the notebook
      const output = await this.executeCLI(`databricks workspace import "${notebookPath}" --file "${localPath}" --language ${language} --format SOURCE --overwrite`);
      
      return {
        notebook_path: notebookPath,
        local_path: localPath,
        language: language,
        status: 'imported',
        backup_info: backupInfo,
        message: 'Import successful! New revision created in Databricks. You can restore previous versions via Revision History in the Databricks UI.'
      };
    } catch (error) {
      throw new Error(`Failed to import notebook: ${error.message}`);
    }
  }

  async getNotebookRevisions(notebookPath) {
    try {
      // Get the notebook's object ID first
      const items = await this.listWorkspaceItems(notebookPath.substring(0, notebookPath.lastIndexOf('/')));
      const notebook = items.find(item => item.path === notebookPath);
      
      if (!notebook || !notebook.object_id) {
        throw new Error('Notebook not found or no object ID available');
      }
      
      // Note: The CLI doesn't have a direct command for revision history
      // This would require API access which is blocked by IP ACL
      // Return guidance instead
      return {
        notebook_path: notebookPath,
        object_id: notebook.object_id,
        message: 'Revision history is available in the Databricks UI',
        instructions: [
          '1. Open the notebook in Databricks UI',
          '2. Click "Revision History" (clock icon in top right)',
          '3. Browse all past versions with timestamps',
          '4. Click "Restore this revision" to rollback',
          '5. View diffs between versions'
        ],
        ui_url: `https://${this.workspaceHost}/editor/notebooks/${notebook.object_id}`,
        note: 'Databricks automatically creates a new revision with every save/import'
      };
    } catch (error) {
      throw new Error(`Failed to get notebook revisions: ${error.message}`);
    }
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_notebooks',
          description: 'List notebooks and folders in the Databricks workspace (using CLI)',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Workspace path to list (default: "/")',
                default: '/',
              },
            },
          },
        },
        {
          name: 'get_notebook',
          description: 'Get the content of a Databricks notebook (using CLI)',
          inputSchema: {
            type: 'object',
            properties: {
              notebook_path: {
                type: 'string',
                description: 'Full path to the notebook',
              },
            },
            required: ['notebook_path'],
          },
        },
        {
          name: 'list_clusters',
          description: 'List all Databricks clusters (using CLI)',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'list_jobs',
          description: 'List all Databricks jobs (using CLI)',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_job_details',
          description: 'Get detailed information about a specific job (using CLI)',
          inputSchema: {
            type: 'object',
            properties: {
              job_id: {
                type: 'number',
                description: 'The job ID',
              },
            },
            required: ['job_id'],
          },
        },
        {
          name: 'run_notebook',
          description: 'Execute a Databricks notebook on a cluster. Returns run ID for tracking.',
          inputSchema: {
            type: 'object',
            properties: {
              notebook_path: {
                type: 'string',
                description: 'Full path to the notebook to execute',
              },
              cluster_id: {
                type: 'string',
                description: 'ID of the cluster to run the notebook on',
              },
              notebook_params: {
                type: 'object',
                description: 'Optional parameters to pass to the notebook as key-value pairs',
              },
            },
            required: ['notebook_path', 'cluster_id'],
          },
        },
        {
          name: 'get_run',
          description: 'Get status and details of a notebook run',
          inputSchema: {
            type: 'object',
            properties: {
              run_id: {
                type: 'number',
                description: 'The run ID returned from run_notebook',
              },
            },
            required: ['run_id'],
          },
        },
        {
          name: 'get_run_output',
          description: 'Get the output/results from a completed notebook run',
          inputSchema: {
            type: 'object',
            properties: {
              run_id: {
                type: 'number',
                description: 'The run ID to get output for',
              },
            },
            required: ['run_id'],
          },
        },
        {
          name: 'cancel_run',
          description: 'Cancel a running notebook execution',
          inputSchema: {
            type: 'object',
            properties: {
              run_id: {
                type: 'number',
                description: 'The run ID to cancel',
              },
            },
            required: ['run_id'],
          },
        },
        {
          name: 'list_runs',
          description: 'List recent notebook runs',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'number',
                description: 'Maximum number of runs to return (default: 25)',
                default: 25,
              },
            },
          },
        },
        // Cluster Management Tools
        {
          name: 'start_cluster',
          description: 'Start a stopped Databricks cluster',
          inputSchema: {
            type: 'object',
            properties: {
              cluster_id: {
                type: 'string',
                description: 'The cluster ID to start',
              },
            },
            required: ['cluster_id'],
          },
        },
        {
          name: 'stop_cluster',
          description: 'Stop a running Databricks cluster to save costs',
          inputSchema: {
            type: 'object',
            properties: {
              cluster_id: {
                type: 'string',
                description: 'The cluster ID to stop',
              },
            },
            required: ['cluster_id'],
          },
        },
        {
          name: 'get_cluster_status',
          description: 'Get detailed status and configuration of a cluster',
          inputSchema: {
            type: 'object',
            properties: {
              cluster_id: {
                type: 'string',
                description: 'The cluster ID to check',
              },
            },
            required: ['cluster_id'],
          },
        },
        {
          name: 'restart_cluster',
          description: 'Restart a Databricks cluster',
          inputSchema: {
            type: 'object',
            properties: {
              cluster_id: {
                type: 'string',
                description: 'The cluster ID to restart',
              },
            },
            required: ['cluster_id'],
          },
        },
        // Job Operations Tools
        {
          name: 'run_job',
          description: 'Trigger an existing Databricks job',
          inputSchema: {
            type: 'object',
            properties: {
              job_id: {
                type: 'number',
                description: 'The job ID to run',
              },
              notebook_params: {
                type: 'object',
                description: 'Optional parameters to pass to the job',
              },
            },
            required: ['job_id'],
          },
        },
        {
          name: 'get_job_runs',
          description: 'List runs for a specific job',
          inputSchema: {
            type: 'object',
            properties: {
              job_id: {
                type: 'number',
                description: 'The job ID',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of runs to return (default: 25)',
                default: 25,
              },
            },
            required: ['job_id'],
          },
        },
        // DBFS Operations Tools
        {
          name: 'list_dbfs',
          description: 'List files and folders in Databricks File System (DBFS)',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'DBFS path to list (default: "/")',
                default: '/',
              },
            },
          },
        },
        {
          name: 'read_dbfs_file',
          description: 'Read content of a file from DBFS',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'DBFS path to the file',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'upload_to_dbfs',
          description: 'Upload a local file to DBFS',
          inputSchema: {
            type: 'object',
            properties: {
              local_path: {
                type: 'string',
                description: 'Local file path',
              },
              dbfs_path: {
                type: 'string',
                description: 'Destination DBFS path',
              },
            },
            required: ['local_path', 'dbfs_path'],
          },
        },
        {
          name: 'download_from_dbfs',
          description: 'Download a file from DBFS to local filesystem',
          inputSchema: {
            type: 'object',
            properties: {
              dbfs_path: {
                type: 'string',
                description: 'DBFS path to download',
              },
              local_path: {
                type: 'string',
                description: 'Local destination path',
              },
            },
            required: ['dbfs_path', 'local_path'],
          },
        },
        // SQL Operations Tools
        {
          name: 'execute_sql',
          description: 'Execute a SQL query on a SQL warehouse',
          inputSchema: {
            type: 'object',
            properties: {
              warehouse_id: {
                type: 'string',
                description: 'SQL warehouse ID',
              },
              query: {
                type: 'string',
                description: 'SQL query to execute',
              },
            },
            required: ['warehouse_id', 'query'],
          },
        },
        {
          name: 'list_sql_warehouses',
          description: 'List available SQL warehouses',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        // Workspace Management Tools
        {
          name: 'create_notebook',
          description: 'Create a new notebook in the workspace',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Full path for the new notebook',
              },
              language: {
                type: 'string',
                description: 'Notebook language (PYTHON, SCALA, SQL, R)',
                default: 'PYTHON',
              },
              content: {
                type: 'string',
                description: 'Initial notebook content',
                default: '',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'delete_notebook',
          description: 'Delete a notebook from the workspace',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Full path to the notebook to delete',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'move_notebook',
          description: 'Move/rename a notebook in the workspace',
          inputSchema: {
            type: 'object',
            properties: {
              source_path: {
                type: 'string',
                description: 'Current notebook path',
              },
              dest_path: {
                type: 'string',
                description: 'New notebook path',
              },
            },
            required: ['source_path', 'dest_path'],
          },
        },
        // Library Management Tools
        {
          name: 'list_cluster_libraries',
          description: 'List libraries installed on a cluster',
          inputSchema: {
            type: 'object',
            properties: {
              cluster_id: {
                type: 'string',
                description: 'The cluster ID',
              },
            },
            required: ['cluster_id'],
          },
        },
        {
          name: 'install_library',
          description: 'Install a library on a cluster (PyPI, Maven, or JAR)',
          inputSchema: {
            type: 'object',
            properties: {
              cluster_id: {
                type: 'string',
                description: 'The cluster ID',
              },
              library_spec: {
                type: 'object',
                description: 'Library specification, e.g., {"pypi": {"package": "pandas==1.3.0"}}',
              },
            },
            required: ['cluster_id', 'library_spec'],
          },
        },
        // Export/Import Tools
        {
          name: 'export_notebook',
          description: 'Export/download a Databricks notebook to local filesystem. Supports SOURCE, JUPYTER, HTML, DBC formats.',
          inputSchema: {
            type: 'object',
            properties: {
              notebook_path: {
                type: 'string',
                description: 'Full path to the Databricks notebook',
              },
              local_path: {
                type: 'string',
                description: 'Local filesystem path to save the notebook',
              },
              format: {
                type: 'string',
                description: 'Export format: SOURCE (default), JUPYTER, HTML, or DBC',
                default: 'SOURCE',
              },
            },
            required: ['notebook_path', 'local_path'],
          },
        },
        {
          name: 'import_notebook',
          description: 'Import/upload a notebook to Databricks. AUTOMATICALLY creates a backup of existing notebook before overwriting. Creates new Databricks revision.',
          inputSchema: {
            type: 'object',
            properties: {
              local_path: {
                type: 'string',
                description: 'Local file path to import',
              },
              notebook_path: {
                type: 'string',
                description: 'Destination path in Databricks workspace',
              },
              language: {
                type: 'string',
                description: 'Notebook language: PYTHON (default), SCALA, SQL, or R',
                default: 'PYTHON',
              },
              create_backup: {
                type: 'boolean',
                description: 'Automatically backup existing notebook before import (default: true)',
                default: true,
              },
            },
            required: ['local_path', 'notebook_path'],
          },
        },
        {
          name: 'get_notebook_revisions',
          description: 'Get information about notebook revision history and how to access it in Databricks UI',
          inputSchema: {
            type: 'object',
            properties: {
              notebook_path: {
                type: 'string',
                description: 'Full path to the notebook',
              },
            },
            required: ['notebook_path'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_notebooks': {
            const path = args.path || '/';
            const results = await this.listWorkspaceItems(path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'get_notebook': {
            const results = await this.getNotebook(args.notebook_path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'list_clusters': {
            const results = await this.listClusters();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'list_jobs': {
            const results = await this.listJobs();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'get_job_details': {
            const results = await this.getJobDetails(args.job_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'run_notebook': {
            const results = await this.runNotebook(
              args.notebook_path,
              args.cluster_id,
              args.notebook_params || {}
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'get_run': {
            const results = await this.getRun(args.run_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'get_run_output': {
            const results = await this.getRunOutput(args.run_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'cancel_run': {
            const results = await this.cancelRun(args.run_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'list_runs': {
            const results = await this.listRuns(args.limit || 25);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // Cluster Management
          case 'start_cluster': {
            const results = await this.startCluster(args.cluster_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'stop_cluster': {
            const results = await this.stopCluster(args.cluster_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'get_cluster_status': {
            const results = await this.getClusterStatus(args.cluster_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'restart_cluster': {
            const results = await this.restartCluster(args.cluster_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // Job Operations
          case 'run_job': {
            const results = await this.runJob(args.job_id, args.notebook_params || {});
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'get_job_runs': {
            const results = await this.getJobRuns(args.job_id, args.limit || 25);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // DBFS Operations
          case 'list_dbfs': {
            const results = await this.listDbfs(args.path || '/');
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'read_dbfs_file': {
            const results = await this.readDbfsFile(args.path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'upload_to_dbfs': {
            const results = await this.uploadToDbfs(args.local_path, args.dbfs_path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'download_from_dbfs': {
            const results = await this.downloadFromDbfs(args.dbfs_path, args.local_path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // SQL Operations
          case 'execute_sql': {
            const results = await this.executeSql(args.warehouse_id, args.query);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'list_sql_warehouses': {
            const results = await this.listSqlWarehouses();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // Workspace Management
          case 'create_notebook': {
            const results = await this.createNotebook(
              args.path,
              args.language || 'PYTHON',
              args.content || ''
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'delete_notebook': {
            const results = await this.deleteNotebook(args.path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'move_notebook': {
            const results = await this.moveNotebook(args.source_path, args.dest_path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // Library Management
          case 'list_cluster_libraries': {
            const results = await this.listClusterLibraries(args.cluster_id);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'install_library': {
            const results = await this.installLibrary(args.cluster_id, args.library_spec);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // Export/Import Operations
          case 'export_notebook': {
            const results = await this.exportNotebook(
              args.notebook_path,
              args.local_path,
              args.format || 'SOURCE'
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'import_notebook': {
            const results = await this.importNotebook(
              args.local_path,
              args.notebook_path,
              args.language || 'PYTHON',
              args.create_backup !== false  // Default to true
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          case 'get_notebook_revisions': {
            const results = await this.getNotebookRevisions(args.notebook_path);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Databricks CLI MCP server running on stdio');
  }
}

// Start the server
const server = new DatabricksCLIMCPServer();
server.run().catch(console.error);

