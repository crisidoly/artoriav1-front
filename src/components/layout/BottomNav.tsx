"use client";

import { SidebarActivity } from "@/components/layout/SidebarActivity";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    AI_WORKFLOW_ITEMS,
    DEV_GIT_ITEMS,
    GOOGLE_ITEMS,
    MAIN_ITEMS,
    SETTINGS_ITEMS
} from "@/config/nav";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { Bot, ChevronDown, Database, Home, LayoutGrid, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// === MOBILE NAV ITEM ===
function MobileNavItem({ href, icon: Icon, label, activePath, onClick }: any) {
    const isActive = activePath === href;
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent",
                isActive
                    ? "bg-primary/10 text-primary-glow border-primary/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
        >
            <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
            {label}
        </Link>
    );
}

// === MOBILE NAV GROUP ===
function MobileNavGroup({ label, items, activePath, onItemClick }: any) {
    const [isOpen, setIsOpen] = useState(true); // Default open for mobile scrolling
    
    return (
        <div className="space-y-1">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-white/80 transition-colors"
            >
                {label}
                <ChevronDown className={cn("h-3 w-3 transition-transform", !isOpen && "-rotate-90")} />
            </button>
            
            {isOpen && (
                <div className="space-y-1">
                    {items.map((item: any) => (
                        <MobileNavItem 
                            key={item.href} 
                            {...item} 
                            activePath={activePath} 
                            onClick={onItemClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function BottomNav() {
    const pathname = usePathname();
    const { isSidebarOpen, setSidebarOpen } = useChatStore();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    // Check if we are in chat mode (interaction area open)
    const isChatActive = isSidebarOpen;

    const navItems = [
        { label: "Home", href: "/", icon: Home },
        { label: "Tools", href: "/tools", icon: Wrench },
        { label: "Chat", action: "chat", icon: Bot },
        { label: "Memory", href: "/memory", icon: Database },
        { label: "Menu", action: "menu", icon: LayoutGrid },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 z-50 lg:hidden pb-safe">
            <div className="grid grid-cols-5 h-full items-center justify-items-center">
                {navItems.map((item) => {
                    // Logic for active state
                    let isActive = false;
                    if (item.href) isActive = pathname === item.href;
                    if (item.action === 'chat') isActive = isChatActive;
                    if (item.action === 'menu') isActive = isSheetOpen;

                    const Icon = item.icon;

                    // === CHAT BUTTON ===
                    if (item.action === 'chat') {
                        return (
                            <button
                                key="chat"
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                                className="flex flex-col items-center justify-center gap-1 w-full h-full relative group"
                            >
                                <div className={cn(
                                    "p-1.5 rounded-full transition-all duration-300 transform group-active:scale-95",
                                    isActive
                                        ? "bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] -translate-y-4 border-4 border-[#09090b]"
                                        : "bg-white/5 text-muted-foreground"
                                )}>
                                    <img 
                                        src="/logopng.png" 
                                        alt="Chat" 
                                        className={cn("h-10 w-10 object-contain", isActive && "drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]")} 
                                    />
                                </div>
                            </button>
                        );
                    }

                    // === MENU BUTTON (SHEET) ===
                    if (item.action === 'menu') {
                        return (
                            <Sheet key="menu" open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        className="flex flex-col items-center justify-center gap-1 w-full h-full active:scale-95 transition-transform"
                                    >
                                        <Icon
                                            className={cn(
                                                "h-6 w-6 transition-colors",
                                                isActive || isSheetOpen ? "text-white" : "text-muted-foreground"
                                            )}
                                        />
                                        <span className={cn(
                                            "text-[10px] font-medium transition-colors",
                                            isActive || isSheetOpen ? "text-white" : "text-muted-foreground"
                                        )}>
                                            {item.label}
                                        </span>
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[85vh] p-0 bg-[#09090b]/95 backdrop-blur-2xl border-t border-primary/20 rounded-t-3xl">
                                    <div className="flex flex-col h-full">
                                        <SheetHeader className="p-6 pb-2 text-left border-b border-white/10">
                                            <SheetTitle className="flex items-center gap-3">
                                                 <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/30 shadow-lg">
                                                    <img src="/logo.jpg" alt="ArtorIA" className="w-full h-full object-cover" />
                                                 </div>
                                                 <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent font-bold text-xl">
                                                    ArtorIA Mobile
                                                 </span>
                                            </SheetTitle>
                                        </SheetHeader>
                                        
                                        <ScrollArea className="flex-1 px-4 py-6">
                                            <div className="space-y-6 pb-20">
                                                <MobileNavGroup 
                                                    label="Principal" 
                                                    items={MAIN_ITEMS} 
                                                    activePath={pathname}
                                                    onItemClick={() => setIsSheetOpen(false)}
                                                />
                                                
                                                <div className="h-px bg-white/5 mx-4" />
                                                
                                                <MobileNavGroup 
                                                    label="Google Workspace" 
                                                    items={GOOGLE_ITEMS} 
                                                    activePath={pathname}
                                                    onItemClick={() => setIsSheetOpen(false)}
                                                />
                                                
                                                <div className="h-px bg-white/5 mx-4" />
                                                
                                                <MobileNavGroup 
                                                    label="Sistema IA" 
                                                    items={AI_WORKFLOW_ITEMS} 
                                                    activePath={pathname}
                                                    onItemClick={() => setIsSheetOpen(false)}
                                                />

                                                <div className="h-px bg-white/5 mx-4" />

                                                <MobileNavGroup 
                                                    label="Configurações" 
                                                    items={SETTINGS_ITEMS} 
                                                    activePath={pathname}
                                                    onItemClick={() => setIsSheetOpen(false)}
                                                />

                                                 <div className="h-px bg-white/5 mx-4" />

                                                <MobileNavGroup 
                                                    label="Dev & Code" 
                                                    items={DEV_GIT_ITEMS} 
                                                    activePath={pathname}
                                                    onItemClick={() => setIsSheetOpen(false)}
                                                />

                                                <div className="pt-4 px-2">
                                                    <SidebarActivity />
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        );
                    }

                    // === REGULAR LINK ITEMS ===
                    return (
                        <Link
                            key={item.label}
                            href={item.href!}
                            className="flex flex-col items-center justify-center gap-1 w-full h-full active:scale-95 transition-transform"
                        >
                            <Icon
                                className={cn(
                                    "h-6 w-6 transition-colors",
                                    isActive ? "text-white" : "text-muted-foreground"
                                )}
                            />
                            <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isActive ? "text-white" : "text-muted-foreground"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
