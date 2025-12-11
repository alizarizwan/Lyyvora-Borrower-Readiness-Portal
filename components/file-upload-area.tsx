"use client"

import type React from "react"

import { useState } from "react"

interface FileUploadAreaProps {
  onUpload: (file: File) => void
}

export function FileUploadArea({ onUpload }: FileUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setFileName(file.name)
      onUpload(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      onUpload(file)
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive ? "border-primary bg-primary/5" : "border-border bg-secondary/50"
      }`}
    >
      <input type="file" id="file-upload" onChange={handleChange} className="hidden" />
      <label htmlFor="file-upload" className="cursor-pointer block">
        <div className="text-2xl mb-2">📁</div>
        <p className="text-sm font-medium mb-1">
          {fileName ? `Uploaded: ${fileName}` : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX or image files (max 10MB)</p>
      </label>
    </div>
  )
}
