"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Code, GitFork, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { forkPlayground } from "@/features/playground/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SnippetUser {
  name: string | null;
  image: string | null;
}

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  template: string;
  createdAt: Date;
  user: SnippetUser;
}

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Format dates for display
  const createdAtFormatted = formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true });

  // Get template icon based on template type
  const getTemplateIcon = (template: string) => {
    switch (template.toUpperCase()) {
      case "PYTHON":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg";
      case "JAVA":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg";
      case "CPP":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg";
      case "C":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg";
      case "JAVASCRIPT":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
      case "GO":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg";
      case "RUST":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg";
      default:
        return "/placeholder.svg";
    }
  };

  const handleFork = () => {
    startTransition(async () => {
      try {
        const newPlayground = await forkPlayground(snippet.id);
        if (newPlayground) {
          toast.success("Snippet forked successfully!");
          router.push(`/playground/${newPlayground.id}`);
        } else {
          toast.error("Failed to fork snippet. Ensure you are signed in.");
        }
      } catch (error) {
        toast.error("An error occurred while forking.");
      }
    });
  };

  return (
    <div className="group relative flex flex-col justify-between border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-zinc-950/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl backdrop-blur-sm">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div
              className="relative w-14 h-14 flex items-center justify-center rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={getTemplateIcon(snippet.template) || "/placeholder.svg"}
                alt={snippet.template}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                {snippet.title}
              </h3>
              <Badge variant="secondary" className="mt-1.5 font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {snippet.template}
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-5 line-clamp-2 min-h-[40px]">
          {snippet.description || "No description provided for this snippet."}
        </p>

        <div className="flex flex-col gap-2.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
              <Image
                src={snippet.user.image || "/placeholder.svg"}
                alt={snippet.user.name || "Anonymous"}
                width={20}
                height={20}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="truncate">{snippet.user.name || "Anonymous Developer"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-zinc-400" />
            <span>Updated {createdAtFormatted}</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between gap-3 mt-auto">
        <Link href={`/playground/${snippet.id}`} className="flex-1">
          <Button variant="outline" className="w-full justify-between group/btn border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200" size="sm">
            <span>View Code</span>
            <ArrowRight size={14} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </Button>
        </Link>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleFork} 
          disabled={isPending}
          className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm gap-2"
        >
          {isPending ? (
            <div className="h-4 w-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GitFork size={14} />
          )}
          <span>Fork</span>
        </Button>
      </div>
    </div>
  );
}
