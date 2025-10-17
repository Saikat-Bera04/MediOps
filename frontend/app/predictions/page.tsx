"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const predictionData = [
  { region: "North", volume: 450, staffing: 85, supplies: 92 },
  { region: "South", volume: 380, staffing: 78, supplies: 88 },
  { region: "East", volume: 520, staffing: 90, supplies: 95 },
  { region: "West", volume: 410, staffing: 82, supplies: 85 },
]

export default function Predictions() {
  const [selectedRegion, setSelectedRegion] = useState("North")
  const [timeRange, setTimeRange] = useState("7days")
  const [dataType, setDataType] = useState("all")

  const selectedData = predictionData.find((d) => d.region === selectedRegion)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Predictions & Analytics</h1>
          <p className="text-muted-foreground">AI-powered forecasting for healthcare resource management</p>
        </div>

        {/* Input Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Select Region / City</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {predictionData.map((d) => (
                  <option key={d.region} value={d.region}>
                    {d.region}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Time Range</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="7days">Next 7 Days</option>
                <option value="30days">Next 30 Days</option>
                <option value="90days">Next 90 Days</option>
              </select>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Data Type</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Data</option>
                <option value="festival">Festival</option>
                <option value="pollution">Pollution</option>
                <option value="epidemic">Epidemic</option>
              </select>
            </CardContent>
          </Card>
        </div>

        {/* Predicted Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Patient Volume Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{selectedData?.volume}</div>
              <p className="text-xs text-muted-foreground mt-1">Expected patients in {timeRange}</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Staffing Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{selectedData?.staffing}%</div>
              <p className="text-xs text-muted-foreground mt-1">Optimal staffing level</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Supply Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{selectedData?.supplies}%</div>
              <p className="text-xs text-muted-foreground mt-1">Current supply level</p>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Chart */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Regional Predictions</CardTitle>
            <CardDescription>Comparative analysis across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="region" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="volume" fill="var(--color-primary)" />
                <Bar dataKey="staffing" fill="var(--color-accent)" />
                <Bar dataKey="supplies" fill="var(--color-chart-3)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Advisory Generator */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>AI Advisory Generator</CardTitle>
            <CardDescription>Preventive measures for {selectedRegion} region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">For Patients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Maintain regular health check-ups during peak seasons</li>
                    <li>Follow air quality alerts and use masks when necessary</li>
                    <li>Stay updated on epidemic prevention guidelines</li>
                    <li>Keep emergency contact information readily available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">For Staff:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Prepare for increased patient volume in {timeRange}</li>
                    <li>Ensure adequate PPE stock levels</li>
                    <li>Schedule staff rotations based on predicted demand</li>
                    <li>Conduct training sessions on emergency protocols</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
