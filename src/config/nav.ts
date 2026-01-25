
import {
    Activity,
    BarChart3,
    Bot,
    Calendar,
    CheckSquare,
    Database,
    FileText,
    Github,
    Globe,
    HardDrive,
    Image as ImageIcon,
    LayoutDashboard,
    Link2,
    Mail,
    Mic,
    Network,
    Settings,
    Shield,
    ShoppingBag,
    TableProperties,
    Terminal,
    Wrench
} from "lucide-react";

export const MAIN_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Ferramentas", href: "/tools", icon: Wrench },
  { label: "Gerador de Imagens", href: "/images", icon: ImageIcon },
  { label: "Automações", href: "/plans", icon: Network },
  { label: "Sentinel Eye", href: "/admin/sentinel", icon: Activity },
  { label: "Mercado Livre", href: "/meli", icon: ShoppingBag },
  { label: "GitHub", href: "/github", icon: Github },
];

export const GOOGLE_ITEMS = [
  { label: "Gmail", href: "/google/gmail", icon: Mail },
  { label: "Agenda", href: "/google/calendar", icon: Calendar },
  { label: "Tarefas", href: "/google/tasks", icon: CheckSquare },
  { label: "Drive", href: "/google/drive", icon: HardDrive },
  { label: "Planilhas", href: "/google/sheets", icon: TableProperties },
  { label: "Documentos", href: "/google/docs", icon: FileText },
];

export const AI_WORKFLOW_ITEMS = [
  { label: "Base de Conhecimento", href: "/knowledge", icon: Database },
  { label: "ElevenLabs Voice", href: "/elevenlabs", icon: Mic },
  { label: "Workflow Live", href: "/workflows", icon: Bot },
  { label: "Histórico", href: "/history", icon: BarChart3 },
];

export const ADMIN_ITEMS = [
  { label: "System Health", href: "/admin", icon: Shield },
  { label: "Workers & Filas", href: "/admin/workers", icon: Activity },
  { label: "Neural Memory", href: "/memory", icon: Database },
  { label: "Integrações", href: "/integrations", icon: Link2 },
  { label: "Custos & Uso", href: "/admin/costs", icon: Globe },
];

export const DEV_GIT_ITEMS = [
  { label: "Code Playground", href: "/code", icon: Terminal },
  { label: "Remote Sandbox", href: "/sandbox", icon: Terminal },
];

export const SETTINGS_ITEMS = [
    ...ADMIN_ITEMS,
    { label: "Configurações de voz", href: "/settings/voice", icon: Settings }
];
