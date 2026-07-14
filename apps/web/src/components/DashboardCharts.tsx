"use client";

import { useQuery } from "@tanstack/react-query";
import { getPolicies, getClaims } from "@insurance/lib";
import { Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export function DashboardCharts() {
  const { data: policies } = useQuery({ queryKey: ["policies"], queryFn: () => getPolicies() });
  const { data: claims } = useQuery({ queryKey: ["claims"], queryFn: () => getClaims() });

  const lobCounts = ["Health", "Motor", "General"].map((lob) => ({
    name: lob,
    count: (policies || []).filter((p) => p.lob === lob).length
  }));

  const claimStatus = ["Pending", "Approved", "Rejected", "Settled"].map((status) => ({
    name: status,
    value: (claims || []).filter((c) => c.status === status).length
  }));

  const revenue = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 19000 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 25000 },
    { month: "Jun", revenue: 21000 }
  ];

  const monthlyClaims = [
    { month: "Jan", claims: 12 },
    { month: "Feb", claims: 18 },
    { month: "Mar", claims: 15 },
    { month: "Apr", claims: 22 },
    { month: "May", claims: 19 },
    { month: "Jun", claims: 24 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Policies by LOB</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lobCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Claims Status</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={claimStatus} dataKey="value" nameKey="name" outerRadius={80} label>
                {claimStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Monthly Claims</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyClaims}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="claims" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
