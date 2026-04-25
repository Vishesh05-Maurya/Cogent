"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Save, Loader2, Sparkles, Settings, Plus, Lightbulb, Globe, Lock, GitFork } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePlayground } from "../context/playground-context"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { publishPlayground, forkPlayground } from "../actions"

export function PlaygroundHeader() {
  const {
    playgroundData,
    activeFileId,
    openFiles,
    handleSave,
    handleSaveAll,
    isAISuggestionsEnabled,
    setIsAISuggestionsEnabled,
    setIsPreviewVisible,
    setIsTerminalVisible,
    isPreviewVisible,
    isTerminalVisible,
  } = usePlayground()

  const { user } = useUser()
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isForking, setIsForking] = useState(false)

  const selectedFile = activeFileId ? openFiles.find((f) => f.id === activeFileId) : null
  const hasUnsavedChanges = openFiles.some((f) => f.hasUnsavedChanges)

  const isOwner = user?.id === playgroundData?.userId

  const handlePublishToggle = async () => {
    if (!playgroundData?.id) return
    setIsPublishing(true)
    const newStatus = !playgroundData.isPublic
    const res = await publishPlayground(playgroundData.id, newStatus)
    setIsPublishing(false)
    if (res?.success) {
      toast.success(`Playground is now ${newStatus ? 'Public' : 'Private'}`)
      playgroundData.isPublic = newStatus // Optimistic UI update
    } else {
      toast.error("Failed to change visibility")
    }
  }

  const handleFork = async () => {
    if (!playgroundData?.id) return
    setIsForking(true)
    const newPlayground = await forkPlayground(playgroundData.id)
    setIsForking(false)
    if (newPlayground?.id) {
      toast.success("Successfully forked snippet!")
      router.push(`/playground/${newPlayground.id}`)
    } else {
      toast.error("Failed to fork snippet")
    }
  }

  return (
    <header className="h-14 border-b flex items-center px-4 justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="mr-2" />
        <h1 className="text-lg font-semibold">{playgroundData?.title || "Code Editor"}</h1>
        {playgroundData?.isPublic && (
          <span className="ml-3 text-xs bg-muted px-2 py-1 rounded text-muted-foreground flex items-center gap-1 border">
            <Globe className="h-3 w-3" /> Public
          </span>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            {selectedFile.fileExtension ? `${selectedFile.filename}.${selectedFile.fileExtension}` : selectedFile.filename}
          </span>

          {isOwner ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handlePublishToggle}
                disabled={isPublishing}
                title={playgroundData?.isPublic ? "Make Private" : "Publish to Community"}
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : playgroundData?.isPublic ? (
                  <Lock className="h-4 w-4 mr-2" />
                ) : (
                  <Globe className="h-4 w-4 mr-2" />
                )}
                {playgroundData?.isPublic ? "Unpublish" : "Publish"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSave()}
                disabled={!selectedFile.hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button size="sm" variant="outline" onClick={handleSaveAll} disabled={!hasUnsavedChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>
            </>
          ) : (
            <Button size="sm" variant="default" onClick={handleFork} disabled={isForking}>
              {isForking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <GitFork className="h-4 w-4 mr-2" />}
              Fork to my account
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsPreviewVisible(!isPreviewVisible)}>
                {isPreviewVisible ? "Hide" : "Show"} Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTerminalVisible(!isTerminalVisible)}>
                {isTerminalVisible ? "Hide" : "Show"} Terminal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsAISuggestionsEnabled(!isAISuggestionsEnabled)}>
                {isAISuggestionsEnabled ? "Disable" : "Enable"} Inline AI (Ctrl+G)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  )
}