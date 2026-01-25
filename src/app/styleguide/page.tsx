"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Play } from "lucide-react";
import { toast } from "sonner";

export default function StyleGuidePage() {
  return (
    <div className="p-8 space-y-8 min-h-full">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          <span className="text-primary-glow">ArtorIA</span> Design System
        </h1>
        <p className="text-xl text-muted-foreground">Cyberpunk Aesthetic & Component Playground</p>
      </div>

      <Tabs defaultValue="colors" className="space-y-8">
        <TabsList className="bg-secondary">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* COLORS TAB */}
        <TabsContent value="colors" className="space-y-8">
          <Section title="Primary Colors">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorCard name="Background" className="bg-background border" />
              <ColorCard name="Surface (Card)" className="bg-card border" />
              <ColorCard name="Primary" className="bg-primary text-primary-foreground" />
              <ColorCard name="Primary Glow" className="bg-primary-glow text-white" />
            </div>
          </Section>
          
          <Section title="Accents">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorCard name="Cyan Accent" className="bg-accent-cyan text-black" />
              <ColorCard name="Pink Accent" className="bg-accent-pink text-white" />
              <ColorCard name="Destructive" className="bg-destructive text-destructive-foreground" />
              <ColorCard name="Muted" className="bg-muted text-muted-foreground" />
            </div>
          </Section>
        </TabsContent>

        {/* TYPOGRAPHY TAB */}
        <TabsContent value="typography" className="space-y-8">
          <div className="space-y-4 border p-6 rounded-lg bg-card">
            <h1 className="text-4xl font-extrabold scroll-m-20 tracking-tight lg:text-5xl">
              Heading 1: The quick brown fox
            </h1>
            <h2 className="text-3xl font-semibold tracking-tight first:mt-0">
              Heading 2: Jumps over the lazy dog
            </h2>
            <h3 className="text-2xl font-semibold tracking-tight">
              Heading 3: Cyberpunk aesthetic
            </h3>
            <h4 className="text-xl font-semibold tracking-tight">
              Heading 4: Component library
            </h4>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <blockquote className="mt-6 border-l-2 border-primary pl-6 italic">
              "The future is already here – it's just not evenly distributed."
            </blockquote>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              const artoria = "awesome";
            </code>
          </div>
        </TabsContent>

        {/* COMPONENTS TAB */}
        <TabsContent value="components" className="space-y-8">
          <Section title="Buttons">
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button disabled>Disabled</Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" /> With Icon
              </Button>
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
              </Button>
            </div>
          </Section>

          <Section title="Inputs & Forms">
            <div className="grid max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="******" />
            </div>
            <div className="grid w-full gap-1.5 mt-4">
              <Label htmlFor="message">Message</Label>
              <Input id="message" placeholder="Type your message here." />
            </div>
          </Section>

          <Section title="Cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Real-time monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">All systems operational</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Dashboard</Button>
                </CardFooter>
              </Card>

              <Card className="border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                <CardHeader>
                  <CardTitle className="text-primary-glow flex items-center gap-2">
                    <Play className="h-5 w-5" /> Active Workflow
                  </CardTitle>
                  <CardDescription>Agent is thinking...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-2 w-full bg-secondary rounded overflow-hidden">
                    <div className="h-full bg-primary w-[60%] animate-pulse" />
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">Processing step 3 of 5</p>
                </CardContent>
              </Card>
            </div>
          </Section>
        </TabsContent>

        {/* FEEDBACK TAB */}
        <TabsContent value="feedback" className="space-y-8">
          <Section title="Toast Notifications">
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })}>
                Show Default Toast
              </Button>
              <Button variant="outline" className="border-green-500/50 hover:bg-green-500/10" onClick={() => toast.success("Success: File uploaded successfully")}>
                Show Success
              </Button>
              <Button variant="outline" className="border-red-500/50 hover:bg-red-500/10" onClick={() => toast.error("Error: Connection failed")}>
                Show Error
              </Button>
            </div>
          </Section>

          <Section title="Loaders & Skeletons">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
               <Skeleton className="h-[125px] w-[250px] rounded-xl" />
               <Skeleton className="h-[125px] w-[250px] rounded-xl" />
               <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-l-2 border-primary/20 pl-6">
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function ColorCard({ name, className }: { name: string; className: string }) {
  return (
    <div className={`p-6 rounded-lg shadow-sm flex flex-col justify-end h-32 ${className}`}>
      <span className="font-semibold text-sm">{name}</span>
    </div>
  );
}
