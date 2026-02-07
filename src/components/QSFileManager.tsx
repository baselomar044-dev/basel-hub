'use client'

import { useState, useRef } from 'react'
import JSZip from 'jszip'

interface QSFileManagerProps {
  isOpen: boolean
  onClose: () => void
  onFileImport: (file: { name: string, content: string, type: string, data?: any }) => void
  exportData?: any
}

interface ParsedFile {
  name: string
  type: string
  content: string
  data?: any
  preview?: string
}

export default function QSFileManager({ isOpen, onClose, onFileImport, exportData }: QSFileManagerProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [files, setFiles] = useState<ParsedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Supported file types
  const supportedTypes = [
    { ext: '.pdf', mime: 'application/pdf', name: 'PDF Documents', icon: '📄' },
    { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', name: 'Excel Files', icon: '📊' },
    { ext: '.xls', mime: 'application/vnd.ms-excel', name: 'Excel Files (Legacy)', icon: '📊' },
    { ext: '.csv', mime: 'text/csv', name: 'CSV Files', icon: '📋' },
    { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', name: 'Word Documents', icon: '📝' },
    { ext: '.doc', mime: 'application/msword', name: 'Word Documents (Legacy)', icon: '📝' },
    { ext: '.dwg', mime: 'application/acad', name: 'AutoCAD Drawings', icon: '📐' },
    { ext: '.dxf', mime: 'application/dxf', name: 'DXF Drawings', icon: '📐' },
    { ext: '.zip', mime: 'application/zip', name: 'ZIP Archives', icon: '📦' },
    { ext: '.jpg', mime: 'image/jpeg', name: 'Images', icon: '🖼️' },
    { ext: '.jpeg', mime: 'image/jpeg', name: 'Images', icon: '🖼️' },
    { ext: '.png', mime: 'image/png', name: 'Images', icon: '🖼️' },
    { ext: '.json', mime: 'application/json', name: 'JSON Files', icon: '📋' },
    { ext: '.txt', mime: 'text/plain', name: 'Text Files', icon: '📄' },
    { ext: '.xml', mime: 'application/xml', name: 'XML Files', icon: '📋' },
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    await processFiles(droppedFiles)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    await processFiles(selectedFiles)
  }

  const processFiles = async (fileList: File[]) => {
    setIsProcessing(true)
    const processedFiles: ParsedFile[] = []

    for (const file of fileList) {
      try {
        const parsed = await parseFile(file)
        processedFiles.push(parsed)
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        processedFiles.push({
          name: file.name,
          type: file.type,
          content: `Error processing file: ${error}`,
          preview: '❌ Error'
        })
      }
    }

    setFiles(prev => [...prev, ...processedFiles])
    setIsProcessing(false)
  }

  const parseFile = async (file: File): Promise<ParsedFile> => {
    const ext = file.name.toLowerCase().split('.').pop()

    // Handle ZIP files
    if (ext === 'zip') {
      const zip = new JSZip()
      const contents = await zip.loadAsync(file)
      const fileList: string[] = []
      
      contents.forEach((path) => {
        fileList.push(path)
      })

      return {
        name: file.name,
        type: 'application/zip',
        content: `ZIP Archive containing ${fileList.length} files:\n${fileList.join('\n')}`,
        data: { files: fileList },
        preview: `📦 ${fileList.length} files`
      }
    }

    // Handle CSV
    if (ext === 'csv') {
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0]?.split(',') || []
      const rows = lines.slice(1).filter(l => l.trim())
      
      return {
        name: file.name,
        type: 'text/csv',
        content: text,
        data: { headers, rowCount: rows.length },
        preview: `📋 ${rows.length} rows, ${headers.length} columns`
      }
    }

    // Handle Excel (read as base64 for AI processing)
    if (ext === 'xlsx' || ext === 'xls') {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      
      return {
        name: file.name,
        type: file.type,
        content: `Excel file: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`,
        data: { base64, size: file.size },
        preview: `📊 Excel (${(file.size / 1024).toFixed(1)}KB)`
      }
    }

    // Handle Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      
      return {
        name: file.name,
        type: file.type,
        content: `Image: ${file.name}`,
        data: { base64, dataUrl: `data:${file.type};base64,${base64}` },
        preview: `🖼️ Image`
      }
    }

    // Handle PDF
    if (ext === 'pdf') {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      
      return {
        name: file.name,
        type: 'application/pdf',
        content: `PDF Document: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`,
        data: { base64, size: file.size },
        preview: `📄 PDF (${(file.size / 1024).toFixed(1)}KB)`
      }
    }

    // Handle CAD files
    if (ext === 'dwg' || ext === 'dxf') {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      
      return {
        name: file.name,
        type: `application/${ext}`,
        content: `CAD Drawing: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`,
        data: { base64, size: file.size },
        preview: `📐 CAD (${(file.size / 1024).toFixed(1)}KB)`
      }
    }

    // Handle JSON
    if (ext === 'json') {
      const text = await file.text()
      try {
        const json = JSON.parse(text)
        return {
          name: file.name,
          type: 'application/json',
          content: text,
          data: json,
          preview: `📋 JSON`
        }
      } catch {
        return {
          name: file.name,
          type: 'application/json',
          content: text,
          preview: `📋 JSON (invalid)`
        }
      }
    }

    // Handle text files
    if (['txt', 'md', 'xml', 'html'].includes(ext || '')) {
      const text = await file.text()
      return {
        name: file.name,
        type: file.type || 'text/plain',
        content: text,
        preview: `📄 ${text.length} chars`
      }
    }

    // Handle Word documents
    if (ext === 'docx' || ext === 'doc') {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      
      return {
        name: file.name,
        type: file.type,
        content: `Word Document: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`,
        data: { base64, size: file.size },
        preview: `📝 Word (${(file.size / 1024).toFixed(1)}KB)`
      }
    }

    // Default: read as text or base64
    try {
      const text = await file.text()
      return {
        name: file.name,
        type: file.type,
        content: text.slice(0, 10000),
        preview: `📄 ${file.name}`
      }
    } catch {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      return {
        name: file.name,
        type: file.type,
        content: `Binary file: ${file.name}`,
        data: { base64 },
        preview: `📦 Binary`
      }
    }
  }

  const sendFileToAI = (file: ParsedFile) => {
    onFileImport({
      name: file.name,
      content: file.content,
      type: file.type,
      data: file.data
    })
    onClose()
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Export functions
  const exportAsCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return
    
    const headers = Object.keys(data[0])
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n')
    
    downloadFile(csv, `${filename}.csv`, 'text/csv')
  }

  const exportAsJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2)
    downloadFile(json, `${filename}.json`, 'application/json')
  }

  const exportAsExcel = async (data: any[], filename: string) => {
    // Create a simple Excel-compatible XML (SpreadsheetML)
    const headers = Object.keys(data[0] || {})
    
    let xml = '<?xml version="1.0"?>\n'
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n'
    xml += '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n'
    xml += '  <Worksheet ss:Name="BOQ">\n'
    xml += '    <Table>\n'
    
    // Headers
    xml += '      <Row>\n'
    headers.forEach(h => {
      xml += `        <Cell><Data ss:Type="String">${h}</Data></Cell>\n`
    })
    xml += '      </Row>\n'
    
    // Data rows
    data.forEach(row => {
      xml += '      <Row>\n'
      headers.forEach(h => {
        const value = row[h]
        const type = typeof value === 'number' ? 'Number' : 'String'
        xml += `        <Cell><Data ss:Type="${type}">${value || ''}</Data></Cell>\n`
      })
      xml += '      </Row>\n'
    })
    
    xml += '    </Table>\n'
    xml += '  </Worksheet>\n'
    xml += '</Workbook>'
    
    downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel')
  }

  const exportAsPDF = (content: string, filename: string) => {
    // Create a simple printable HTML that can be saved as PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #4a90d9; color: white; }
          tr:nth-child(even) { background: #f9f9f9; }
          .header { text-align: center; margin-bottom: 30px; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 ${filename}</h1>
          <p>Generated by Basel Hub QS Engineer</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        ${content}
        <div class="footer">
          <p>Basel Hub QS Engineer Assistant - Dubai Construction</p>
        </div>
      </body>
      </html>
    `
    
    // Open in new window for printing/saving as PDF
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
      setTimeout(() => win.print(), 500)
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // BOQ Templates
  const boqTemplates = [
    { name: 'Villa BOQ Template', type: 'villa' },
    { name: 'Building BOQ Template', type: 'building' },
    { name: 'Fit-out BOQ Template', type: 'fitout' },
    { name: 'MEP BOQ Template', type: 'mep' },
    { name: 'Civil Works Template', type: 'civil' },
  ]

  const generateBOQTemplate = (type: string) => {
    const templates: Record<string, any[]> = {
      villa: [
        { item: '1', description: 'Site Clearance', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '2', description: 'Excavation', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '3', description: 'Plain Concrete C10', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '4', description: 'Reinforced Concrete C30', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '5', description: 'Reinforcement Steel', unit: 'ton', qty: '', rate: '', amount: '' },
        { item: '6', description: 'Block Work 200mm', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '7', description: 'Internal Plastering', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '8', description: 'External Plastering', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '9', description: 'Floor Tiling', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '10', description: 'Wall Tiling', unit: 'm²', qty: '', rate: '', amount: '' },
      ],
      building: [
        { item: '1', description: 'Piling Works', unit: 'nos', qty: '', rate: '', amount: '' },
        { item: '2', description: 'Raft Foundation', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '3', description: 'Columns', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '4', description: 'Beams', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '5', description: 'Slabs', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '6', description: 'Core Walls', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '7', description: 'Block Work', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '8', description: 'Facade System', unit: 'm²', qty: '', rate: '', amount: '' },
      ],
      fitout: [
        { item: '1', description: 'Demolition Works', unit: 'ls', qty: '', rate: '', amount: '' },
        { item: '2', description: 'Gypsum Partitions', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '3', description: 'Gypsum Ceiling', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '4', description: 'Painting', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '5', description: 'Floor Finishes', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '6', description: 'Joinery Works', unit: 'ls', qty: '', rate: '', amount: '' },
        { item: '7', description: 'MEP Modifications', unit: 'ls', qty: '', rate: '', amount: '' },
      ],
      mep: [
        { item: '1', description: 'HVAC System', unit: 'ls', qty: '', rate: '', amount: '' },
        { item: '2', description: 'Plumbing System', unit: 'ls', qty: '', rate: '', amount: '' },
        { item: '3', description: 'Electrical System', unit: 'ls', qty: '', rate: '', amount: '' },
        { item: '4', description: 'Fire Fighting System', unit: 'ls', qty: '', rate: '', amount: '' },
        { item: '5', description: 'Fire Alarm System', unit: 'ls', qty: '', rate: '', amount: '' },
        { item: '6', description: 'Low Current Systems', unit: 'ls', qty: '', rate: '', amount: '' },
      ],
      civil: [
        { item: '1', description: 'Site Preparation', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '2', description: 'Earthworks', unit: 'm³', qty: '', rate: '', amount: '' },
        { item: '3', description: 'Road Works', unit: 'm²', qty: '', rate: '', amount: '' },
        { item: '4', description: 'Storm Drainage', unit: 'lm', qty: '', rate: '', amount: '' },
        { item: '5', description: 'Sewage Network', unit: 'lm', qty: '', rate: '', amount: '' },
        { item: '6', description: 'Landscaping', unit: 'm²', qty: '', rate: '', amount: '' },
      ],
    }
    
    exportAsExcel(templates[type] || templates.villa, `${type}_boq_template`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">📁 QS File Manager</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('import')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'import' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📥 Import
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'export' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📤 Export
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.csv,.docx,.doc,.dwg,.dxf,.zip,.jpg,.jpeg,.png,.json,.txt,.xml"
                />
                <div className="text-4xl mb-2">📁</div>
                <p className="text-white font-medium mb-1">
                  {dragActive ? 'أفلت الملفات هنا' : 'اضغط أو اسحب الملفات هنا'}
                </p>
                <p className="text-gray-400 text-sm">
                  PDF, Excel, Word, CAD, Images, ZIP, CSV, JSON
                </p>
              </div>

              {/* Supported Types */}
              <div className="flex flex-wrap gap-2">
                {supportedTypes.slice(0, 10).map(type => (
                  <span key={type.ext} className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400">
                    {type.icon} {type.ext}
                  </span>
                ))}
              </div>

              {/* Processing */}
              {isProcessing && (
                <div className="text-center py-4">
                  <div className="animate-spin text-2xl mb-2">⏳</div>
                  <p className="text-gray-400">Processing files...</p>
                </div>
              )}

              {/* Imported Files */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-white font-medium">Imported Files ({files.length})</h3>
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{file.preview?.split(' ')[0] || '📄'}</span>
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">{file.preview}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sendFileToAI(file)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                        >
                          Send to AI
                        </button>
                        <button
                          onClick={() => removeFile(i)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* BOQ Templates */}
              <div>
                <h3 className="text-white font-medium mb-3">📋 BOQ Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  {boqTemplates.map(template => (
                    <button
                      key={template.type}
                      onClick={() => generateBOQTemplate(template.type)}
                      className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-all"
                    >
                      <div className="text-2xl mb-1">📊</div>
                      <p className="text-white font-medium">{template.name}</p>
                      <p className="text-gray-400 text-sm">Download Excel template</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Formats */}
              <div>
                <h3 className="text-white font-medium mb-3">📤 Export Formats</h3>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => exportData && exportAsExcel(exportData, 'boq_export')}
                    className="p-4 bg-green-800/50 hover:bg-green-700/50 rounded-lg text-center"
                  >
                    <div className="text-2xl mb-1">📊</div>
                    <p className="text-white text-sm">Excel</p>
                  </button>
                  <button
                    onClick={() => exportData && exportAsCSV(exportData, 'boq_export')}
                    className="p-4 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg text-center"
                  >
                    <div className="text-2xl mb-1">📋</div>
                    <p className="text-white text-sm">CSV</p>
                  </button>
                  <button
                    onClick={() => exportData && exportAsJSON(exportData, 'boq_export')}
                    className="p-4 bg-purple-800/50 hover:bg-purple-700/50 rounded-lg text-center"
                  >
                    <div className="text-2xl mb-1">📄</div>
                    <p className="text-white text-sm">JSON</p>
                  </button>
                  <button
                    onClick={() => exportAsPDF('<p>BOQ Data will appear here</p>', 'boq_export')}
                    className="p-4 bg-red-800/50 hover:bg-red-700/50 rounded-lg text-center"
                  >
                    <div className="text-2xl mb-1">📑</div>
                    <p className="text-white text-sm">PDF</p>
                  </button>
                </div>
              </div>

              {/* Dubai Resources */}
              <div>
                <h3 className="text-white font-medium mb-3">🏗️ Dubai Resources</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://www.dm.gov.ae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-3"
                  >
                    <span className="text-xl">🏛️</span>
                    <span className="text-white">Dubai Municipality</span>
                  </a>
                  <a
                    href="https://www.dewa.gov.ae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-3"
                  >
                    <span className="text-xl">⚡</span>
                    <span className="text-white">DEWA</span>
                  </a>
                  <a
                    href="https://www.dcd.gov.ae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-3"
                  >
                    <span className="text-xl">🔥</span>
                    <span className="text-white">Civil Defense</span>
                  </a>
                  <a
                    href="https://www.rera.gov.ae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-3"
                  >
                    <span className="text-xl">🏢</span>
                    <span className="text-white">RERA</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
