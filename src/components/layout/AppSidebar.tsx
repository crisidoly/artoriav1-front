"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
    Bell,
    Bot,
    ChevronDown,
    ChevronRight,
    Code2,
    Globe,
    Shield,
    Terminal,
    Wrench
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarActivity } from "./SidebarActivity";

// === NAV GROUP WITH DROPDOWN ===
function NavGroup({ 
  icon: Icon, 
  label, 
  items, 
  activePath,
  isOpen,
  onToggle
}: { 
  icon: any; 
  label: string; 
  items: { label: string; href: string; icon: any }[]; 
  activePath: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasActiveChild = items.some(i => activePath === i.href);

  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/5",
          hasActiveChild ? "text-primary-glow" : "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("h-4 w-4", hasActiveChild ? "text-primary-glow" : "text-muted-foreground")} />
          <span>{label}</span>
        </div>
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="ml-4 pl-2 border-l border-white/10 space-y-1 animate-accordion-down overflow-hidden">
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
                  isActive
                    ? "text-primary-glow bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <ItemIcon className="h-3 w-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// === NAV ITEM (SINGLE) ===
function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  activePath,
  isCollapsed 
}: { 
  href: string; 
  icon: any; 
  label: string; 
  activePath: string;
  isCollapsed: boolean;
}) {
  const isActive = activePath === href;
  
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
        isCollapsed ? "justify-center px-2" : "px-3",
        isActive
          ? "text-primary-glow bg-primary/10"
          : "text-muted-foreground hover:text-white hover:bg-white/5"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary shadow-[0_0_10px_#8b5cf6]" />
      )}
      <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]")} />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

import {
    AI_WORKFLOW_ITEMS,
    DEV_GIT_ITEMS,
    GOOGLE_ITEMS,
    MAIN_ITEMS,
    SETTINGS_ITEMS
} from "@/config/nav";

