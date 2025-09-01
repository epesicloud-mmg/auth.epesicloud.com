import { useQuery } from "@tanstack/react-query";
import { Plus, Users, Activity, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Client, DashboardStats } from "@shared/schema";

export default function DashboardOverview() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/admin/clients"],
  });

  return (
    <section id="dashboard" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Administrative Dashboard</h2>
          <p className="text-lg text-gray-600">Manage clients, monitor transactions, and configure security settings</p>
        </div>
        
        {/* Dashboard Mock */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Dashboard Overview</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="default">Today</Button>
                <Button size="sm" variant="ghost">This Week</Button>
                <Button size="sm" variant="ghost">This Month</Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Active Clients</p>
                    <p className="text-2xl font-bold text-blue-900">{stats?.activeClients || 0}</p>
                  </div>
                  <Users className="text-blue-500 text-xl" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Transactions Today</p>
                    <p className="text-2xl font-bold text-green-900">{stats?.transactionsToday || 0}</p>
                  </div>
                  <Activity className="text-green-500 text-xl" />
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Success Rate</p>
                    <p className="text-2xl font-bold text-purple-900">{stats?.successRate || "0%"}</p>
                  </div>
                  <CheckCircle className="text-purple-500 text-xl" />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Avg Response</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats?.avgResponse || "0ms"}</p>
                  </div>
                  <Clock className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Recent Clients Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Recent Clients</h4>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Client
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients && clients.length > 0 ? (
                      clients.slice(0, 3).map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-sm font-mono text-gray-900">{client.clientId}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={client.scope === "initiate_transaction" ? "default" : "secondary"}>
                              {client.scope}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={client.isActive ? "default" : "destructive"}>
                              {client.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.lastActivity 
                              ? new Date(client.lastActivity).toLocaleDateString()
                              : "Never"
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm" className="mr-3">Edit</Button>
                            <Button variant="ghost" size="sm">Revoke</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No clients found. Create your first client to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
