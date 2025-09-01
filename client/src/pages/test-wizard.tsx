import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Copy, Play, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Client } from "@shared/schema";

interface StepResult {
  success: boolean;
  data?: any;
  error?: string;
}

export default function TestWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [initiatorClient, setInitiatorClient] = useState<string>("");
  const [executorClient, setExecutorClient] = useState<string>("");
  const [stepResults, setStepResults] = useState<Record<number, StepResult>>({});
  const [transactionData, setTransactionData] = useState('{"amount": 100, "currency": "USD", "description": "Test transaction"}');
  const { toast } = useToast();

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/admin/clients"],
  });

  const initiatorClients = clients?.filter(c => c.scope === "initiate_transaction" && c.isActive) || [];
  const executorClients = clients?.filter(c => c.scope === "execute_transaction" && c.isActive) || [];

  const steps = [
    { id: 1, title: "Setup", description: "Select initiator and executor clients" },
    { id: 2, title: "Initiator Auth", description: "Authenticate initiator client" },
    { id: 3, title: "Transaction Init", description: "Generate transaction token" },
    { id: 4, title: "Executor Auth", description: "Authenticate executor client" },
    { id: 5, title: "Token Validation", description: "Validate transaction token" },
    { id: 6, title: "Complete", description: "Transaction flow complete" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Request copied to clipboard",
    });
  };

  const executeRequest = async (stepId: number, endpoint: string, method: string, body?: any, headers?: Record<string, string>) => {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const data = await response.json();
      
      if (!response.ok) {
        setStepResults(prev => ({
          ...prev,
          [stepId]: { success: false, error: data.error || 'Request failed' }
        }));
        return;
      }

      setStepResults(prev => ({
        ...prev,
        [stepId]: { success: true, data }
      }));
    } catch (error: any) {
      setStepResults(prev => ({
        ...prev,
        [stepId]: { success: false, error: error.message }
      }));
    }
  };

  const executeStep2 = () => {
    const client = clients?.find(c => c.clientId === initiatorClient);
    if (!client) return;

    executeRequest(2, '/oauth/token', 'POST', {
      grant_type: 'client_credentials',
      client_id: client.clientId,
      client_secret: client.clientSecret,
      scope: 'initiate_transaction'
    });
  };

  const executeStep3 = () => {
    const accessToken = stepResults[2]?.data?.access_token;
    if (!accessToken) return;

    executeRequest(3, '/transaction/initiate', 'POST', {
      client_id: initiatorClient
    }, {
      'Authorization': `Bearer ${accessToken}`
    });
  };

  const executeStep4 = () => {
    const client = clients?.find(c => c.clientId === executorClient);
    if (!client) return;

    executeRequest(4, '/oauth/token', 'POST', {
      grant_type: 'client_credentials',
      client_id: client.clientId,
      client_secret: client.clientSecret,
      scope: 'execute_transaction'
    });
  };

  const executeStep5 = () => {
    const accessToken = stepResults[4]?.data?.access_token;
    const transactionToken = stepResults[3]?.data?.transaction_token;
    if (!accessToken || !transactionToken) return;

    executeRequest(5, '/transaction/validate', 'POST', {
      transaction_token: transactionToken
    }, {
      'Authorization': `Bearer ${accessToken}`
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="initiator">Initiator Client (initiate_transaction scope)</Label>
              <Select value={initiatorClient} onValueChange={setInitiatorClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select initiator client" />
                </SelectTrigger>
                <SelectContent>
                  {initiatorClients.map(client => (
                    <SelectItem key={client.id} value={client.clientId}>
                      {client.name} ({client.clientId.substring(0, 8)}...)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {initiatorClients.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No active initiator clients found. Create a client with 'initiate_transaction' scope.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="executor">Executor Client (execute_transaction scope)</Label>
              <Select value={executorClient} onValueChange={setExecutorClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select executor client" />
                </SelectTrigger>
                <SelectContent>
                  {executorClients.map(client => (
                    <SelectItem key={client.id} value={client.clientId}>
                      {client.name} ({client.clientId.substring(0, 8)}...)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {executorClients.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No active executor clients found. Create a client with 'execute_transaction' scope.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="transaction-data">Transaction Data (JSON)</Label>
              <Textarea
                id="transaction-data"
                value={transactionData}
                onChange={(e) => setTransactionData(e.target.value)}
                placeholder="Enter transaction data"
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        const initiatorClientData = clients?.find(c => c.clientId === initiatorClient);
        const step2Request = {
          grant_type: 'client_credentials',
          client_id: initiatorClient,
          client_secret: initiatorClientData?.clientSecret,
          scope: 'initiate_transaction'
        };

        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Step 2: Initiator Authentication</h4>
              <p className="text-sm text-blue-800">
                The initiator client authenticates with the OAuth server to get an access token.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Request</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`curl -X POST /api/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(step2Request, null, 2)}'`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy cURL
                </Button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <span className="text-green-400">POST</span> /api/oauth/token
                  {'\n'}
                  <span className="text-yellow-400">Content-Type:</span> application/json
                  {'\n\n'}
                  {JSON.stringify(step2Request, null, 2)}
                </pre>
              </div>
            </div>

            {stepResults[2] && (
              <div className={`p-4 rounded-lg border ${stepResults[2].success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${stepResults[2].success ? 'text-green-900' : 'text-red-900'}`}>
                  Response
                </h4>
                <pre className="text-sm">
                  {JSON.stringify(stepResults[2].success ? stepResults[2].data : { error: stepResults[2].error }, null, 2)}
                </pre>
              </div>
            )}

            <Button onClick={executeStep2} disabled={!initiatorClient}>
              <Play className="h-4 w-4 mr-2" />
              Execute Request
            </Button>
          </div>
        );

      case 3:
        const step3Request = {
          client_id: initiatorClient
        };

        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Step 3: Transaction Initiation</h4>
              <p className="text-sm text-blue-800">
                Using the access token, request a transaction token for secure processing.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Request</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`curl -X POST /api/transaction/initiate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${stepResults[2]?.data?.access_token || '<access_token>'}" \\
  -d '${JSON.stringify(step3Request, null, 2)}'`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy cURL
                </Button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <span className="text-green-400">POST</span> /api/transaction/initiate
                  {'\n'}
                  <span className="text-yellow-400">Content-Type:</span> application/json
                  {'\n'}
                  <span className="text-yellow-400">Authorization:</span> Bearer {stepResults[2]?.data?.access_token || '<access_token>'}
                  {'\n\n'}
                  {JSON.stringify(step3Request, null, 2)}
                </pre>
              </div>
            </div>

            {stepResults[3] && (
              <div className={`p-4 rounded-lg border ${stepResults[3].success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${stepResults[3].success ? 'text-green-900' : 'text-red-900'}`}>
                  Response
                </h4>
                <pre className="text-sm">
                  {JSON.stringify(stepResults[3].success ? stepResults[3].data : { error: stepResults[3].error }, null, 2)}
                </pre>
              </div>
            )}

            <Button onClick={executeStep3} disabled={!stepResults[2]?.success}>
              <Play className="h-4 w-4 mr-2" />
              Execute Request
            </Button>
          </div>
        );

      case 4:
        const executorClientData = clients?.find(c => c.clientId === executorClient);
        const step4Request = {
          grant_type: 'client_credentials',
          client_id: executorClient,
          client_secret: executorClientData?.clientSecret,
          scope: 'execute_transaction'
        };

        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Step 4: Executor Authentication</h4>
              <p className="text-sm text-blue-800">
                The executor client authenticates to validate transaction tokens.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Request</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`curl -X POST /api/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(step4Request, null, 2)}'`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy cURL
                </Button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <span className="text-green-400">POST</span> /api/oauth/token
                  {'\n'}
                  <span className="text-yellow-400">Content-Type:</span> application/json
                  {'\n\n'}
                  {JSON.stringify(step4Request, null, 2)}
                </pre>
              </div>
            </div>

            {stepResults[4] && (
              <div className={`p-4 rounded-lg border ${stepResults[4].success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${stepResults[4].success ? 'text-green-900' : 'text-red-900'}`}>
                  Response
                </h4>
                <pre className="text-sm">
                  {JSON.stringify(stepResults[4].success ? stepResults[4].data : { error: stepResults[4].error }, null, 2)}
                </pre>
              </div>
            )}

            <Button onClick={executeStep4} disabled={!executorClient}>
              <Play className="h-4 w-4 mr-2" />
              Execute Request
            </Button>
          </div>
        );

      case 5:
        const step5Request = {
          transaction_token: stepResults[3]?.data?.transaction_token
        };

        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Step 5: Transaction Token Validation</h4>
              <p className="text-sm text-blue-800">
                The executor validates the transaction token and marks it as used.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Request</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`curl -X POST /api/transaction/validate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${stepResults[4]?.data?.access_token || '<access_token>'}" \\
  -d '${JSON.stringify(step5Request, null, 2)}'`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy cURL
                </Button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <span className="text-green-400">POST</span> /api/transaction/validate
                  {'\n'}
                  <span className="text-yellow-400">Content-Type:</span> application/json
                  {'\n'}
                  <span className="text-yellow-400">Authorization:</span> Bearer {stepResults[4]?.data?.access_token || '<access_token>'}
                  {'\n\n'}
                  {JSON.stringify(step5Request, null, 2)}
                </pre>
              </div>
            </div>

            {stepResults[5] && (
              <div className={`p-4 rounded-lg border ${stepResults[5].success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${stepResults[5].success ? 'text-green-900' : 'text-red-900'}`}>
                  Response
                </h4>
                <pre className="text-sm">
                  {JSON.stringify(stepResults[5].success ? stepResults[5].data : { error: stepResults[5].error }, null, 2)}
                </pre>
              </div>
            )}

            <Button onClick={executeStep5} disabled={!stepResults[4]?.success || !stepResults[3]?.success}>
              <Play className="h-4 w-4 mr-2" />
              Execute Request
            </Button>
          </div>
        );

      case 6:
        const allStepsSuccess = [2, 3, 4, 5].every(step => stepResults[step]?.success);
        
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg border text-center ${allStepsSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {allStepsSuccess ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Transaction Flow Complete!</h3>
                  <p className="text-green-800">
                    All steps completed successfully. The OAuth 2.0 transaction flow is working correctly.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-900 mb-2">Transaction Flow Failed</h3>
                  <p className="text-red-800">
                    Some steps failed. Please review the errors and try again.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Transaction Summary:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Initiator Client</span>
                  <Badge>{clients?.find(c => c.clientId === initiatorClient)?.name}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Executor Client</span>
                  <Badge>{clients?.find(c => c.clientId === executorClient)?.name}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Transaction Token</span>
                  <code className="text-sm">{stepResults[3]?.data?.transaction_token?.substring(0, 16)}...</code>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Token Validated</span>
                  <Badge variant={stepResults[5]?.data?.valid ? "default" : "destructive"}>
                    {stepResults[5]?.data?.valid ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            <Button onClick={() => {
              setCurrentStep(1);
              setStepResults({});
              setInitiatorClient("");
              setExecutorClient("");
            }}>
              Start New Test
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">OAuth 2.0 Test Wizard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentStep === step.id
                        ? "bg-blue-50 border-blue-200"
                        : stepResults[step.id]?.success
                        ? "bg-green-50 border-green-200"
                        : stepResults[step.id]?.error
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepResults[step.id]?.success
                        ? "bg-green-600 text-white"
                        : stepResults[step.id]?.error
                        ? "bg-red-600 text-white"
                        : currentStep === step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      {stepResults[step.id]?.success ? <CheckCircle className="h-4 w-4" /> : step.id}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  Step {currentStep}: {steps.find(s => s.id === currentStep)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                disabled={currentStep === 6}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}