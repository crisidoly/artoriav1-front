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
    Bot,
    ChevronDown,
    ChevronRight,
    Code2,
    Globe,
    LogOut,
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


export function AppSidebar() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/auth/')) return null;

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, connectIntegration, logout } = useAuth();

  // State for exclusive accordion behavior
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (groupLabel: string) => {
    setOpenGroup(prev => prev === groupLabel ? null : groupLabel);
  };

  // Mock Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Novo Lead Identificado", desc: "Acme Corp demonstrou interesse.", time: "2m atrás", type: "crm", read: false },
    { id: 2, title: "Deploy com Sucesso", desc: "v2.0.1 está online em produção.", time: "1h atrás", type: "dev", read: false },
    { id: 3, title: "Sarah enviou mensagem", desc: "Podemos revisar os designs?", time: "3h atrás", type: "chat", read: true },
  ]);

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: !n.read } : n
    ));
  };
  
  const hasUnread = notifications.some(n => !n.read);

  return (
    <>
      {/* Sidebar Container - Desktop Only */}
      <aside
        className={cn(
          "hidden lg:block w-64 h-full bg-[#09090b] border-r border-white/10 z-40 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-full flex flex-col relative">
          
          {/* Global Ambient Glow (Bleeds into page) */}
          <div className={cn(
             "fixed top-0 left-0 w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none transition-opacity duration-1000 -translate-x-1/2 -translate-y-1/2 z-0",
             hasUnread ? "opacity-100" : "opacity-0"
          )} />
          
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
          <Popover>
            <PopoverTrigger asChild>
              <div 
                className={cn(
                  "flex items-center border-b border-white/5 transition-all overflow-hidden cursor-pointer relative group",
                  isCollapsed ? "h-24 justify-center px-0" : "h-48 justify-center"
                )}
              >
                {/* Dynamic Background Glow - FIRE EFFECT */}
                <div className={cn(
                  "absolute inset-0 rounded-full transition-all duration-500 pointer-events-none",
                  hasUnread
                    ? "opacity-100" // Visible (Fire Effect)
                    : "bg-purple-600/20 blur-3xl opacity-40" // Resting state: Static, weak glow
                )}>
                   {/* Fire layers - Only render if active */}
                   {hasUnread && (
                      <>
                        <div className="absolute inset-0 bg-purple-900/40 blur-[50px] animate-pulse-slow" /> 
                        <div className="absolute inset-0 bg-purple-600/20 blur-[30px] animate-flicker mix-blend-screen" />
                        <div className="absolute bottom-0 left-1/4 right-1/4 h-24 bg-purple-500/10 blur-[20px] animate-fire-rise rounded-t-full" />
                        
                        {/* Custom Styles for Fire Animation */}
                        <style jsx>{`
                          @keyframes flicker {
                            0%, 100% { opacity: 0.3; transform: scale(1); }
                            25% { opacity: 0.5; transform: scale(1.02); }
                            50% { opacity: 0.25; transform: scale(0.98); }
                            75% { opacity: 0.4; transform: scale(1.01); }
                          }
                          @keyframes fire-rise {
                             0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; }
                             50% { transform: translateY(-10px) scale(1.1); opacity: 0.3; }
                          }
                          .animate-flicker { animation: flicker 4s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
                          .animate-fire-rise { animation: fire-rise 3s infinite ease-in-out; }
                          .animate-pulse-slow { animation: pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                        `}</style>
                      </>
                   )}
                </div>

                {isCollapsed ? (
                  <div className="h-16 w-16 flex items-center justify-center relative z-10 transition-all duration-300">
                    <img 
                      src={hasUnread ? "/logoacessopng.png" : "/logopng.png"} 
                      alt="ArtorIA" 
                      className="w-full h-full object-contain scale-110" 
                    />
                    {/* Collapsed Indicator: Dot */}
                    {hasUnread && <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]" />}
                  </div>
                ) : (
                   <div className="h-40 w-40 flex items-center justify-center relative z-10 transition-all duration-300">
                      <img 
                        src={hasUnread ? "/logoacessopng.png" : "/logopng.png"} 
                        alt="ArtorIA" 
                        className="w-full h-full object-contain scale-125 translate-y-2" 
                      />
                   </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mb-2 bg-[#18181b] border-white/10 text-white ml-2" side="bottom" align="center">
                 <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Notificações</h4>
                    <span 
                        className="text-xs text-primary-glow cursor-pointer hover:underline"
                        onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    >
                        Marcar todas como lidas
                    </span>
                 </div>
                 <ScrollArea className="h-64">
                    <div className="flex flex-col">
                       {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => toggleRead(n.id)} // Toggle read status on click
                            className={cn(
                             "p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex gap-3",
                             !n.read && "bg-primary/5"
                          )}>
                             <div className={cn(
                                "w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors",
                                !n.read ? "bg-primary-glow" : "bg-white/10"
                             )} />
                             <div>
                                <h5 className={cn("text-sm transition-colors", !n.read ? "font-bold text-white" : "font-medium text-muted-foreground")}>{n.title}</h5>
                                <p className="text-xs text-muted-foreground">{n.desc}</p>
                                <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </ScrollArea>
                 <div className="p-2 border-t border-white/10 text-center">
                    <p className="text-[10px] text-zinc-500 mb-1">Clique para alternar lido/não lido</p> 
                    <Link href="/notifications" className="text-xs text-muted-foreground hover:text-white transition-colors">
                       Ver Histórico
                    </Link>
                 </div>
            </PopoverContent>
          </Popover>

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

          {/* Footer (User & Logout) */}
          <div className="p-4 border-t border-white/5 space-y-4">
            
            {/* User Profile */}
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent-cyan shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-900/20">
                    {user?.name?.[0] || 'U'}
                </div>
                {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'ArtorIA User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@artoria.ai'}</p>
                    </div>
                )}
            </div>

            {/* Logout Button */}
            {!isCollapsed ? (
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium h-9"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Encerrar Sessão
                </Button>
            ) : (
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8"
                    onClick={logout}
                    title="Sair"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            )}
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
