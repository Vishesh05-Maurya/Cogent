import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Check, X, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface InlineAIPromptProps {
  isOpen: boolean;
  position: { top: number; left: number } | null;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
  onAccept: () => void;
  onReject: () => void;
  generatedCode: string | null;
  isLoading: boolean;
}

export const InlineAIPrompt: React.FC<InlineAIPromptProps> = ({
  isOpen,
  position,
  onClose,
  onSubmit,
  onAccept,
  onReject,
  generatedCode,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPrompt("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside to close (only if we haven't generated code yet to prevent accidental loss)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        !generatedCode &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, generatedCode, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (generatedCode) {
        onReject();
      } else {
        onClose();
      }
    }
  };

  // Ensure menu stays within screen bounds roughly
  const style: React.CSSProperties = {
    position: "absolute",
    zIndex: 50, // above monaco
    width: "480px",
    maxWidth: "90vw",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
  };

  if (position) {
    // Keep it slightly below cursor and keep inside right edge
    style.top = `${position.top + 25}px`;
    style.left = `min(${position.left}px, calc(100% - 490px))`;
  } else {
    // Fallback center
    style.top = "50%";
    style.left = "50%";
    style.transform = "translate(-50%, -50%)";
  }

  return (
    <div
      ref={containerRef}
      style={style}
      className="bg-[#1e1e20] border border-[#3b3b42] rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      onKeyDown={handleKeyDown}
    >
      {/* Input Section */}
      <form onSubmit={handleSubmit} className="relative flex items-center p-2">
        <Sparkles className="w-5 h-5 text-purple-400 absolute left-4" />
        <input
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Generate code... (Press Enter)"
          className="w-full bg-transparent text-white placeholder-gray-400 px-10 py-2 outline-none text-sm"
          disabled={isLoading}
        />
        {(prompt || isLoading) && (
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-3 p-1.5 rounded-md bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        )}
      </form>

      {/* Generated Code Preview Section */}
      {generatedCode && !isLoading && (
        <div className="border-t border-[#3b3b42] bg-[#161618]">
          <div className="p-3 max-h-[300px] overflow-y-auto text-sm text-gray-300 font-mono">
            <ReactMarkdown
              components={{
                pre: ({ node, ...props }) => {
                  const { inline, ...rest } = props as any;
                  return <pre className="bg-transparent p-0 m-0 overflow-visible" {...rest} />;
                },
                code: ({ node, className, children, ...props }) => {
                  const { inline, ...rest } = props as any;
                  return (
                    <code className={`text-gray-300 whitespace-pre-wrap ${className || ""}`} {...rest}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {`\`\`\`\n${generatedCode}\n\`\`\``}
            </ReactMarkdown>
          </div>
          
          <div className="flex gap-2 p-3 pt-0 border-t border-[#3b3b42] mt-2 bg-[#1e1e20]">
            <button
              onClick={onAccept}
              className="mt-2 flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 py-1.5 rounded-md transition-colors text-xs font-medium"
            >
              <Check className="w-3 h-3" /> Accept
            </button>
            <button
              onClick={onReject}
              className="mt-2 flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-1.5 rounded-md transition-colors text-xs font-medium"
            >
              <X className="w-3 h-3" /> Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
