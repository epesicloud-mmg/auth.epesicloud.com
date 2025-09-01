import { Key, RefreshCw, Gauge, Users, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Key,
    title: "OAuth 2.0 Server",
    description: "Complete OAuth 2.0 implementation with client credentials flow and scope-based access control.",
    color: "blue",
  },
  {
    icon: RefreshCw,
    title: "Transaction Tokens",
    description: "Secure transaction token generation and single-use validation for enhanced security.",
    color: "green",
  },
  {
    icon: Gauge,
    title: "Rate Limiting",
    description: "Built-in rate limiting and security measures to prevent abuse and protect your APIs.",
    color: "purple",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Comprehensive client registration and management system with scope controls.",
    color: "red",
  },
  {
    icon: Shield,
    title: "JWT Security",
    description: "Secure JWT token generation with proper validation and expiration handling.",
    color: "yellow",
  },
  {
    icon: TrendingUp,
    title: "Monitoring",
    description: "Real-time monitoring and logging capabilities for complete transaction visibility.",
    color: "indigo",
  },
];

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
  indigo: "bg-indigo-100 text-indigo-600",
};

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Ready Features</h2>
          <p className="text-lg text-gray-600">Everything you need for secure authentication and transaction management</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
