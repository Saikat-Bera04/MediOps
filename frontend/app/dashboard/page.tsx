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
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Trash2, Users, Stethoscope, Building2, Activity } from "lucide-react"
import { getDocuments, deleteDocument, type Document } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Hospital: St. Aurora General Hospital Data
const departmentStaffData = [
  { department: "Cardiology", doctors: 6, nurses: 12 },
  { department: "Neurology", doctors: 5, nurses: 10 },
  { department: "Orthopedics", doctors: 7, nurses: 14 },
  { department: "Pediatrics", doctors: 8, nurses: 16 },
  { department: "General Medicine", doctors: 10, nurses: 20 },
  { department: "Surgery", doctors: 6, nurses: 14 },
]

const medicineInventoryData = [
  { month: "Jan", inStock: 450, reorderLevel: 200, consumed: 380 },
  { month: "Feb", inStock: 420, reorderLevel: 200, consumed: 410 },
  { month: "Mar", inStock: 480, reorderLevel: 200, consumed: 390 },
  { month: "Apr", inStock: 510, reorderLevel: 200, consumed: 370 },
  { month: "May", inStock: 490, reorderLevel: 200, consumed: 400 },
  { month: "Jun", inStock: 530, reorderLevel: 200, consumed: 360 },
]

const patientFlowData = [
  { day: "Mon", opd: 120, emergency: 35, admission: 18 },
  { day: "Tue", opd: 135, emergency: 28, admission: 15 },
  { day: "Wed", opd: 128, emergency: 42, admission: 22 },
  { day: "Thu", opd: 142, emergency: 31, admission: 19 },
  { day: "Fri", opd: 156, emergency: 38, admission: 21 },
  { day: "Sat", opd: 98, emergency: 45, admission: 25 },
  { day: "Sun", opd: 76, emergency: 52, admission: 28 },
]

const equipmentStatusData = [
  { equipment: "MRI Scanner", status: "Under Maintenance", technician: "Ms. N. Iyer", priority: "high" },
  { equipment: "CT Scanner", status: "Operational", technician: "Mr. K. Sharma", priority: "low" },
  { equipment: "X-Ray Machine 1", status: "Operational", technician: "Ms. P. Singh", priority: "low" },
  { equipment: "Ventilator 3", status: "Under Repair", technician: "Mr. R. Patel", priority: "critical" },
  { equipment: "ECG Machine 2", status: "Operational", technician: "Ms. S. Kumar", priority: "low" },
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
          <h1 className="text-4xl font-bold text-foreground mb-2">St. Aurora General Hospital</h1>
          <p className="text-muted-foreground">
            123 Health Ave, Wellness City, 560001 • +91-80-1234-5678 • info@staurora.org
          </p>
        </div>

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">184</div>
              <p className="text-xs text-muted-foreground mt-1">42 Doctors • 86 Nurses • 56 Support</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
                <Building2 className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">8</div>
              <p className="text-xs text-muted-foreground mt-1">All departments operational</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today's OPD</CardTitle>
                <Stethoscope className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">142</div>
              <p className="text-xs text-muted-foreground mt-1">31 Emergency • 19 Admissions</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Equipment Status</CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">3</div>
              <p className="text-xs text-destructive mt-1">Under maintenance/repair</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Department Staff Distribution */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Department Staff Distribution</CardTitle>
              <CardDescription>Doctors and nurses across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStaffData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="department" stroke="var(--color-muted-foreground)" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="doctors" fill="var(--color-primary)" name="Doctors" />
                  <Bar dataKey="nurses" fill="var(--color-accent)" name="Nurses & Support" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Medicine Inventory Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Medicine Inventory Trends</CardTitle>
              <CardDescription>Stock levels and consumption patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={medicineInventoryData}>
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
                  <Line type="monotone" dataKey="inStock" stroke="var(--color-primary)" strokeWidth={2} name="In Stock" />
                  <Line type="monotone" dataKey="reorderLevel" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Reorder Level" />
                  <Line type="monotone" dataKey="consumed" stroke="var(--color-accent)" strokeWidth={2} name="Consumed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Patient Flow Chart */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Weekly Patient Flow</CardTitle>
            <CardDescription>OPD, Emergency, and Admission trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={patientFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
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
                  dataKey="opd"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="OPD"
                />
                <Area
                  type="monotone"
                  dataKey="emergency"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Emergency"
                />
                <Area
                  type="monotone"
                  dataKey="admission"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Admissions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Equipment Status & Maintenance</CardTitle>
            <CardDescription>Current operational status of hospital equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipmentStatusData.map((equipment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{equipment.equipment}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assigned to: {equipment.technician}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        equipment.status === "Operational"
                          ? "bg-green-500/20 text-green-600"
                          : equipment.priority === "critical"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-orange-500/20 text-orange-600"
                      }`}
                    >
                      {equipment.status}
                    </span>
                    {equipment.priority !== "low" && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          equipment.priority === "critical"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {equipment.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Important Guidelines & Notes</CardTitle>
            <CardDescription>Hospital operational guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Medicine Reorder:</span> All medicine reorder requests must be raised 30 days before reaching reorder level.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Visiting Hours:</span> General wards: 10:00 - 12:00, 17:00 - 19:00. ICU: Restricted access, contact duty nurse.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Emergency Contacts:</span> Ambulance 1: +91-80-9876-5432 (Available 24x7) • Senior Nurse On-Call: Ms. T. Rao
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processed Documents */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Processed Medical Documents</CardTitle>
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
