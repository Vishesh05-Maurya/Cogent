import { Terminal, Sparkles, Globe, Cpu, Code2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Cogent",
  description: "Explore the powerful features of the Cogent intelligent coding platform.",
};

const features = [
  {
    icon: <Terminal className="w-8 h-8 text-[#00f59b]" />,
    title: "Sandboxed Playgrounds",
    description: "Write and execute code in 7 different languages instantly. Your code runs within secure, containerized environments using the Piston API without any setup required."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-[#00f59b]" />,
    title: "AI Chat Assistant",
    description: "Stuck on a bug? Use the Gemini-powered chat sidepanel to explain architecture, refactor code, or generate complex boilerplate. Features prompt-enhancement for precision."
  },
  {
    icon: <Cpu className="w-8 h-8 text-[#00f59b]" />,
    title: "Inline AI Generation",
    description: "Highlight code and press Ctrl+G. The context-aware AI infers your current programming language and writes logic seamlessly into your Monaco editor workspace."
  },
  {
    icon: <Globe className="w-8 h-8 text-[#00f59b]" />,
    title: "Community Snippets",
    description: "Make your best playgrounds public. Browse the community gallery, fork interesting projects to your own dashboard, and star your favorites for later."
  },
  {
    icon: <Code2 className="w-8 h-8 text-[#00f59b]" />,
    title: "VS Code Experience",
    description: "Enjoy a premium IDE experience in the browser with full Monaco editor integration, an Xterm.js interactive terminal, and intelligent syntax highlighting."
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-[#00f59b]" />,
    title: "Workspace Manager",
    description: "Manage all your projects via a sleek dashboard. Easily duplicate, delete, and control public visibility of your code right from a robust data table."
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen py-24 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center space-y-6 max-w-3xl px-4">
        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-md">
          Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f59b] to-emerald-400 drop-shadow-xl">Features</span>
        </h1>
        <p className="text-lg text-zinc-400">
          Cogent is engineered to accelerate your development workflow. 
          Discover the suite of tools designed to help you write, debug, and share code seamlessly.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 max-w-7xl px-6 w-full">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group relative flex flex-col items-start p-8 bg-black/60 backdrop-blur-md border border-zinc-800 rounded-2xl transition-all duration-300 hover:border-[#00f59b]/50 shadow-lg hover:shadow-[0_0_30px_rgba(0,245,155,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#00f59b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl block pointer-events-none" />
            <div className="mb-6 z-10 bg-black/80 border border-zinc-800 p-4 rounded-xl group-hover:border-[#00f59b]/50 group-hover:bg-[#00f59b]/10 transition-colors">
              {feature.icon}
            </div>
            <h3 className="z-10 text-xl font-bold text-white mb-3">
              {feature.title}
            </h3>
            <p className="z-10 text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-28 flex flex-col items-center justify-center p-12 max-w-4xl w-full border border-zinc-800 bg-black/60 shadow-2xl rounded-3xl text-center relative overflow-hidden backdrop-blur-md px-6">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00f59b]/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />
        
        <h2 className="relative z-10 text-3xl font-bold text-white mb-6">Ready to experience it yourself?</h2>
        <Link 
          href="/dashboard"
          className="relative z-10 inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-black transition-all duration-200 bg-[#00f59b] border border-transparent rounded-lg hover:scale-105 shadow-[0_0_20px_rgba(0,245,155,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00f59b] focus:ring-offset-black"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
}
