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
  BarChart3,
  Bell,
  Bot,
  Brain,
  Briefcase,
  Calculator,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Code2,
  DollarSign,
  Figma as FigmaIcon,
  FileSearch,
  FileText,
  Github,
  Globe,
  GraduationCap,
  HardDrive,
  Hash,
  Headset,
  HeartPulse,
  Image as ImageIcon,
  Layout,
  LayoutDashboard,
  Link2,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Music,
  Network,
  Palette,
  Scale,
  Send,
  Settings,
  Shield,
  TableProperties,
  Target,
  Terminal,
  Truck,
  Users,
  Wifi,
  Wrench,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

// === MENU STRUCTURE ===
const MAIN_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Ferramentas", href: "/tools", icon: Wrench },
  { label: "Automações", href: "/plans", icon: Network }, // Moved and Renamed
];

const GOOGLE_ITEMS = [
  { label: "Gmail", href: "/google/gmail", icon: Mail },
  { label: "Agenda", href: "/google/calendar", icon: Calendar },
  { label: "Tarefas", href: "/google/tasks", icon: CheckSquare },
  { label: "Drive", href: "/google/drive", icon: HardDrive },
  { label: "Planilhas", href: "/google/sheets", icon: TableProperties },
  { label: "Documentos", href: "/google/docs", icon: FileText },
];

const DESIGN_SUITE_ITEMS = [
  { label: "Figma", href: "/design/figma", icon: FigmaIcon },
  { label: "Canva", href: "/design/canva", icon: Palette },
  { label: "Gerador de Imagens", href: "/images", icon: ImageIcon },
  { label: "Content Studio", href: "/studio", icon: Clapperboard },
  { label: "Process Flow", href: "/process", icon: Network },
];

const DEV_GIT_ITEMS = [
  { label: "Code Playground", href: "/code", icon: Terminal },
  { label: "Remote Sandbox", href: "/sandbox", icon: Terminal },
  { label: "GitHub", href: "/github", icon: Github },
];

const WORKSPACE_ITEMS = [
  { label: "Notion", href: "/notion", icon: FileText },
  { label: "Trello", href: "/trello", icon: Layout },
  { label: "Slack", href: "/slack", icon: Hash },
];

const MEDIA_ITEMS = [
  { label: "Spotify", href: "/spotify", icon: Music },
];

