/**
 * Node.js Sandbox API Client
 * Connects to Docker container at localhost:5001
 */

import axios from 'axios';

const SANDBOX_URL = process.env.NEXT_PUBLIC_SANDBOX_URL || 'http://localhost:5001';

const sandboxApi = axios.create({
  baseURL: SANDBOX_URL,
  timeout: 120000, // 2 minutes for npm operations
});

export interface SandboxProject {
  id: string;
  name: string;
  type: string;
  files: string[];
  createdAt: string;
  isServing: boolean;
}

export interface SandboxFile {
  path: string;
  content: string;
  size?: number;
}

export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

// === PROJECT OPERATIONS ===

export async function listProjects(): Promise<SandboxProject[]> {
  const { data } = await sandboxApi.get('/projects');
  return data.projects;
}

export async function createProject(
  files: SandboxFile[],
  name?: string,
  projectType: string = 'static'
): Promise<{ projectId: string; files: string[] }> {
  const { data } = await sandboxApi.post('/project/create', {
    files,
    name,
    projectType,
  });
  return data;
}

export async function getProjectFiles(projectId: string): Promise<SandboxFile[]> {
  const { data } = await sandboxApi.get(`/project/${projectId}/files`);
  return data.files;
}

export async function addProjectFiles(
  projectId: string,
  files: SandboxFile[]
): Promise<void> {
  await sandboxApi.post(`/project/${projectId}/files`, { files });
}

export async function deleteProject(projectId: string): Promise<void> {
  await sandboxApi.delete(`/project/${projectId}`);
}

// === EXECUTION OPERATIONS ===

export async function runCommand(
  projectId: string,
  command: string
): Promise<CommandResult> {
  const { data } = await sandboxApi.post(`/project/${projectId}/run`, { command });
  return data;
}

export async function npmInstall(
  projectId: string,
  packages: string[] = []
): Promise<CommandResult> {
  const { data } = await sandboxApi.post(`/project/${projectId}/npm/install`, { packages });
  return data;
}

export async function buildProject(
  projectId: string,
  script: string = 'build'
): Promise<CommandResult> {
  const { data } = await sandboxApi.post(`/project/${projectId}/build`, { script });
  return data;
}

export async function testProject(projectId: string): Promise<CommandResult & { passed: boolean }> {
  const { data } = await sandboxApi.post(`/project/${projectId}/test`);
  return data;
}

// === PREVIEW OPERATIONS ===

export async function serveProject(
  projectId: string,
  port: number = 3000,
  directory: string = '.'
): Promise<{ url: string; port: number }> {
  const { data } = await sandboxApi.post(`/project/${projectId}/serve`, { port, directory });
  return { url: data.url, port };
}

export async function createHtmlPreview(
  html: string,
  css?: string,
  js?: string
): Promise<{ previewId: string; html: string }> {
  const { data } = await sandboxApi.post('/preview/html', { html, css, js });
  return data;
}

// === HEALTH CHECK ===

export async function checkSandboxHealth(): Promise<boolean> {
  try {
    const { data } = await sandboxApi.get('/health');
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

export { sandboxApi };
