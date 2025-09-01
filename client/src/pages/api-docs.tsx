import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Copy, Code, Shield, Users, Zap, CheckCircle, AlertTriangle, BookOpen, Key, RefreshCw, FileText, Package, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function ApiDocs() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const CodeBlock = ({ children, language = "bash" }: { children: string; language?: string }) => (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(children)}
          className="h-8 px-2"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );

  const sidebarItems = [
    {
      id: "overview",
      title: "Overview",
      icon: BookOpen,
      subsections: [
        { id: "getting-started", title: "Getting Started" },
        { id: "authentication-flow", title: "Authentication Flow" },
        { id: "rate-limiting", title: "Rate Limiting" }
      ]
    },
    {
      id: "authentication",
      title: "Authentication",
      icon: Key,
      subsections: [
        { id: "oauth-token", title: "OAuth Token" },
        { id: "scopes", title: "Available Scopes" }
      ]
    },
    {
      id: "transactions",
      title: "Transactions",
      icon: RefreshCw,
      subsections: [
        { id: "initiate-transaction", title: "Initiate Transaction" },
        { id: "validate-transaction", title: "Validate Transaction" },
        { id: "transaction-security", title: "Security Features" }
      ]
    },
    {
      id: "examples",
      title: "Code Examples",
      icon: FileText,
      subsections: [
        { id: "complete-flow", title: "Complete Flow" },
        { id: "javascript-sdk", title: "JavaScript SDK" }
      ]
    },
    {
      id: "sdks",
      title: "SDKs & Libraries",
      icon: Package,
      subsections: [
        { id: "official-sdks", title: "Official SDKs" },
        { id: "community-libraries", title: "Community Libraries" }
      ]
    },
    {
      id: "errors",
      title: "Error Handling",
      icon: AlertCircle,
      subsections: [
        { id: "status-codes", title: "HTTP Status Codes" },
        { id: "error-format", title: "Error Response Format" }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AuthVault API Documentation
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Complete OAuth 2.0 Authentication as a Service with secure transaction token management.
                Build secure applications with enterprise-grade authentication flows.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">OAuth 2.0</h3>
                  <p className="text-sm text-gray-600">Industry Standard</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Multi-Tenant</h3>
                  <p className="text-sm text-gray-600">Isolated Clients</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Rate Limited</h3>
                  <p className="text-sm text-gray-600">Built-in Protection</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Production Ready</h3>
                  <p className="text-sm text-gray-600">Enterprise Grade</p>
                </CardContent>
              </Card>
            </div>

            <Card id="getting-started">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                  <CodeBlock>https://your-domain.com/api</CodeBlock>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Try the Interactive Test Wizard</h4>
                      <p className="text-gray-600 mb-4">
                        Walk through the complete OAuth 2.0 transaction flow step-by-step with real API calls. 
                        Perfect for testing your client configurations and understanding the authentication process.
                      </p>
                      <Link href="/test-wizard">
                        <Button className="inline-flex items-center">
                          Launch Test Wizard
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="authentication-flow">
              <CardHeader>
                <CardTitle>Authentication Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 mb-4">
                  AuthVault implements OAuth 2.0 Client Credentials flow with scope-based access control.
                  The system supports three main stakeholders:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-blue-600 mb-2">Initiator</h4>
                    <p className="text-sm text-gray-600">
                      Starts transactions with <code>initiate_transaction</code> scope.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">Controller</h4>
                    <p className="text-sm text-gray-600">
                      Manages authentication and token validation (AuthVault).
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-purple-600 mb-2">Executor</h4>
                    <p className="text-sm text-gray-600">
                      Validates and processes with <code>execute_transaction</code> scope.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="rate-limiting">
              <CardHeader>
                <CardTitle>Rate Limiting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium">Rate Limits Apply</p>
                      <p className="text-yellow-700 text-sm">
                        100 requests per minute per IP address. Exceeding limits returns HTTP 429.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "authentication":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h1>
              <p className="text-lg text-gray-600">
                OAuth 2.0 Client Credentials flow implementation with scope-based access control.
              </p>
            </div>

            <Card id="oauth-token">
              <CardHeader>
                <CardTitle>OAuth 2.0 Client Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Endpoint</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="text-sm">/oauth/token</code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Request</h3>
                  <CodeBlock language="bash">{`curl -X POST https://your-domain.com/api/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "scope": "initiate_transaction"
  }'`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Response</h3>
                  <CodeBlock language="json">{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}</CodeBlock>
                </div>
              </CardContent>
            </Card>

            <Card id="scopes">
              <CardHeader>
                <CardTitle>Available Scopes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <code className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">initiate_transaction</code>
                      <p className="text-sm text-gray-600 mt-1">Allows creating transaction tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <code className="font-mono text-sm bg-green-100 px-2 py-1 rounded">execute_transaction</code>
                      <p className="text-sm text-gray-600 mt-1">Allows validating transaction tokens</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "transactions":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Transaction Management</h1>
              <p className="text-lg text-gray-600">
                Secure transaction token creation and validation endpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card id="initiate-transaction">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Badge variant="outline">POST</Badge>
                    <span>Initiate Transaction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Endpoint:</p>
                    <code className="text-sm">/transaction/initiate</code>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Headers:</p>
                    <CodeBlock language="bash">{`Authorization: Bearer <access_token>
Content-Type: application/json`}</CodeBlock>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Request Body:</p>
                    <CodeBlock language="json">{`{
  "client_id": "your_client_id"
}`}</CodeBlock>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Response:</p>
                    <CodeBlock language="json">{`{
  "transaction_token": "c5d86ff2-6a4b-4c8d-9e1f-2a3b4c5d6e7f"
}`}</CodeBlock>
                  </div>
                </CardContent>
              </Card>

              <Card id="validate-transaction">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Badge variant="outline">POST</Badge>
                    <span>Validate Transaction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Endpoint:</p>
                    <code className="text-sm">/transaction/validate</code>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Headers:</p>
                    <CodeBlock language="bash">{`Authorization: Bearer <access_token>
Content-Type: application/json`}</CodeBlock>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Request Body:</p>
                    <CodeBlock language="json">{`{
  "transaction_token": "c5d86ff2-6a4b-4c8d-9e1f-2a3b4c5d6e7f"
}`}</CodeBlock>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Response:</p>
                    <CodeBlock language="json">{`{
  "valid": true,
  "transaction_token": "c5d86ff2-6a4b-4c8d-9e1f-2a3b4c5d6e7f",
  "client_id": "your_client_id"
}`}</CodeBlock>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card id="transaction-security">
              <CardHeader>
                <CardTitle>Transaction Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Single-use Tokens</p>
                      <p className="text-sm text-gray-600">Transaction tokens can only be validated once for security.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Scope Validation</p>
                      <p className="text-sm text-gray-600">Only clients with proper scopes can initiate or validate transactions.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">JWT Security</p>
                      <p className="text-sm text-gray-600">All access tokens are signed JWTs with expiration times.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "examples":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h1>
              <p className="text-lg text-gray-600">
                Complete examples and SDK implementations for various programming languages.
              </p>
            </div>

            <Card id="complete-flow">
              <CardHeader>
                <CardTitle>Complete Transaction Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 1: Initiator Authentication</h3>
                  <CodeBlock language="bash">{`# Initiator gets access token
curl -X POST https://your-domain.com/api/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "initiator_client_id",
    "client_secret": "initiator_client_secret",
    "scope": "initiate_transaction"
  }'`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 2: Create Transaction Token</h3>
                  <CodeBlock language="bash">{`# Using the access token from step 1
curl -X POST https://your-domain.com/api/transaction/initiate \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "initiator_client_id"
  }'`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 3: Executor Authentication</h3>
                  <CodeBlock language="bash">{`# Executor gets access token
curl -X POST https://your-domain.com/api/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "executor_client_id",
    "client_secret": "executor_client_secret",
    "scope": "execute_transaction"
  }'`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Step 4: Validate Transaction Token</h3>
                  <CodeBlock language="bash">{`# Using executor access token to validate
curl -X POST https://your-domain.com/api/transaction/validate \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "transaction_token": "c5d86ff2-6a4b-4c8d-9e1f-2a3b4c5d6e7f"
  }'`}</CodeBlock>
                </div>
              </CardContent>
            </Card>

            <Card id="javascript-sdk">
              <CardHeader>
                <CardTitle>JavaScript/Node.js SDK</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock language="javascript">{`const axios = require('axios');

class AuthVaultClient {
  constructor(baseUrl, clientId, clientSecret, scope) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
    this.accessToken = null;
  }

  async authenticate() {
    const response = await axios.post(\`\${this.baseUrl}/oauth/token\`, {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: this.scope
    });
    
    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  async initiateTransaction() {
    if (!this.accessToken) await this.authenticate();
    
    const response = await axios.post(
      \`\${this.baseUrl}/transaction/initiate\`,
      { client_id: this.clientId },
      { headers: { Authorization: \`Bearer \${this.accessToken}\` } }
    );
    
    return response.data.transaction_token;
  }

  async validateTransaction(transactionToken) {
    if (!this.accessToken) await this.authenticate();
    
    const response = await axios.post(
      \`\${this.baseUrl}/transaction/validate\`,
      { transaction_token: transactionToken },
      { headers: { Authorization: \`Bearer \${this.accessToken}\` } }
    );
    
    return response.data;
  }
}

// Usage Example
const initiator = new AuthVaultClient(
  'https://your-domain.com/api',
  'initiator_client_id',
  'initiator_client_secret',
  'initiate_transaction'
);

const executor = new AuthVaultClient(
  'https://your-domain.com/api',
  'executor_client_id',
  'executor_client_secret',
  'execute_transaction'
);

async function processTransaction() {
  // Initiator creates transaction token
  const transactionToken = await initiator.initiateTransaction();
  
  // Executor validates transaction token
  const validation = await executor.validateTransaction(transactionToken);
  
  if (validation.valid) {
    console.log('Transaction validated successfully!');
  }
}`}</CodeBlock>
              </CardContent>
            </Card>
          </div>
        );

      case "sdks":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">SDKs & Libraries</h1>
              <p className="text-lg text-gray-600">
                Official SDKs and community libraries for various programming languages.
              </p>
            </div>

            <Card id="official-sdks">
              <CardHeader>
                <CardTitle>Official SDKs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Node.js</h3>
                    <p className="text-sm text-gray-600 mb-3">npm install @authvault/node</p>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Python</h3>
                    <p className="text-sm text-gray-600 mb-3">pip install authvault</p>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Go</h3>
                    <p className="text-sm text-gray-600 mb-3">go get github.com/authvault/go</p>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">PHP</h3>
                    <p className="text-sm text-gray-600 mb-3">composer require authvault/php</p>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Java</h3>
                    <p className="text-sm text-gray-600 mb-3">Maven/Gradle</p>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">C#</h3>
                    <p className="text-sm text-gray-600 mb-3">NuGet Package</p>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="community-libraries">
              <CardHeader>
                <CardTitle>Community Libraries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AuthVault uses standard OAuth 2.0, so you can use any OAuth 2.0 client library.
                  Here are some popular options:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">axios (JavaScript)</h4>
                      <p className="text-sm text-gray-600">HTTP client with interceptors for token management</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">requests-oauthlib (Python)</h4>
                      <p className="text-sm text-gray-600">OAuth library for Python requests</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">golang.org/x/oauth2 (Go)</h4>
                      <p className="text-sm text-gray-600">Official OAuth 2.0 library for Go</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "errors":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Handling</h1>
              <p className="text-lg text-gray-600">
                Comprehensive error codes and response formats for troubleshooting.
              </p>
            </div>

            <Card id="status-codes">
              <CardHeader>
                <CardTitle>HTTP Status Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">200</Badge>
                      <span className="font-medium">OK</span>
                    </div>
                    <p className="text-sm text-gray-600">Request successful</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">400</Badge>
                      <span className="font-medium">Bad Request</span>
                    </div>
                    <p className="text-sm text-gray-600">Invalid request parameters</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">401</Badge>
                      <span className="font-medium">Unauthorized</span>
                    </div>
                    <p className="text-sm text-gray-600">Invalid or missing credentials</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">403</Badge>
                      <span className="font-medium">Forbidden</span>
                    </div>
                    <p className="text-sm text-gray-600">Insufficient scope or permissions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">429</Badge>
                      <span className="font-medium">Too Many Requests</span>
                    </div>
                    <p className="text-sm text-gray-600">Rate limit exceeded</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">500</Badge>
                      <span className="font-medium">Internal Server Error</span>
                    </div>
                    <p className="text-sm text-gray-600">Server error occurred</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="error-format">
              <CardHeader>
                <CardTitle>Error Response Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Standard Error Response</h3>
                  <CodeBlock language="json">{`{
  "error": "invalid_client",
  "error_description": "Client authentication failed",
  "error_uri": "https://docs.authvault.com/errors#invalid_client"
}`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Common Error Codes</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <code className="font-mono text-sm bg-red-100 px-2 py-1 rounded">invalid_client</code>
                      <p className="text-sm text-gray-600 mt-1">Invalid client credentials provided</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="font-mono text-sm bg-red-100 px-2 py-1 rounded">invalid_scope</code>
                      <p className="text-sm text-gray-600 mt-1">Requested scope is not available for this client</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="font-mono text-sm bg-red-100 px-2 py-1 rounded">invalid_token</code>
                      <p className="text-sm text-gray-600 mt-1">Access token is invalid or expired</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="font-mono text-sm bg-red-100 px-2 py-1 rounded">insufficient_scope</code>
                      <p className="text-sm text-gray-600 mt-1">Token doesn't have required scope for this operation</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="font-mono text-sm bg-red-100 px-2 py-1 rounded">transaction_token_invalid</code>
                      <p className="text-sm text-gray-600 mt-1">Transaction token is invalid or already used</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href={isAuthenticated ? "/dashboard" : "/"}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Code className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">API Documentation</h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/test-wizard">
                <Button>Test API</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen sticky top-16">
          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                    
                    {isActive && item.subsections && (
                      <div className="ml-7 mt-2 space-y-1">
                        {item.subsections.map((subsection) => (
                          <a
                            key={subsection.id}
                            href={`#${subsection.id}`}
                            className="block px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            {subsection.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Quick Action - moved after navigation */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Test Your API</h3>
              <p className="text-sm text-blue-700 mb-3">
                Interactive step-by-step testing wizard
              </p>
              <Link href="/test-wizard">
                <Button size="sm" className="w-full">
                  Launch Test Wizard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto px-8 py-8">
          {renderContent()}

          {/* Footer CTA */}
          <div className="text-center mt-16 p-8 bg-primary/5 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Create your first client and start building secure applications with AuthVault.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button size="lg">Create Client</Button>
              </Link>
              <Link href="/test-wizard">
                <Button variant="outline" size="lg">Test API</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}