const COMMUNICATION_ITEMS = [
  { label: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
  { label: "Discord", href: "/discord", icon: MessageSquare },
  { label: "Telegram", href: "/telegram", icon: Send },
];

const MICROSOFT_ITEMS = [
  { label: "Outlook", href: "/microsoft/outlook", icon: Mail },
  { label: "Teams", href: "/microsoft/teams", icon: MessageSquare },
  { label: "OneDrive", href: "/microsoft/onedrive", icon: HardDrive },
];

const BUSINESS_ITEMS = [
  { label: "Finance HQ", href: "/finance", icon: DollarSign },
  { label: "Controle Gastos", href: "/finance/expenses", icon: Calculator },
  { label: "Marketing", href: "/marketing", icon: Megaphone },
  { label: "CRM Sales", href: "/crm", icon: Target },
];

const PRO_ITEMS = [
  { label: "Investigação", href: "/investigation", icon: FileSearch },
  { label: "Legal Hub", href: "/legal", icon: Scale },
  { label: "Recrutamento", href: "/hr", icon: Users },
  { label: "Logística", href: "/logistics", icon: Truck },
];

const OPS_ITEMS = [
  { label: "Smart Home", href: "/iot", icon: Wifi },
  { label: "Voice Ops", href: "/voice-ops", icon: Headset },
  { label: "Bio-Health", href: "/health", icon: HeartPulse },
  { label: "Universidade", href: "/university", icon: GraduationCap },
];

const AI_WORKFLOW_ITEMS = [
  { label: "Workflow Live", href: "/workflows", icon: Bot },
  { label: "Histórico", href: "/history", icon: BarChart3 },
];

const KNOWLEDGE_ITEMS = [
  { label: "Knowledge Base", href: "/knowledge", icon: Brain },
  { label: "Documentos", href: "/documents", icon: HardDrive },
  { label: "Training", href: "/training", icon: Settings },
];

const ADMIN_ITEMS = [
  { label: "System Health", href: "/admin", icon: Shield },
  { label: "Integrações", href: "/integrations", icon: Link2 },
  { label: "Custos & Uso", href: "/admin/costs", icon: Globe },
  { label: "Circuit Breakers", href: "/admin/circuits", icon: Shield },
];

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
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-card border-r border-border transform transition-all duration-300 lg:translate-x-0 lg:static lg:block",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64"
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
              <Bot className="h-6 w-6 text-primary-glow" />
            ) : (
              <h1 className="text-xl font-bold tracking-wider text-primary-glow whitespace-nowrap">
                ArtorIA <span className="text-xs text-muted-foreground ml-1">v2.0</span>
              </h1>
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
                {/* === BIG TECH SUITES === */}
                {/* Google Workspace */}
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

                {/* Microsoft 365 */}
                <NavGroup
                  icon={Layout}
                  label="Microsoft 365"
                  items={MICROSOFT_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Microsoft 365"}
                  onToggle={() => toggleGroup("Microsoft 365")}
                />

                <div className="my-2 border-t border-white/5 mx-2" />

                {/* === BUSINESS SUITE === */}
                <NavGroup
                  icon={Briefcase}
                  label="Gestão & Negócios"
                  items={BUSINESS_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Gestão & Negócios"}
                  onToggle={() => toggleGroup("Gestão & Negócios")}
                />
                
                <div className="my-2 border-t border-white/5 mx-2" />

                {/* === PRO SUITE === */}
                <NavGroup
                  icon={Briefcase}
                  label="Profissional"
                  items={PRO_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Profissional"}
                  onToggle={() => toggleGroup("Profissional")}
                />

                {/* === OPS SUITE === */}
                <NavGroup
                  icon={Wifi}
                  label="Vida & Ops"
                  items={OPS_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Vida & Ops"}
                  onToggle={() => toggleGroup("Vida & Ops")}
                />

                {/* === DESIGN SUITE (Unified) === */}
                <NavGroup
                  icon={Palette}
                  label="Design"
                  items={DESIGN_SUITE_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Design"}
                  onToggle={() => toggleGroup("Design")}
                />

                <div className="my-2 border-t border-white/5 mx-2" />

                {/* === PRODUCTIVITY & DEV === */}
                <NavGroup
                  icon={Layout}
                  label="Hub de Trabalho"
                  items={WORKSPACE_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Hub de Trabalho"}
                  onToggle={() => toggleGroup("Hub de Trabalho")}
                />

                <NavGroup
                  icon={Code2}
                  label="Dev & Code"
                  items={DEV_GIT_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Dev & Code"}
                  onToggle={() => toggleGroup("Dev & Code")}
                />

                <div className="my-2 border-t border-white/5 mx-2" />

                {/* === COMMUNICATION === */}
                <NavGroup
                  icon={MessageSquare}
                  label="Comunicação"
                  items={COMMUNICATION_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Comunicação"}
                  onToggle={() => toggleGroup("Comunicação")}
                />

                <NavGroup
                  icon={Music}
                  label="Media"
                  items={MEDIA_ITEMS}
                  activePath={pathname}
                  isOpen={openGroup === "Media"}
                  onToggle={() => toggleGroup("Media")}
                />

                <div className="my-2 border-t border-white/5 mx-2" />

                {/* === AI SYSTEM === */}
                <NavGroup
                  icon={Bot}
                  label="Sistema IA"
                  items={[...AI_WORKFLOW_ITEMS, ...KNOWLEDGE_ITEMS]}
                  activePath={pathname}
                  isOpen={openGroup === "Sistema IA"}
                  onToggle={() => toggleGroup("Sistema IA")}
                />

                <NavGroup
                  icon={Shield}
                  label="Administração"
                  items={[...ADMIN_ITEMS, { label: "Configurações de voz", href: "/settings/voice", icon: Settings }]}
                  activePath={pathname}
                  isOpen={openGroup === "Administração"}
                  onToggle={() => toggleGroup("Administração")}
                />
              </>
            ) : (
              /* Collapsed Icons (UPDATED) */
              <div className="space-y-2 flex flex-col items-center">
                <Link href="/google/gmail" title="Google" className="p-2 text-muted-foreground hover:bg-white/5 rounded">
                  <Globe className="h-4 w-4" />
                </Link>
                <Link href="/studio" title="Studio" className="p-2 text-muted-foreground hover:bg-white/5 rounded">
                  <Clapperboard className="h-4 w-4" />
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
