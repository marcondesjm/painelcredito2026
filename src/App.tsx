import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useSecurityProtection } from "@/hooks/useSecurityProtection";
import { InstallBanner } from "@/components/InstallBanner";
import { GlobalWhatsAppButton } from "@/components/GlobalWhatsAppButton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPageEditor from "./pages/LandingPageEditor";
import DynamicLandingPage from "./pages/DynamicLandingPage";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const SecurityWrapper = ({ children }: { children: React.ReactNode }) => {
  useSecurityProtection();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityWrapper>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/new" element={<LandingPageEditor />} />
              <Route path="/dashboard/edit/:id" element={<LandingPageEditor />} />
              <Route path="/p/:slug" element={<DynamicLandingPage />} />
              <Route path="/termos" element={<TermsOfUse />} />
              <Route path="/privacidade" element={<PrivacyPolicy />} />
              <Route path="/install" element={<Install />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <InstallBanner />
            <GlobalWhatsAppButton />
            <CookieConsentBanner />
          </AuthProvider>
        </BrowserRouter>
      </SecurityWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
