"use client";

import { AIChatSidebar } from "@/components/code/AIChatSidebar";
import { DiffViewer } from "@/components/code/DiffViewer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import * as sandbox from "@/lib/sandbox";
import { cn } from "@/lib/utils";
import {
    Code2,
    ExternalLink,
    File,
    FileCode,
    Folder,
    Loader2,
    Package,
    Play,
    Plus,
    Save,
    Sparkles,
    Terminal,
    Trash2,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectFile {
  path: string;
  content: string;
  size?: number;
}

interface Project {
  id: string;
  name: string;
  type: string;
  files: string[];
  createdAt: string;
  isServing: boolean;
}

interface FileTreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileTreeNode[];
}

export default function CodePage() {
  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  
  // Editor state
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [openFiles, setOpenFiles] = useState<ProjectFile[]>([]);
  const [showAi, setShowAi] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  
  // Terminal state
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  
  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [sandboxConnected, setSandboxConnected] = useState(false);

  // Check sandbox health and load projects on mount
  useEffect(() => {
    async function init() {
      try {
        const healthy = await sandbox.checkSandboxHealth();
        setSandboxConnected(healthy);
        
        if (healthy) {
          const projectList = await sandbox.listProjects();
          setProjects(projectList);
        }
      } catch (err) {
        console.error('Sandbox init error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Build file tree from flat file list
  const buildFileTree = (files: ProjectFile[]): FileTreeNode[] => {
    const root: FileTreeNode[] = [];
    
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = root;
      
      parts.forEach((part, i) => {
        const isLast = i === parts.length - 1;
        let node = current.find(n => n.name === part);
        
        if (!node) {
          node = {
            name: part,
            path: parts.slice(0, i + 1).join('/'),
            isDir: !isLast,
            children: isLast ? undefined : []
          };
          current.push(node);
        }
        
        if (!isLast && node.children) {
          current = node.children;
        }
      });
    });
    
    return root;
  };

  // Load project files
  const loadProjectFiles = async (projectId: string) => {
    try {
      const files = await sandbox.getProjectFiles(projectId);
      setProjectFiles(files);
      setFileTree(buildFileTree(files));
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  // Select a project
  const selectProject = async (project: Project) => {
    setActiveProject(project);
    setActiveFile(null);
    setOpenFiles([]);
    setEditorContent("");
    setOutput("");
    await loadProjectFiles(project.id);
  };

  // Open a file
  const openFile = (file: ProjectFile) => {
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
    setEditorContent(file.content);
  };

  // Close a file tab
  const closeFile = (filePath: string) => {
    const newFiles = openFiles.filter(f => f.path !== filePath);
    setOpenFiles(newFiles);
    if (activeFile?.path === filePath) {
      if (newFiles.length > 0) {
        setActiveFile(newFiles[newFiles.length - 1]);
        setEditorContent(newFiles[newFiles.length - 1].content);
      } else {
        setActiveFile(null);
        setEditorContent("");
      }
    }
  };

  // Save current file
  const saveFile = async () => {
    if (!activeProject || !activeFile) return;
    
    try {
      await sandbox.addProjectFiles(activeProject.id, [{
        path: activeFile.path,
        content: editorContent
      }]);
      
      // Update local state
      setProjectFiles(prev => prev.map(f => 
        f.path === activeFile.path ? { ...f, content: editorContent } : f
      ));
      setActiveFile({ ...activeFile, content: editorContent });
      
      setOutput(prev => prev + `\n✅ Saved: ${activeFile.path}`);
    } catch (err: any) {
      setOutput(prev => prev + `\n❌ Error saving: ${err.message}`);
    }
  };

  // Run npm install
  const runNpmInstall = async () => {
    if (!activeProject) return;
    setIsRunning(true);
    setOutput(prev => prev + '\n📦 Running npm install...');
    
    try {
      const result = await sandbox.npmInstall(activeProject.id);
      setOutput(prev => prev + `\n${result.stdout}\n${result.stderr}`);
    } catch (err: any) {
      setOutput(prev => prev + `\n❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Build project
  const runBuild = async () => {
    if (!activeProject) return;
    setIsRunning(true);
    setOutput(prev => prev + '\n🔨 Building project...');
    
    try {
      const result = await sandbox.buildProject(activeProject.id);
      setOutput(prev => prev + `\n${result.stdout}\n${result.stderr}`);
    } catch (err: any) {
      setOutput(prev => prev + `\n❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Start preview server
  const startPreview = async () => {
    if (!activeProject) return;
    setIsRunning(true);
    setOutput(prev => prev + '\n🚀 Starting preview server...');
    
    try {
      // Use a random port between 3100-3199
      const port = 3100 + Math.floor(Math.random() * 100);
      const result = await sandbox.serveProject(activeProject.id, port);
      setPreviewUrl(`http://localhost:${port}`);
      setOutput(prev => prev + `\n✅ Preview available at: http://localhost:${port}`);
    } catch (err: any) {
      setOutput(prev => prev + `\n❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Create new project
  const createNewProject = async () => {
    const name = prompt('Nome do projeto:');
    if (!name) return;
    
    try {
      const result = await sandbox.createProject([
        { path: 'index.html', content: `<!DOCTYPE html>\n<html>\n<head>\n  <title>${name}</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello ${name}!</h1>\n  <script src="script.js"></script>\n</body>\n</html>` },
        { path: 'style.css', content: `body {\n  font-family: Arial, sans-serif;\n  padding: 2rem;\n}` },
        { path: 'script.js', content: `console.log('Hello from ${name}!');` }
      ], name, 'static');
      
      // Refresh project list
      const projectList = await sandbox.listProjects();
      setProjects(projectList);
      
      // Select the new project
      const newProject = projectList.find(p => p.id === result.projectId);
      if (newProject) {
        await selectProject(newProject);
      }
      
      setOutput(`✅ Project "${name}" created!`);
    } catch (err: any) {
      setOutput(`❌ Error creating project: ${err.message}`);
    }
  };

  // Delete project
  const deleteProject = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    try {
      await sandbox.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (activeProject?.id === projectId) {
        setActiveProject(null);
        setProjectFiles([]);
        setOpenFiles([]);
      }
      setOutput(prev => prev + '\n🗑️ Project deleted');
    } catch (err: any) {
      setOutput(prev => prev + `\n❌ Error: ${err.message}`);
    }
  };

  // Get file icon
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.html')) return <File className="h-4 w-4 text-orange-400" />;
    if (filename.endsWith('.css')) return <File className="h-4 w-4 text-blue-400" />;
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return <FileCode className="h-4 w-4 text-yellow-400" />;
    if (filename.endsWith('.json')) return <File className="h-4 w-4 text-green-400" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  // Render file tree
  const renderFileTree = (nodes: FileTreeNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.path}>
        <button
          onClick={() => {
            if (!node.isDir) {
              const file = projectFiles.find(f => f.path === node.path);
              if (file) openFile(file);
            }
          }}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1 text-sm rounded hover:bg-white/5 text-left",
            activeFile?.path === node.path && "bg-primary/20 text-primary-glow"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.isDir ? (
            <Folder className="h-4 w-4 text-yellow-400" />
          ) : (
            getFileIcon(node.name)
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {node.isDir && node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Conectando ao sandbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full relative">
      {/* Diff Viewer Overlay */}
      {showDiff && activeFile && (
          <DiffViewer 
            original={activeFile.content}
            modified={editorContent}
            onClose={() => setShowDiff(false)}
          />
      )}

      {/* Projects Sidebar */}
      <div className="w-56 border-r border-border bg-card/50 flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-primary-glow">Projetos</h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={createNewProject}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-2">
          {projects.length > 0 ? projects.map(project => (
            <div
              key={project.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-md cursor-pointer group",
                activeProject?.id === project.id ? "bg-primary/20" : "hover:bg-white/5"
              )}
              onClick={() => selectProject(project)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Package className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm truncate">{project.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 text-red-400"
                onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Nenhum projeto ainda
            </p>
          )}
        </ScrollArea>
      </div>

      {/* File Explorer */}
      {activeProject && (
        <div className="w-48 border-r border-border bg-card/30 flex flex-col">
          <div className="p-3 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">
              {activeProject.name}
            </h3>
          </div>
          <ScrollArea className="flex-1 p-2">
            {renderFileTree(fileTree)}
          </ScrollArea>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative">
        {/* File Tabs */}
        {openFiles.length > 0 && (
          <div className="h-9 border-b border-border flex items-center bg-card/30 overflow-x-auto justify-between pr-4">
            <div className="flex items-center h-full">
                {openFiles.map(file => (
                <div
                    key={file.path}
                    onClick={() => { setActiveFile(file); setEditorContent(file.content); }}
                    className={cn(
                    "flex items-center gap-2 px-3 py-1.5 border-r border-border cursor-pointer text-sm group h-full",
                    activeFile?.path === file.path ? "bg-card text-white" : "text-muted-foreground hover:text-white"
                    )}
                >
                    {getFileIcon(file.path.split('/').pop() || '')}
                    <span>{file.path.split('/').pop()}</span>
                    <button
                    onClick={(e) => { e.stopPropagation(); closeFile(file.path); }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                    >
                    <X className="h-3 w-3" />
                    </button>
                </div>
                ))}
            </div>
            
            {/* AI Toggle */}
            <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 gap-2", showAi && "text-purple-400 bg-purple-500/10")}
                onClick={() => setShowAi(!showAi)}
            >
                <Sparkles className="h-3 w-3" />
                AI Assist
            </Button>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 relative flex">
          <div className="flex-1 relative">
            {activeFile ? (
                <Textarea
                value={editorContent}
                onChange={e => setEditorContent(e.target.value)}
                className="absolute inset-0 font-mono text-sm bg-[#1e1e2e] border-0 resize-none p-4 text-green-400 focus-visible:ring-0 rounded-none"
                spellCheck={false}
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-slate-950/50">
                <div className="p-8 rounded-full bg-secondary/20 mb-4 animate-pulse">
                    <Code2 className="h-12 w-12 opacity-20" />
                </div>
                <p className="text-sm font-medium">Nenhum artefato ativo</p>
                <p className="text-xs opacity-50">Gere um componente ou código para visualizar aqui</p>
                </div>
            )}
          </div>
          
          {/* AI SIDEBAR OVERLAY */}
          {showAi && <AIChatSidebar onClose={() => setShowAi(false)} />}
        </div>

        {/* Toolbar */}
        <div className="h-12 border-t border-border flex items-center justify-between px-4 bg-card/50">
          <div className="flex items-center gap-2">
            {activeFile && (
              <span className="text-xs text-muted-foreground font-mono">
                {activeFile.path}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFile && (
                <Button variant="ghost" size="sm" onClick={() => setShowDiff(true)}>
                    Diff View
                </Button>
            )}
            <Button variant="ghost" size="sm" onClick={saveFile} disabled={!activeFile}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button variant="ghost" size="sm" onClick={runNpmInstall} disabled={!activeProject || isRunning}>
              <Package className="h-4 w-4 mr-2" />
              npm install
            </Button>
            <Button variant="ghost" size="sm" onClick={runBuild} disabled={!activeProject || isRunning}>
              <Terminal className="h-4 w-4 mr-2" />
              Build
            </Button>
            <Button 
              onClick={startPreview} 
              disabled={!activeProject || isRunning}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Preview
            </Button>
            {previewUrl && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir
              </Button>
            )}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="h-40 border-t border-border bg-[#0d0d14]">
          <div className="h-8 border-b border-border flex items-center px-4 bg-card/30">
            <Terminal className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium">Terminal</span>
          </div>
          <ScrollArea className="h-32 p-4">
            <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">
              {output || '$ Ready...'}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
