import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Plus, ArrowLeft, Users, Activity, CheckCircle, Clock, Edit, Trash2, Copy, FileText, TestTube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Client, DashboardStats, Transaction } from "@shared/schema";
import ClientForm from "@/components/client-form";

export default function Dashboard() {
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClientCredentials, setNewClientCredentials] = useState<Client | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: clients, isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/admin/clients"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    },
  });

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientDialogOpen(true);
  };

  const handleDeleteClient = (id: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
      deleteClientMutation.mutate(id);
    }
  };

  const handleClientFormSuccess = (newClient?: Client) => {
    setIsClientDialogOpen(false);
    setEditingClient(null);
    
    // If a new client was created, show the credentials dialog
    if (newClient && !editingClient) {
      setNewClientCredentials(newClient);
      setShowCredentialsDialog(true);
    }
    
    queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/api-docs">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </Link>
              <Link href="/test-wizard">
                <Button variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test API Flow
                </Button>
              </Link>
              <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingClient(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingClient ? "Edit Client" : "Create New Client"}
                  </DialogTitle>
                </DialogHeader>
                <ClientForm
                  client={editingClient}
                  onSuccess={handleClientFormSuccess}
                />
              </DialogContent>
              </Dialog>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Clients</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {statsLoading ? "..." : stats?.activeClients || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Transactions Today</p>
                  <p className="text-2xl font-bold text-green-900">
                    {statsLoading ? "..." : stats?.transactionsToday || 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {statsLoading ? "..." : stats?.successRate || "0%"}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Avg Response</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {statsLoading ? "..." : stats?.avgResponse || "0ms"}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {clientsLoading ? (
              <div className="text-center py-8">Loading clients...</div>
            ) : !clients || clients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No clients found. Create your first client to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Client Secret</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono">{client.clientId}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(client.clientId, "Client ID")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono text-gray-400">
                            Hidden for security
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(client.clientSecret, "Client Secret")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>
                        <Badge variant={client.scope === "initiate_transaction" ? "default" : "secondary"}>
                          {client.scope}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.isActive ? "default" : "destructive"}>
                          {client.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {client.lastActivity 
                          ? new Date(client.lastActivity).toLocaleDateString()
                          : "Never"
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                            disabled={deleteClientMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction Token</TableHead>
                    <TableHead>Initiator</TableHead>
                    <TableHead>Executor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <code className="text-sm font-mono">
                          {transaction.transactionToken.substring(0, 16)}...
                        </code>
                      </TableCell>
                      <TableCell>{transaction.initiatorClientId}</TableCell>
                      <TableCell>{transaction.executorClientId || "N/A"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === "completed" ? "default" :
                            transaction.status === "failed" ? "destructive" :
                            "secondary"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Credentials Dialog */}
        <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Client Credentials Created</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Save these credentials securely. The client secret will not be shown again.
                </p>
              </div>
              
              {newClientCredentials && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-client-id">Client ID</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="new-client-id"
                        value={newClientCredentials.clientId}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(newClientCredentials.clientId, "Client ID")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-client-secret">Client Secret</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="new-client-secret"
                        value={newClientCredentials.clientSecret}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(newClientCredentials.clientSecret, "Client Secret")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Example Usage</h4>
                    <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                      <pre className="text-sm text-gray-100 font-mono">
{`curl -X POST /api/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "${newClientCredentials.clientId}",
    "client_secret": "${newClientCredentials.clientSecret}",
    "scope": "${newClientCredentials.scope}"
  }'`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={() => {
                  setShowCredentialsDialog(false);
                  setNewClientCredentials(null);
                }}>
                  I've Saved the Credentials
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </div>
  );
}
