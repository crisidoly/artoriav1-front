"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { NODE_CATEGORIES, NODE_DEFINITIONS } from "./node-definitions";

export function NodeLibrary() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const allNodes = Object.values(NODE_DEFINITIONS);

    const filteredNodes = allNodes.filter(def => {
        const matchesSearch = def.label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory 
            ? def.category === activeCategory
            : true;
        return matchesSearch && matchesCategory;
    });

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="flex flex-col h-full bg-black/20 border-r border-white/10 w-64 backdrop-blur-md">
            
            {/* Search */}
            <div className="p-4 border-b border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        className="w-full bg-white/5 border border-white/10 rounded-full h-9 pl-9 pr-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
                        placeholder="Search nodes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1 p-2 overflow-x-auto scrollbar-hide border-b border-white/5">
                <button 
                    onClick={() => setActiveCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${!activeCategory ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                >
                    All
                </button>
                {NODE_CATEGORIES.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
                {filteredNodes.map(def => (
                    <div 
                        key={def.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, def.type)}
                        className="group flex flex-col p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:shadow-purple-900/10"
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className={`p-1.5 rounded bg-black/30 text-muted-foreground group-hover:text-purple-400 transition-colors`}>
                                <def.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-white truncate w-40" title={def.label}>{def.label}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground pl-[34px] line-clamp-2">{def.description}</p>
                    </div>
                ))}
            </div>
            
            <div className="p-3 border-t border-white/10 text-center">
                 <p className="text-[10px] text-muted-foreground">Drag nodes to canvas</p>
            </div>
        </div>
    );
}
