"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { X } from 'lucide-react';

import { Check, AlertTriangle, Star, ChevronRight } from 'lucide-react';
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
   
  return (
    <div className=" z-20 flex flex-col items-center justify-start min-h-screen py-2 mt-10">
      <div className="mb-10 px-4 py-1.5 rounded-full border border-[#00f59b20] bg-[#00f59b05] backdrop-blur-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00f59b] shadow-[0_0_8px_#00f59b]" />
          <span className="text-[#00f59b] text-sm font-medium tracking-tight">
            Introducing Cogent v1.0 — Now in Your Hands
          </span>
        </div>
        
      
      <div className="flex flex-col justify-center items-center my-5">
      <h1 className=" z-20 text-6xl mt-10 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-green-500 to-green-500 dark:from-green-400 dark:via-green-400 dark:to-green-400 tracking-tight leading-[1.3] ">
            Code With with Intelligence
      </h1>
      </div>
     

      <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400 px-5 py-10 max-w-2xl">
        Cogent is a powerful and intelligent code editor that enhances
        your coding experience with advanced features and seamless integration.
        It is designed to help you write, debug, and optimize your code
        efficiently.
      </p>




      
        <Link
        href="/dashboard"
        className="bg-[#00f59b] text-black px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
      >
       Get Started
      </Link>
      

      <div className="w-full max-w-3xl mx-auto mt-10 overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0c14] shadow-2xl font-mono text-sm md:text-base">





      {/* Terminal Header (macOS style) */}
      <div className="flex items-center justify-between px-4 py-3  bg-[#0d111a] border-b border-zinc-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-zinc-500 text-xs">cogent — ~/projects/my-app</div>
        <div className="w-12" /> {/* Spacer to center the title */}
      </div>

      {/* Terminal Body */}
      <div className="p-6 space-y-3">
        
        {/* Input Command */}
        <div className="flex items-start gap-3">
          <ChevronRight className="text-[#00f59b] mt-1 shrink-0" size={18} />
          <p className="text-white">
            cogent <span className="text-zinc-400">"add rate limiting to the API with Redis"</span>
          </p>
        </div>

        {/* Loading States */}
        <div className="flex items-center gap-3 ml-1">
          <div className="w-2 h-2 rotate-45 bg-zinc-700" />
          <p className="text-zinc-500">Analyzing codebase... found 12 route handlers</p>
        </div>
        <div className="flex items-center gap-3 ml-1">
          <div className="w-2 h-2 rotate-45 bg-zinc-700" />
          <p className="text-zinc-500 border-r-2 border-zinc-500 pr-1 animate-pulse">
            Planning implementation strategy...
          </p>
        </div>

        {/* Execution Steps */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3">
            <Check className="text-cyan-400" size={18} />
            <p className="text-zinc-300">
              Created <span className="text-cyan-400">middleware/rateLimiter.ts</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Check className="text-cyan-400" size={18} />
            <p className="text-zinc-300">
              Updated <span className="text-cyan-400">routes/api.ts</span> 
              <span className="text-zinc-500 ml-2">(+8 lines)</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Check className="text-cyan-400" size={18} />
            <p className="text-zinc-300">
              Added <span className="text-cyan-400">Redis config to config/redis.ts</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={18} />
            <p className="text-orange-500/90">
              Added REDIS_URL to .env.example
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Check className="text-[#00f59b]" size={18} />
            <p className="text-[#00f59b]">
              All tests passing <span className="text-zinc-500 ml-1">(14/14)</span>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-3 pt-2 text-purple-400">
          <Star className="fill-current" size={16} />
          <p>Done in 4.2s — 3 files changed, 47 insertions</p>
        </div>

        {/* New Line Prompt */}
        <div className="flex items-center gap-2 pt-1">
          <ChevronRight className="text-[#00f59b]" size={18} />
          <div className="w-2 h-5 bg-[#00f59b]" />
        </div>

      </div>
    </div>
    </div>
  );
}
