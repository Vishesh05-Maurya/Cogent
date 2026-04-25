"use client";
import React, { useState } from 'react'
import { PlaygroundEditor } from './playground-editor'
import { useAISuggestions } from '../hooks/useAISuggestion'
import type { FileSystemItem } from './file-tree'

interface PlaygroundEditorClientProps {
  templateData: FileSystemItem
}

const PlaygroundEditorClient: React.FC<PlaygroundEditorClientProps> = ({ templateData }) => {
  const [content, setContent] = useState('')
  const ai = useAISuggestions()

  const handleSave = async (file: FileSystemItem, content: string) => {
    // TODO: Implement save functionality
    console.log('Saving file:', file, 'with content:', content)
  }

  return (
    <div className="h-screen">
      <PlaygroundEditor 
        activeFile={undefined}
        content={content}
        onContentChange={setContent}
        suggestion={ai.suggestion}
        suggestionLoading={ai.isLoading}
        suggestionPosition={ai.position}
        onAcceptSuggestion={ai.acceptSuggestion}
        onRejectSuggestion={ai.rejectSuggestion}
        onTriggerSuggestion={ai.fetchSuggestion}
      />
    </div>
  )
}

export default PlaygroundEditorClient