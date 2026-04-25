import { getPublicPlaygrounds } from "@/features/playground/actions";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import { Code2, Sparkles, User, Globe } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Community Snippets | VibeCode",
  description: "Explore and learn from code snippets published by the VibeCode community.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SnippetsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const isMine = resolvedParams.filter === 'mine';
  
  const user = await currentUser();
  const userId = user?.id;

  let publicPlaygrounds = await getPublicPlaygrounds();

  if (isMine && userId) {
    publicPlaygrounds = publicPlaygrounds?.filter(p => p.userId === userId) || [];
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header Section */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc-100 dark:bg-grid-zinc-900 bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent blur-3xl opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
            <Sparkles size={16} className="text-emerald-500" />
            <span>Community Driven</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Snippets</span>
          </h1>
          
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Discover code, learn from fellow developers, and fork playgrounds to experiment on your own. 
            The community snippets library is open for everyone.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Code2 className="text-emerald-500" />
            {isMine ? "My Snippets" : "Recent Snippets"}
          </h2>
          
          {userId && (
            <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <Link 
                href="/snippets" 
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isMine ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}
              >
                <Globe size={16} />
                All Snippets
              </Link>
              <Link 
                href="/snippets?filter=mine" 
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isMine ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}
              >
                <User size={16} />
                My Snippets
              </Link>
            </div>
          )}
        </div>
        
        {publicPlaygrounds && publicPlaygrounds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicPlaygrounds.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 mt-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <Code2 size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No snippets found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-6">
              {isMine 
                ? "You haven't published any snippets yet. Go to your dashboard to make a playground public!" 
                : "It looks like no one has published their code yet. Be the first to share your playground with the community!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
