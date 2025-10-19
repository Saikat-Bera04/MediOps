"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Trash2 } from "lucide-react"
import { getDocuments, deleteDocument, type Document } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const patientVolumeData = [
  { month: "Jan", predicted: 450, actual: 420 },
  { month: "Feb", predicted: 520, actual: 510 },
  { month: "Mar", predicted: 480, actual: 490 },
  { month: "Apr", predicted: 610, actual: 600 },
  { month: "May", predicted: 700, actual: 720 },
  { month: "Jun", predicted: 750, actual: 740 },
]

const airQualityData = [
  { month: "Jan", airQuality: 65, respiratoryCases: 120 },
  { month: "Feb", airQuality: 58, respiratoryCases: 135 },
  { month: "Mar", airQuality: 72, respiratoryCases: 95 },
  { month: "Apr", airQuality: 68, respiratoryCases: 110 },
  { month: "May", airQuality: 75, respiratoryCases: 85 },
  { month: "Jun", airQuality: 80, respiratoryCases: 70 },
]

const alertsData = [
  { type: "Festival", count: 3, severity: "high" },
  { type: "Pollution", count: 5, severity: "medium" },
  { type: "Epidemic", count: 1, severity: "critical" },
]

export default function Dashboard() {
  const { getToken, isLoaded, userId } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && userId) {
      fetchDocuments()
    }
  }, [isLoaded, userId])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      if (!token) return

      const response = await getDocuments(token, { limit: 10 })
      if (response.success && response.data) {
        setDocuments(response.data.documents)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      setDeleting(documentId)
      const token = await getToken()
      if (!token) return

      const response = await deleteDocument(token, documentId)
      if (response.success) {
        setDocuments((prev) => prev.filter((doc) => doc._id !== documentId))
        toast({
          title: "Success",
          description: "Document deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your healthcare overview and document processing status.
          </p>
        </div>

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bed Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">87%</div>
              <p className="text-xs text-muted-foreground mt-1">+5% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">156</div>
              <p className="text-xs text-muted-foreground mt-1">12 on leave</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Supply Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">92%</div>
              <p className="text-xs text-muted-foreground mt-1">Masks, Oxygen, Medicines</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">9</div>
              <p className="text-xs text-muted-foreground mt-1">Festival, Pollution, Epidemic</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Volume Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Patient Volume Forecast</CardTitle>
              <CardDescription>Predicted vs Actual patient volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="predicted" stroke="var(--color-primary)" strokeWidth={2} />
                  <Line type="monotone" dataKey="actual" stroke="var(--color-accent)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Air Quality Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Air Quality vs Respiratory Cases</CardTitle>
              <CardDescription>Monthly correlation analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={airQualityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="airQuality"
                    fill="var(--color-primary)"
                    stroke="var(--color-primary)"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="respiratoryCases"
                    fill="var(--color-accent)"
                    stroke="var(--color-accent)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>Current health and environmental alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertsData.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{alert.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {alert.count} active alert{alert.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.severity === "critical"
                        ? "bg-destructive/20 text-destructive"
                        : alert.severity === "high"
                          ? "bg-orange-500/20 text-orange-600"
                          : "bg-yellow-500/20 text-yellow-600"
                    }`}
                  >
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Processed Documents */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Processed Documents</CardTitle>
            <CardDescription>
              PDF documents processed with OCR and extracted medical data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your first PDF document to get started
                </p>
                <Button asChild>
                  <a href="/upload">Upload Document</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <FileText className="w-8 h-8 text-primary mt-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{doc.fileName}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>•</span>
                            <span>{formatDate(doc.createdAt)}</span>
                            {doc.metadata.pageCount && (
                              <>
                                <span>•</span>
                                <span>{doc.metadata.pageCount} pages</span>
                              </>
                            )}
                          </div>
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                doc.processingStatus === "completed"
                                  ? "bg-green-500/20 text-green-600"
                                  : doc.processingStatus === "processing"
                                    ? "bg-blue-500/20 text-blue-600"
                                    : doc.processingStatus === "failed"
                                      ? "bg-destructive/20 text-destructive"
                                      : "bg-yellow-500/20 text-yellow-600"
                              }`}
                            >
                              {doc.processingStatus === "completed" && `✓ Completed (${doc.ocrConfidence}% confidence)`}
                              {doc.processingStatus === "processing" && "⏳ Processing..."}
                              {doc.processingStatus === "failed" && "✗ Failed"}
                              {doc.processingStatus === "pending" && "⏸ Pending"}
                            </span>
                          </div>
                          {doc.processingStatus === "completed" && doc.extractedData && (
                            <div className="mt-3 p-3 bg-background rounded border border-border">
                              <p className="text-xs font-semibold text-foreground mb-2">
                                Extracted Information:
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {doc.extractedData.medicalTerms?.length > 0 && (
                                  <div>
                                    <span className="text-muted-foreground">Medical Terms:</span>
                                    <span className="ml-1 font-medium">
                                      {doc.extractedData.medicalTerms.slice(0, 3).join(", ")}
                                      {doc.extractedData.medicalTerms.length > 3 && "..."}
                                    </span>
                                  </div>
                                )}
                                {doc.extractedData.dates?.length > 0 && (
                                  <div>
                                    <span className="text-muted-foreground">Dates Found:</span>
                                    <span className="ml-1 font-medium">
                                      {doc.extractedData.dates.length}
                                    </span>
                                  </div>
                                )}
                                {doc.extractedData.emails?.length > 0 && (
                                  <div>
                                    <span className="text-muted-foreground">Emails:</span>
                                    <span className="ml-1 font-medium">
                                      {doc.extractedData.emails.length}
                                    </span>
                                  </div>
                                )}
                                {doc.extractedData.phones?.length > 0 && (
                                  <div>
                                    <span className="text-muted-foreground">Phone Numbers:</span>
                                    <span className="ml-1 font-medium">
                                      {doc.extractedData.phones.length}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {doc.ocrText && (
                                <div className="mt-2 pt-2 border-t border-border">
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {doc.ocrText.substring(0, 200)}
                                    {doc.ocrText.length > 200 && "..."}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          {doc.processingStatus === "failed" && doc.errorMessage && (
                            <p className="mt-2 text-xs text-destructive">{doc.errorMessage}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc._id)}
                        disabled={deleting === doc._id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {deleting === doc._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