// === MOCK NOTIFICATIONS (Keep here for now or move to store/config if needed) ===
const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Novo Lead Identificado", desc: "Acme Corp demonstrou interesse.", time: "2m atrás", type: "crm", read: false },
  { id: 2, title: "Deploy com Sucesso", desc: "v2.0.1 está online em produção.", time: "1h atrás", type: "dev", read: false },
  { id: 3, title: "Sarah enviou mensagem", desc: "Podemos revisar os designs?", time: "3h atrás", type: "chat", read: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/auth/')) return null;

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, connectIntegration } = useAuth();

  // State for exclusive accordion behavior
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (groupLabel: string) => {
    setOpenGroup(prev => prev === groupLabel ? null : groupLabel);
  };

  return (
    <>
      {/* Mobile Toggle Removed - Replaced by BottomNav */}

      {/* Sidebar Container - Desktop Only */}
      <aside
        className={cn(
          "hidden lg:block w-64 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 z-40 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-full flex flex-col relative">
          {/* Collapse Toggle (Desktop Only) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex absolute -right-3 top-6 h-6 w-6 rounded-full bg-primary border border-white/10 shadow-md z-50 hover:bg-primary/90 text-white"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronRight className={cn("h-3 w-3 transition-transform", !isCollapsed && "rotate-180")} />
          </Button>

          {/* Header */}
          <div className={cn(
            "h-16 flex items-center border-b border-white/5 transition-all overflow-hidden",
            isCollapsed ? "justify-center px-0" : "px-6"
          )}>
            {isCollapsed ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/30 shadow-lg">
                <img src="/logo.jpg" alt="ArtorIA" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/30 shadow-lg">
                    <img src="/logo.jpg" alt="ArtorIA" className="w-full h-full object-cover" />
                 </div>
                 <h1 className="text-xl font-bold tracking-wider text-primary-glow whitespace-nowrap">
                   ArtorIA <span className="text-xs text-muted-foreground ml-1">v2.0</span>
                 </h1>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 py-6 space-y-1 overflow-y-auto scrollbar-hide px-3">
            
            {/* Main Items */}
            {MAIN_ITEMS.map(item => (
              <NavItem 
                key={item.href}
                {...item}
                activePath={pathname}
                isCollapsed={isCollapsed}
              />
            ))}

            <div className="my-2 border-t border-white/5 mx-2" />

            {/* Groups (only when not collapsed) */}
            {!isCollapsed ? (
              <>
                {/* === GOOGLE WORKSPACE === */}
                {user?.integrations?.google ? (
                  <NavGroup
                    icon={Globe}
                    label="Google Workspace"
                    items={GOOGLE_ITEMS}
                    activePath={pathname}
                    isOpen={openGroup === "Google Workspace"}
                    onToggle={() => toggleGroup("Google Workspace")}
                  />
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-white/5 hover:text-white group">
                        <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary-glow" />
                        <span>Conectar ao Google</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border-white/10 bg-card/90 backdrop-blur-xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-primary-glow">
                          Conectar Google Workspace
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Conecte sua conta do Google para acessar emails, calendário e Drive.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => connectIntegration('google')}
                        >
                          Conectar Agora
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <div className="my-2 border-t border-white/5 mx-2" />
                <NavGroup
                  icon={Code2}
                  label="Dev & Code"
                  items={DEV_GIT_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Dev & Code"}
                  onToggle={() => toggleGroup("Dev & Code")}
                />

                <div className="my-2 border-t border-white/5 mx-2" />

                {/* === AI SYSTEM === */}
                <NavGroup
                  icon={Bot}
                  label="Sistema IA"
                  items={AI_WORKFLOW_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Sistema IA"}
                  onToggle={() => toggleGroup("Sistema IA")}
                />

                <NavGroup
                  icon={Shield}
                  label="Configurações"
                  items={SETTINGS_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Configurações"}
                  onToggle={() => toggleGroup("Configurações")}
                />
              </>
            ) : (
              /* Collapsed Icons (UPDATED) */
              <div className="space-y-2 flex flex-col items-center">
                <Link href="/studio" title="Studio" className="p-2 text-muted-foreground hover:bg-white/5 rounded">
                  <Wrench className="h-4 w-4" /> 
                </Link>
                <Link href="/code" title="Código" className="p-2 text-muted-foreground hover:bg-white/5 rounded">
                  <Terminal className="h-4 w-4" />
                </Link>
                <Link href="/admin" title="Admin" className="p-2 text-muted-foreground hover:bg-white/5 rounded">
                  <Shield className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
          
          {/* AI Activity Status */}
          {!isCollapsed && <SidebarActivity />}

          {/* Footer with Notifications */}
          <div className="p-4 border-t border-white/5">
            <Popover>
              <PopoverTrigger asChild>
                <div className={cn(
                  "flex items-center gap-3 p-2 rounded-md bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors relative group",
                  isCollapsed && "justify-center p-0 bg-transparent"
                )}>
                   {/* Unread Indicator */}
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#09090b] z-10" />
                   
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent-cyan shrink-0 flex items-center justify-center text-xs font-bold text-white">
                     {user?.name?.[0] || 'U'}
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{user?.name || 'Usuário'}</p>
                      <p className="text-xs text-muted-foreground truncate">Ver Notificações</p>
                    </div>
                  )}
                  {!isCollapsed && <Bell className="h-4 w-4 text-muted-foreground group-hover:text-white" />}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 mb-2 bg-[#18181b] border-white/10 text-white" side="top" align="start">
                 <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Notificações</h4>
                    <span className="text-xs text-primary-glow cursor-pointer hover:underline">Marcar todas como lidas</span>
                 </div>
                 <ScrollArea className="h-64">
                    <div className="flex flex-col">
                       {MOCK_NOTIFICATIONS.map(n => (
                          <div key={n.id} className={cn(
                             "p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex gap-3",
                             !n.read && "bg-primary/5"
                          )}>
                             <div className={cn(
                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                !n.read ? "bg-primary-glow" : "bg-transparent"
                             )} />
                             <div>
                                <h5 className={cn("text-sm", !n.read ? "font-bold text-white" : "font-medium text-muted-foreground")}>{n.title}</h5>
                                <p className="text-xs text-muted-foreground">{n.desc}</p>
                                <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </ScrollArea>
                 <div className="p-2 border-t border-white/10 text-center">
                    <Link href="/notifications" className="text-xs text-muted-foreground hover:text-white transition-colors">
                       Ver Histórico
                    </Link>
                 </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
