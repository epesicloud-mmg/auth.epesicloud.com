import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section id="overview" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure OAuth 2.0
            <span className="text-primary"> As A Service</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Enterprise-grade authentication and transaction management platform. Streamline your OAuth 2.0 implementation with our secure, scalable API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3" asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3" asChild>
              <Link href="/api-docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
