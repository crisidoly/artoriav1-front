import RemoteTerminal from '@/components/sandbox/RemoteTerminal';

export default function SandboxPage() {
  return (
    <div className="p-8 space-y-6 bg-zinc-950 min-h-screen text-white">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Remote Sandbox Controller
        </h1>
        <p className="text-zinc-400">
          Secure, isolated execution environment. All commands run on the remote VPS via SSH.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Terminal Area */}
        <div className="lg:col-span-2 space-y-4">
          <RemoteTerminal />
        </div>

        {/* Status / Controls Sidebar (Future Expansion) */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold text-zinc-200 mb-4">Environment Status</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-zinc-500">Connection</span>
                    <span className="text-green-400">Encrypted (SSH)</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">Mode</span>
                    <span className="text-blue-400">Puppeteer</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-zinc-500">Local Exec</span>
                    <span className="text-red-500 font-bold">DISABLED</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
