import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Github, Twitter, Sparkles } from "lucide-react";

const dotGridStyle = {
  backgroundColor: "#ffffff",
  backgroundImage: "radial-gradient(circle, #1d4ed8 1.2px, transparent 1.2px)",
  backgroundSize: "32px 32px",
  backgroundPosition: "0 0",
};

const projects = [
  {
    name: "Fenway Banking",
    type: "Mobile redesign",
    year: "2025",
    accent: "#185FA5",
    bg: "#E6F1FB",
    tags: ["fintech", "mobile"],
  },
  {
    name: "Pulse Analytics",
    type: "Dashboard system",
    year: "2025",
    accent: "#D85A30",
    bg: "#FAECE7",
    tags: ["b2b", "data viz"],
  },
  {
    name: "Verde wellness",
    type: "Brand & web",
    year: "2025",
    accent: "#1D9E75",
    bg: "#E1F5EE",
    tags: ["brand", "web"],
  },
  {
    name: "Lumen design system",
    type: "Internal tooling",
    year: "ongoing",
    accent: "#534AB7",
    bg: "#EEEDFE",
    tags: ["systems", "tokens"],
  },
];

const stats = [
  { label: "projects shipped", value: "42" },
  { label: "years building", value: "7" },
  { label: "happy clients", value: "28" },
  { label: "coffee per week", value: "∞" },
];

const tools = ["Figma", "Framer", "React", "Tailwind", "Notion", "Linear", "Webflow"];

export default function Portfolio() {
  return (
    <div style={dotGridStyle} className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">

        <nav className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 rounded-md bg-blue-700">
              <AvatarFallback className="rounded-md bg-blue-700 text-white text-sm font-medium">M</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-blue-950">minh.dev</span>
          </div>
          <div className="flex gap-6 text-sm text-blue-900">
            <a href="#work" className="hover:underline">work</a>
            <a href="#about" className="hover:underline">about</a>
            <a href="#writing" className="hover:underline">writing</a>
            <a href="#contact" className="hover:underline">contact</a>
          </div>
        </nav>

        <Card className="mb-6 border-0.5">
          <CardContent className="p-10">
            <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-900 hover:bg-blue-50">
              <Sparkles className="mr-1.5 h-3 w-3" />
              available for work · 2026
            </Badge>
            <h1 className="mb-4 max-w-xl text-4xl font-medium leading-tight text-blue-950">
              Product designer crafting calm, considered interfaces.
            </h1>
            <p className="mb-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              I help early-stage teams turn rough ideas into shipped products. Currently
              based in Hanoi, working remotely with teams across Asia and Europe.
            </p>
            <div className="flex gap-2.5">
              <Button className="bg-blue-700 hover:bg-blue-800">
                view work
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button variant="outline">get in touch</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-0.5">
              <CardContent className="p-4">
                <p className="mb-1 text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-medium text-blue-950">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div id="work" className="mb-4 mt-8 flex items-baseline justify-between px-1">
          <h2 className="text-lg font-medium">selected work</h2>
          <span className="text-xs text-muted-foreground">2024 — 2026</span>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.name} className="cursor-pointer transition-colors hover:border-blue-300">
              <CardContent className="p-5">
                <div
                  className="mb-3 flex h-24 items-center justify-center rounded-md"
                  style={{ background: p.bg }}
                >
                  <div
                    className="h-10 w-10 rounded-lg"
                    style={{
                      background: p.accent,
                      transform: p.name === "Pulse Analytics" ? "skewX(-12deg)" : "none",
                      borderRadius: p.name === "Verde wellness" ? "50%" : "8px",
                    }}
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.year}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6 border-0.5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">tools & stack</CardTitle>
            <CardDescription className="text-xs">things I reach for daily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <Badge key={t} variant="secondary" className="bg-blue-50 text-blue-900 hover:bg-blue-100">
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card id="contact" className="border-0.5">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-medium">Have a project in mind?</p>
                <p className="text-sm text-muted-foreground">
                  Booking from June 2026 · responses within 24h
                </p>
              </div>
              <Button className="bg-blue-700 hover:bg-blue-800 whitespace-nowrap">
                say hello
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                className="flex-1"
              />
              <Button variant="outline" size="icon"><Mail className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Github className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Twitter className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 minh.dev · made with care in Hanoi
        </p>

      </div>
    </div>
  );
}
