import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocumentation() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <section id="documentation" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h2>
          <p className="text-lg text-gray-600">Complete reference for integrating with AuthVault</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* API Endpoints Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
              <nav className="space-y-2">
                <a href="#auth-endpoint" className="block px-3 py-2 text-sm text-primary bg-blue-50 rounded-md font-medium">
                  POST /oauth/token
                </a>
                <a href="#initiate-endpoint" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">
                  POST /transaction/initiate
                </a>
                <a href="#validate-endpoint" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md">
                  POST /transaction/validate
                </a>
              </nav>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Links</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-primary">Authentication Guide</a></li>
                  <li><a href="#" className="hover:text-primary">Error Codes</a></li>
                  <li><a href="#" className="hover:text-primary">Rate Limits</a></li>
                  <li><a href="#" className="hover:text-primary">SDKs & Libraries</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Documentation Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Authentication Endpoint */}
            <div id="auth-endpoint" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">OAuth Token Generation</h3>
                  <Badge>POST</Badge>
                </div>
                <code className="text-sm text-gray-600 font-mono">/oauth/token</code>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Generate an access token for API authentication using client credentials.</p>
                
                {/* Request Example */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
                  <div className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100 font-mono">
{`curl -X POST https://api.authvault.com/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "scope": "initiate_transaction"
  }'`}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`curl -X POST https://api.authvault.com/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "scope": "initiate_transaction"
  }'`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Response Example */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Response</h4>
                  <div className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100 font-mono">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Parameters Table */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Parameter</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Required</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2 font-mono">grant_type</td>
                          <td className="px-4 py-2">string</td>
                          <td className="px-4 py-2"><span className="text-red-600">Yes</span></td>
                          <td className="px-4 py-2">Must be "client_credentials"</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono">client_id</td>
                          <td className="px-4 py-2">string</td>
                          <td className="px-4 py-2"><span className="text-red-600">Yes</span></td>
                          <td className="px-4 py-2">Your client identifier</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono">client_secret</td>
                          <td className="px-4 py-2">string</td>
                          <td className="px-4 py-2"><span className="text-red-600">Yes</span></td>
                          <td className="px-4 py-2">Your client secret</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono">scope</td>
                          <td className="px-4 py-2">string</td>
                          <td className="px-4 py-2"><span className="text-red-600">Yes</span></td>
                          <td className="px-4 py-2">Requested scope: initiate_transaction or execute_transaction</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Initiate Endpoint */}
            <div id="initiate-endpoint" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Initiate Transaction</h3>
                  <Badge>POST</Badge>
                </div>
                <code className="text-sm text-gray-600 font-mono">/transaction/initiate</code>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Generate a transaction token for secure transaction processing.</p>
                
                {/* Request Example */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
                  <div className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100 font-mono">
{`curl -X POST https://api.authvault.com/transaction/initiate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -d '{
    "client_id": "your_client_id"
  }'`}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`curl -X POST https://api.authvault.com/transaction/initiate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -d '{
    "client_id": "your_client_id"
  }'`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Response Example */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Response</h4>
                  <div className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100 font-mono">
{`{
  "transaction_token": "txn_abc123def456..."
}`}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`{
  "transaction_token": "txn_abc123def456..."
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
