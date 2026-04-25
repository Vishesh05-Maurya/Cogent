"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { usePlayground as usePlaygroundHook } from "../hooks/usePlayground";
import { useFileExplorer, FileExplorerState } from "../hooks/useFileExplorer";
import { useAISuggestions, UseAISuggestionsReturn } from "../hooks/useAISuggestion";
import { TemplateFile, TemplateFolder, PlaygroundData, OpenFile } from "../types";
import { findFilePath } from "../libs";
import { toast } from "sonner";

interface PlaygroundContextType {
  // Data State
  playgroundData: PlaygroundData | null;
  templateData: TemplateFolder | null;
  isLoading: boolean;
  error: string | null;
  loadingStep: number;
  
  // File State
  activeFileId: string | null;
  openFiles: OpenFile[];
  editorContent: string;
  
  // UI State
  isPreviewVisible: boolean;
  isTerminalVisible: boolean;
  isAISuggestionsEnabled: boolean;
  isRunning: boolean;
  
  // Actions
  setIsPreviewVisible: (visible: boolean) => void;
  setIsTerminalVisible: (visible: boolean) => void;
  setIsAISuggestionsEnabled: (enabled: boolean) => void;
  handleSave: (fileId?: string) => Promise<void>;
  handleSaveAll: () => Promise<void>;
  saveTemplateData: (data: TemplateFolder) => Promise<TemplateFolder>;
  runCode: () => Promise<void>;
  fetchPlaygroundData: () => Promise<void>;
  
  // Expose hooks directly if needed
  aiSuggestions: UseAISuggestionsReturn;
  fileExplorer: FileExplorerState;
  terminalRef: React.RefObject<any>;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  
  // Custom hooks
  const { 
    playgroundData, 
    templateData: hookTemplateData, 
    isLoading: isDataLoading, 
    error: dataError, 
    loadPlayground, 
    saveTemplateData 
  } = usePlaygroundHook(id);
  
  // Use granular selectors to avoid infinite loops
  const feTemplateData = useFileExplorer(s => s.templateData);
  const setTemplateData = useFileExplorer(s => s.setTemplateData);
  const fePlaygroundId = useFileExplorer(s => s.playgroundId);
  const setPlaygroundId = useFileExplorer(s => s.setPlaygroundId);
  
  // For the context value, we still want to expose the rest of the store
  const fileExplorer = useFileExplorer();
  const aiSuggestions = useAISuggestions();
  
  // Local UI State
  const [isPreviewVisible, setIsPreviewVisible] = useState(false); // Default to false for practice
  const [isTerminalVisible, setIsTerminalVisible] = useState(true); // Default to true for practice
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<any>(null);

  
  // Loading step for PlaygroundLayout
  const loadingStep = useMemo(() => {
    if (isDataLoading) return 1;
    if (!hookTemplateData) return 2;
    return 3;
  }, [isDataLoading, hookTemplateData]);

  // Sync template data to file explorer once loaded
  useEffect(() => {
    if (hookTemplateData && hookTemplateData !== feTemplateData) {
      setTemplateData(hookTemplateData);
    }
  }, [hookTemplateData, feTemplateData, setTemplateData]);

  useEffect(() => {
    if (id && id !== fePlaygroundId) {
        setPlaygroundId(id);
    }
  }, [id, fePlaygroundId, setPlaygroundId]);

