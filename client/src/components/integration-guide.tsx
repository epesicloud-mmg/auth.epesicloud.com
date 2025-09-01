import { User, Server, ServerCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IntegrationGuide() {
  return (
    <section id="integration" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Integration Guide</h2>
          <p className="text-lg text-gray-600">Get started with AuthVault in minutes</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Transaction Flow Diagram */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Transaction Flow</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Simplified Sequence Diagram */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <User className="text-primary text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Initiator</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Server className="text-green-600 text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Controller</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ServerCog className="text-purple-600 text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Executor</span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-gray-600">Initiator authenticates with Controller (OAuth 2.0)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-gray-600">Controller returns access token</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-gray-600">Initiator requests transaction token</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span className="text-gray-600">Initiator sends data + token to Executor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <span className="text-gray-600">Executor validates token and processes transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h3>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Register Your Application</h4>
                    <p className="text-gray-600 mb-3">Create a new client in the AuthVault dashboard to get your credentials.</p>
                    <Button size="sm">Create Client</Button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Install SDK</h4>
                    <p className="text-gray-600 mb-3">Choose your preferred language and install the AuthVault SDK.</p>
                    <div className="bg-gray-900 rounded-lg p-3 mb-3 overflow-x-auto">
                      <code className="text-sm text-gray-100 font-mono">npm install @authvault/node-sdk</code>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">Python</Badge>
                      <Badge variant="secondary">Go</Badge>
                      <Badge variant="secondary">Ruby</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Make Your First Request</h4>
                    <p className="text-gray-600 mb-3">Authenticate and start processing transactions.</p>
                    <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                      <pre className="text-sm text-gray-100 font-mono">
{`const authvault = new AuthVault({
  clientId: 'your_client_id',
  clientSecret: 'your_secret'
});

const token = await authvault.getAccessToken();
const txnToken = await authvault.initiateTransaction();`}
                      </pre>
                    </div>
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
