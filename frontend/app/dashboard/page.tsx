"use client"
import { useState, useEffect } from "react"
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
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}. Here's your healthcare overview.
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
        <Card className="border-border">
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
      </div>
    </div>
  )
}
