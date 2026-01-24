
"use client";

import { RiskRadar } from "@/components/github/RiskRadar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { AlertCircle, ExternalLink, Github, Lock, RefreshCw, Search, ShieldCheck, Star, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    updated_at: string;
    private: boolean;
    default_branch: string;
    open_issues_count: number;
    owner: {
        login: string;
    }
}

interface AnalysisData {
    repository: any;
    branches: any[];
    recent_commits: any[];
    ready_for_rag: boolean;
}

export default function GithubPage() {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isConnected, setIsConnected] = useState(true);
    
    // Analysis State
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [selectedRepoForAnalysis, setSelectedRepoForAnalysis] = useState<Repository | null>(null);

    useEffect(() => {
        fetchRepos();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredRepos(repos);
        } else {
            setFilteredRepos(repos.filter(r => 
                r.name.toLowerCase().includes(search.toLowerCase()) || 
                r.description?.toLowerCase().includes(search.toLowerCase())
            ));
        }
    }, [search, repos]);

    const fetchRepos = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:3001/api/github/repositories", { withCredentials: true });
            if (res.data.success) {
                setRepos(res.data.data);
                setIsConnected(true);
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                setIsConnected(false);
            } else {
                toast.error("Failed to load repositories");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = () => {
        window.location.href = "http://localhost:3001/api/auth/github";
    };

    const handleAnalyze = async (repo: Repository) => {
        setSelectedRepoForAnalysis(repo);
        setAnalyzing(true);
        setAnalysisData(null);
        
        try {
            const res = await axios.get(`http://localhost:3001/api/github/repositories/${repo.owner.login}/${repo.name}/analyze`, { withCredentials: true });
            if (res.data.success) {
                setAnalysisData(res.data.data);
            }
        } catch (error) {
            toast.error("Analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    const getLanguageColor = (lang: string | null) => {
        if (!lang) return "bg-gray-500";
        const colors: Record<string, string> = {
            TypeScript: "bg-blue-500",
            JavaScript: "bg-yellow-400",
            Python: "bg-green-500",
            Java: "bg-orange-500",
            HTML: "bg-red-500",
            CSS: "bg-purple-500",
            Go: "bg-cyan-500",
            Rust: "bg-orange-700"
        };
        return colors[lang] || "bg-blue-400";
    };

    if (!isConnected && !loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
                <Github className="h-24 w-24 text-muted-foreground opacity-20" />
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">GitHub Not Connected</h1>
                    <p className="text-muted-foreground max-w-md">
                        Connect your GitHub account to access your repositories, enable automated code reviews, and sync DevOps workflows.
                    </p>
                </div>
                <Button onClick={handleConnect} size="lg" className="gap-2">
                    <Github className="h-5 w-5" />
                    Connect GitHub
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Github className="h-8 w-8 text-white" />
                        DEVOPS CENTER
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Active repositories and pipeline status.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                     <Button variant="outline" size="icon" onClick={fetchRepos} title="Refresh Repositories">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="relative w-64">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input 
                            placeholder="Search repos..." 
                            className="pl-9 bg-secondary/50 border-white/10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                         />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Repo List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                         <h2 className="text-xl font-semibold">Your Repositories</h2>
                         <Badge variant="outline" className="text-xs">{filteredRepos.length} found</Badge>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 w-full bg-secondary/30 animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : ( 
                        <div className="grid gap-3">
                            {filteredRepos.map(repo => (
                                <Card key={repo.id} className="group hover:border-primary/50 transition-colors bg-secondary/10 border-white/5">
                                    <div className="p-4 flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {repo.private ? <Lock className="h-3 w-3 text-amber-500" /> : <Unlock className="h-3 w-3 text-muted-foreground" />}
                                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:underline decoration-primary underline-offset-4">
                                                    {repo.name}
                                                </a>
                                                <Badge variant="secondary" className="text-[10px] h-5">{repo.default_branch}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                                                {repo.description || "No description provided."}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                                                    {repo.language || "Unknown"}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500" />
                                                    {repo.stargazers_count}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {repo.open_issues_count} issues
                                                </div>
                                                <div>Updated {new Date(repo.updated_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
                                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-3 w-3" />
                                                    View
                                                </a>
                                            </Button>
                                            
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" className="h-8 gap-1" onClick={() => handleAnalyze(repo)}>
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Analyze
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                                            Analysis: {repo.name}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Deep inspection of repository structure and activity.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    
                                                    {analyzing || !analysisData ? (
                                                        <div className="py-8 flex flex-col items-center justify-center space-y-4">
                                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                                            <p className="text-sm text-muted-foreground">Scanning repository...</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <Card className="bg-secondary/50">
                                                                    <CardHeader className="py-3">
                                                                        <CardTitle className="text-sm">Structure</CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="py-2 text-sm">
                                                                        <ul className="space-y-1">
                                                                            <li><strong>Default Branch:</strong> {analysisData.repository.default_branch}</li>
                                                                            <li><strong>Size:</strong> {(analysisData.repository.size / 1024).toFixed(1)} MB</li>
                                                                            <li><strong>Issues:</strong> {analysisData.repository.open_issues_count}</li>
                                                                        </ul>
                                                                    </CardContent>
                                                                </Card>
                                                                <Card className="bg-secondary/50">
                                                                    <CardHeader className="py-3">
                                                                        <CardTitle className="text-sm">RAG Readiness</CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="py-2 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`h-2 w-2 rounded-full ${analysisData.ready_for_rag ? 'bg-green-500' : 'bg-red-500'}`} />
                                                                            <span>{analysisData.ready_for_rag ? "Ready" : "Not Optimized"}</span>
                                                                        </div>
                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                            Repo can be indexed for semantic search.
                                                                        </p>
                                                                    </CardContent>
                                                                </Card>
                                                            </div>

                                                            <div>
                                                                <h3 className="font-semibold mb-2 text-sm">Recent Activity</h3>
                                                                <ScrollArea className="h-[200px] border rounded-md p-2">
                                                                    <div className="space-y-2">
                                                                        {analysisData.recent_commits.map((commit: any) => (
                                                                            <div key={commit.sha} className="text-sm p-2 bg-secondary/20 rounded hover:bg-secondary/40 transition-colors">
                                                                                <div className="flex justify-between items-start mb-1">
                                                                                    <span className="font-mono text-xs text-muted-foreground">{commit.sha.substring(0, 7)}</span>
                                                                                    <span className="text-xs text-muted-foreground">
                                                                                        {new Date(commit.commit.author.date).toLocaleDateString()}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="line-clamp-2">{commit.commit.message}</p>
                                                                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                                                    by <strong>{commit.commit.author.name}</strong>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </ScrollArea>
                                                            </div>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar (RiskRadar) */}
                <div className="space-y-6">
                    <RiskRadar />
                </div>
            </div>
        </div>
    );
}