  const handleSave = useCallback(async (fileId?: string, silent: boolean = false) => {
    const targetFileId = fileId || fileExplorer.activeFileId;
    if (!targetFileId) return;

    const fileToSave = fileExplorer.openFiles.find((f) => f.id === targetFileId);
    if (!fileToSave) return;

    const latestTemplateData = fileExplorer.templateData;
    if (!latestTemplateData) return;

    try {
      const filePath = findFilePath(fileToSave, latestTemplateData);
      if (!filePath) {
        toast.error(`Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`);
        return;
      }

      // Update file content in template data (clone for immutability)
      const updatedTemplateData = JSON.parse(JSON.stringify(latestTemplateData));
      const updateFileContent = (items: any[]): any[] =>
        items.map((item) => {
          if ("folderName" in item) {
            return { ...item, items: updateFileContent(item.items) };
          } else if (
            item.filename === fileToSave.filename &&
            item.fileExtension === fileToSave.fileExtension
          ) {
            return { ...item, content: fileToSave.content };
          }
          return item;
        });
      updatedTemplateData.items = updateFileContent(updatedTemplateData.items);

      // Use saveTemplateData to persist changes
      await saveTemplateData(updatedTemplateData);
      fileExplorer.setTemplateData(updatedTemplateData);

      // Update open files
      const updatedOpenFiles = fileExplorer.openFiles.map((f) =>
        f.id === targetFileId
          ? {
              ...f,
              content: fileToSave.content,
              originalContent: fileToSave.content,
              hasUnsavedChanges: false,
            }
          : f
      );
      fileExplorer.setOpenFiles(updatedOpenFiles);

      if (!silent) toast.success(`Saved ${fileToSave.filename}.${fileToSave.fileExtension}`);
    } catch (error) {
      console.error("Error saving file:", error);
      if (!silent) toast.error(`Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`);
      throw error;
    }
  }, [fileExplorer, saveTemplateData]);

  const handleSaveAll = useCallback(async (silent: boolean = false) => {
    const unsavedFiles = fileExplorer.openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      if (!silent) toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id, silent)));
      if (!silent) toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch (error) {
      if (!silent) toast.error("Failed to save some files");
    }
  }, [fileExplorer.openFiles, handleSave]);

  // Auto-save feature removed per user request

  const runCode = useCallback(async () => {
    const activeFileId = fileExplorer.activeFileId;
    if (!activeFileId) {
      toast.error("Please select a file to run");
      return;
    }

    const activeFile = fileExplorer.openFiles.find(f => f.id === activeFileId);
    if (!activeFile) return;

    // Auto-save before running
    await handleSave(activeFileId);

    setIsRunning(true);
    setIsTerminalVisible(true);

    if (terminalRef.current?.writeToTerminal) {
      terminalRef.current.writeToTerminal(`\r\n\x1b[33m🚀 Running ${activeFile.filename}.${activeFile.fileExtension}...\x1b[0m\r\n`);
    }

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: playgroundData?.template,
          source: activeFile.content,
        }),
      });

      const result = await response.json();

      if (terminalRef.current?.writeToTerminal) {
        if (result.error) {
          terminalRef.current.writeToTerminal(`\x1b[31m❌ Error: ${result.error}\x1b[0m\r\n`);
        } else {
          // Piston output
          if (result.run.stdout) {
            terminalRef.current.writeToTerminal(result.run.stdout);
          }
          if (result.run.stderr) {
            terminalRef.current.writeToTerminal(`\x1b[31m${result.run.stderr}\x1b[0m`);
          }
          if (!result.run.stdout && !result.run.stderr) {
            terminalRef.current.writeToTerminal(`\x1b[90m(No output)\x1b[0m\r\n`);
          }
          terminalRef.current.writeToTerminal(`\r\n\x1b[32m✅ Process finished with exit code ${result.run.code}\x1b[0m\r\n`);
        }
      }
    } catch (error) {
      console.error("Run error:", error);
      if (terminalRef.current?.writeToTerminal) {
        terminalRef.current.writeToTerminal(`\x1b[31m❌ Failed to execute code\x1b[0m\r\n`);
      }
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  }, [fileExplorer, handleSave, playgroundData]);

  const value: PlaygroundContextType = {
    playgroundData,
    templateData: fileExplorer.templateData,
    isLoading: isDataLoading,
    error: dataError,
    loadingStep,
    
    activeFileId: fileExplorer.activeFileId,
    openFiles: fileExplorer.openFiles,
    editorContent: fileExplorer.editorContent,
    
    isPreviewVisible,
    isTerminalVisible,
    isAISuggestionsEnabled: aiSuggestions.isEnabled,
    
    isRunning,
    
    setIsPreviewVisible,
    setIsTerminalVisible,
    setIsAISuggestionsEnabled: (enabled) => {
        if (enabled !== aiSuggestions.isEnabled) {
            aiSuggestions.toggleEnabled();
        }
    },
    handleSave,
    handleSaveAll,
    saveTemplateData,
    fetchPlaygroundData: loadPlayground,
    runCode,
    
    aiSuggestions,
    fileExplorer,
    terminalRef,
  };

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error("usePlayground must be used within a PlaygroundProvider");
  }
  return context;
}
