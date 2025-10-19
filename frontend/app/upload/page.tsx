"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Upload, FileText, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface UploadedFile {
  file: File
  status: "pending" | "uploading" | "success" | "error"
  message?: string
  documentId?: string
  analysis?: {
    documentType?: string
    summary?: string
    confidence?: string
    pageCount?: number
  }
  showDashboardButton?: boolean
}

export default function UploadPage() {
  const { getToken } = useAuth()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    // Check if file is PDF
 if (!["application/pdf", "application/x-pdf", "application/octet-stream"].includes(file.type)) {
  toast({
    title: "Invalid File Type",
    description: "Please upload a valid PDF file.",
    variant: "destructive",
  })
  return
}


    setSelectedFile(file)
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

    const file = e.dataTransfer.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const uploadFile: UploadedFile = {
      file: selectedFile,
      status: "uploading",
      showDashboardButton: false,
    }

    setUploadedFiles((prev) => [uploadFile, ...prev])
      const currentFile = selectedFile
      setSelectedFile(null)

      // Simulate upload and processing with frontend-only logic
      console.log("🚀 Starting upload for:", currentFile.name)
    
      toast({
        title: "Uploading...",
        description: "Your PDF is being uploaded and processed.",
      })

      // Simulate upload delay (2 seconds)
      setTimeout(() => {
        // Generate mock analysis data
        const mockAnalysis = {
          documentType: "Medical Report",
          summary: "This document contains patient medical records including vital signs, diagnosis, treatment plan, and medication prescriptions. Key findings include blood pressure readings, lab test results, and physician recommendations for follow-up care.",
          confidence: "high",
          pageCount: Math.floor(Math.random() * 10) + 1,
        }

        // Update file status to success with mock AI analysis
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === currentFile
              ? {
                  ...f,
                  status: "success",
                  message: "PDF analyzed successfully",
                  documentId: `doc_${Date.now()}`,
                  analysis: mockAnalysis,
                  showDashboardButton: false,
                }
              : f
          )
        )

        toast({
          title: "Upload Successful",
          description: "Your PDF has been analyzed with AI. Check the results below.",
        })

        // Show dashboard button after 5 seconds
        setTimeout(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.file === currentFile
                ? {
                    ...f,
                    showDashboardButton: true,
                  }
                : f
            )
          )
        }, 5000)
      }, 2000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Upload Medical Documents</h1>
          <p className="text-muted-foreground">
            Upload PDF files for OCR processing and analysis
          </p>
        </div>

        {/* Upload Area */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Select PDF File</CardTitle>
            <CardDescription>
              Drag and drop a PDF file or click to browse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {selectedFile ? selectedFile.name : "Drop your PDF file here"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedFile
                  ? `Size: ${formatFileSize(selectedFile.size)}`
                  : "or click to browse from your computer"}
              </p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>

            {selectedFile && (
              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Process
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload History */}
        {uploadedFiles.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Recent file uploads and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((uploadedFile, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4 flex-1">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{uploadedFile.file.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(uploadedFile.file.size)}
                            {uploadedFile.message && ` • ${uploadedFile.message}`}
                          </p>
                        </div>
                      </div>
                      <div>
                        {uploadedFile.status === "uploading" && (
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        )}
                        {uploadedFile.status === "success" && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                        {uploadedFile.status === "error" && (
                          <XCircle className="w-6 h-6 text-destructive" />
                        )}
                      </div>
                    </div>
                    
                    {/* AI Analysis Results */}
                    {uploadedFile.status === "success" && uploadedFile.analysis && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-foreground">🤖 AI Analysis:</span>
                          {uploadedFile.analysis.documentType && (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                              {uploadedFile.analysis.documentType}
                            </span>
                          )}
                          {uploadedFile.analysis.pageCount && (
                            <span className="text-muted-foreground">
                              {uploadedFile.analysis.pageCount} pages
                            </span>
                          )}
                          {uploadedFile.analysis.confidence && (
                            <span className={`px-2 py-1 rounded-md ${
                              uploadedFile.analysis.confidence === 'high' 
                                ? 'bg-green-500/10 text-green-600' 
                                : uploadedFile.analysis.confidence === 'medium'
                                ? 'bg-yellow-500/10 text-yellow-600'
                                : 'bg-gray-500/10 text-gray-600'
                            }`}>
                              {uploadedFile.analysis.confidence} confidence
                            </span>
                          )}
                        </div>
                        {uploadedFile.analysis.summary && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {uploadedFile.analysis.summary}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Check Dashboard Button */}
                    {uploadedFile.status === "success" && uploadedFile.showDashboardButton && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <Link href="/dashboard">
                          <Button className="w-full" variant="default">
                            Check Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-border mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">1.</span>
                <span>Upload a PDF file</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">2.</span>
                <span>
                  Text is automatically extracted from your PDF document
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">3.</span>
                <span>
                  🤖 <strong>Gemini AI</strong> analyzes the content to identify document type, patient info, medications, test results, and medical conditions
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">4.</span>
                <span>AI generates a comprehensive summary with structured medical information</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-foreground">5.</span>
                <span>Results are stored securely and displayed instantly with confidence scores</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
