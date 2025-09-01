import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Features from "@/components/features";
import DashboardOverview from "@/components/dashboard-overview";
import ApiDocumentation from "@/components/api-documentation";
import IntegrationGuide from "@/components/integration-guide";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero />
      <Features />
      <DashboardOverview />
      <ApiDocumentation />
      <IntegrationGuide />
      <Footer />
    </div>
  );
}
