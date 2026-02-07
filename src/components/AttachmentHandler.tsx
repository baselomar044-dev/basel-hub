'use client'

import { useState, useRef } from 'react'

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  preview?: string
  content?: string
  data?: string // Base64 data URL for sending to AI
  analysis?: string
}

interface AttachmentHandlerProps {
  onAttachmentsChange: (attachments: Attachment[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export default function AttachmentHandler({ 
  onAttachmentsChange, 
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.xlsx', '.xls', '.csv', '.doc', '.docx', '.dwg', '.dxf', '.txt', '.json', '.js', '.ts', '.py', '.md', '.html', '.css']
}: AttachmentHandlerProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | File[]) => {
    setIsProcessing(true)
    const newAttachments: Attachment[] = []
    
    for (const file of Array.from(files)) {
      if (attachments.length + newAttachments.length >= maxFiles) break
      
      const attachment = await processFile(file)
      if (attachment) {
        newAttachments.push(attachment)
      }
    }
    
    const updated = [...attachments, ...newAttachments]
    setAttachments(updated)
    onAttachmentsChange(updated)
    setIsProcessing(false)
  }

  const processFile = async (file: File): Promise<Attachment | null> => {
    const id = crypto.randomUUID()
    
    // Always get base64 data for ALL files - this is what gets sent to AI
    const base64Data = await fileToBase64(file)
    
    const attachment: Attachment = {
      id,
      name: file.name,
      type: file.type || getTypeFromExtension(file.name),
      size: file.size,
      data: base64Data, // Store full base64 for API
    }

    // Get preview and text content based on file type
    if (file.type.startsWith('image/')) {
      attachment.preview = base64Data
      attachment.content = `[صورة: ${file.name}]`
    }
    // Read text content for text-based files
    else if (isTextFile(file)) {
      const text = await file.text()
      attachment.content = text
      attachment.preview = '📄'
    }
    // PDF files - store base64 for Gemini vision
    else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      attachment.preview = '📄'
      attachment.content = `[مستند PDF: ${file.name}، ${formatFileSize(file.size)}]`
    }
    // Excel files
    else if (file.name.match(/\.(xlsx?|xls)$/)) {
      attachment.preview = '📊'
      attachment.content = `[ملف Excel: ${file.name}، ${formatFileSize(file.size)}]`
    }
    // Word documents  
    else if (file.name.match(/\.(docx?|doc)$/)) {
      attachment.preview = '📝'
      attachment.content = `[مستند Word: ${file.name}، ${formatFileSize(file.size)}]`
    }
    // CAD files
    else if (file.name.match(/\.(dwg|dxf)$/)) {
      attachment.preview = '📐'
      attachment.content = `[ملف CAD: ${file.name}، ${formatFileSize(file.size)}]`
    }
    // Default
    else {
      attachment.preview = '📎'
      attachment.content = `[ملف: ${file.name}، ${formatFileSize(file.size)}]`
    }

    return attachment
  }

  const isTextFile = (file: File): boolean => {
    const textTypes = ['text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript', 'application/json', 'text/markdown']
    const textExtensions = ['.txt', '.csv', '.json', '.js', '.ts', '.tsx', '.jsx', '.py', '.html', '.css', '.md', '.yaml', '.yml', '.xml', '.sql', '.sh', '.env']
    
    return textTypes.includes(file.type) || textExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const getTypeFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const types: Record<string, string> = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xls: 'application/vnd.ms-excel',
      csv: 'text/csv',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      dwg: 'application/acad',
      dxf: 'application/dxf',
      txt: 'text/plain',
      json: 'application/json',
      js: 'text/javascript',
      ts: 'text/typescript',
      py: 'text/x-python',
      md: 'text/markdown',
      html: 'text/html',
      css: 'text/css',
    }
    return types[ext || ''] || 'application/octet-stream'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const removeAttachment = (id: string) => {
    const updated = attachments.filter(a => a.id !== id)
    setAttachments(updated)
    onAttachmentsChange(updated)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="attachment-handler">
      {/* Drop Zone */}
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        
        {isProcessing ? (
          <div className="processing">
            <div className="spinner"></div>
            <span>جاري المعالجة...</span>
          </div>
        ) : (
          <>
            <span className="icon">📎</span>
            <span className="text">اسحب الملفات هنا أو اضغط للاختيار</span>
            <span className="hint">PDF, Excel, Word, صور, كود, CAD</span>
          </>
        )}
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="attachments-list">
          {attachments.map(att => (
            <div key={att.id} className="attachment-item">
              <div className="attachment-preview">
                {att.preview?.startsWith('data:image') ? (
                  <img src={att.preview} alt={att.name} />
                ) : (
                  <span className="file-icon">{att.preview || '📄'}</span>
                )}
              </div>
              <div className="attachment-info">
                <span className="name">{att.name}</span>
                <span className="size">{formatFileSize(att.size)}</span>
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeAttachment(att.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .attachment-handler {
          width: 100%;
        }
        
        .drop-zone {
          border: 2px dashed var(--border-color, #374151);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--bg-tertiary, #1f2937);
        }
        
        .drop-zone:hover, .drop-zone.dragging {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .drop-zone .icon {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
        }
        
        .drop-zone .text {
          display: block;
          color: var(--text-primary, white);
          margin-bottom: 4px;
        }
        
        .drop-zone .hint {
          font-size: 12px;
          color: var(--text-secondary, #9ca3af);
        }
        
        .processing {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #3b82f6;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #3b82f6;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .attachments-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        
        .attachment-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-secondary, #374151);
          border-radius: 8px;
          max-width: 200px;
        }
        
        .attachment-preview {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          overflow: hidden;
          background: var(--bg-tertiary, #1f2937);
        }
        
        .attachment-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .file-icon {
          font-size: 20px;
        }
        
        .attachment-info {
          flex: 1;
          min-width: 0;
        }
        
        .attachment-info .name {
          display: block;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-primary, white);
        }
        
        .attachment-info .size {
          font-size: 10px;
          color: var(--text-secondary, #9ca3af);
        }
        
        .remove-btn {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.2s;
        }
        
        .remove-btn:hover {
          background: #ef4444;
          color: white;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export type { Attachment }
