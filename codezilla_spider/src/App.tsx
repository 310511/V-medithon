import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MarketplaceDashboard } from "@/components/marketplace/MarketplaceDashboard";
import { SupplierDashboard } from "@/components/marketplace/SupplierDashboard";
import { InfiniteMemoryProvider } from "@/contexts/InfiniteMemoryContext";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { InfiniteMemoryDashboard } from "@/components/infinite-memory/InfiniteMemoryDashboard";
import { InfiniteMemoryDemo } from "@/components/infinite-memory/InfiniteMemoryDemo";
import { MLPredictionsDashboard } from "@/components/ml-predictions/MLPredictionsDashboard";
import { EnhancedMLPredictionsDashboard } from "@/components/ml-predictions/EnhancedMLPredictionsDashboard";
import { MedicineRecommendationDashboard } from "@/components/medicine-recommendation/MedicineRecommendationDashboard";
import { EnhancedMedicineAIDashboard } from "@/components/medicine-recommendation/EnhancedMedicineAIDashboard";
import { SkinAnalysisDashboard } from "@/components/flask-integration/SkinAnalysisDashboard";
import VoiceMedicineAssistant from "@/components/voice-assistant/VoiceMedicineAssistant";
import InventoryDashboard from "@/components/inventory/InventoryDashboard";
import RFIDDashboard from "@/components/rfid/RFIDDashboard";
import { Notifications } from "@/components/ui/notifications";
import { useBlockchain } from "@/contexts/BlockchainContext";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EchoMedAI from "./pages/EchoMedAI";
import ErrorBoundary from "./components/ErrorBoundary";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

// Simple test component to verify rendering
const TestComponent = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>MedChain Test</h1>
    <p>If you can see this, the app is rendering correctly!</p>
  </div>
);

const AppContent = () => {
  const { appNotifications, addAppNotification } = useBlockchain();

  const handleRemoveNotification = (id: string) => {
    // The notification will be automatically removed by the context
    // This is just for manual removal if needed
  };

  return (
    <>
      <Header />
      <Notifications 
        notifications={appNotifications} 
        onRemove={handleRemoveNotification} 
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/marketplace" element={<MarketplaceDashboard />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/infinite-memory" element={<InfiniteMemoryDashboard />} />
        <Route path="/infinite-memory-demo" element={<InfiniteMemoryDemo />} />
        <Route path="/ml-predictions" element={<EnhancedMLPredictionsDashboard />} />
        <Route path="/enhanced-ml-predictions" element={<EnhancedMLPredictionsDashboard />} />
        <Route path="/medicine-recommendation" element={<EnhancedMedicineAIDashboard />} />
        <Route path="/enhanced-medicine-ai" element={<EnhancedMedicineAIDashboard />} />
        <Route path="/skin-analysis" element={<SkinAnalysisDashboard />} />
        <Route path="/voice-medicine" element={<VoiceMedicineAssistant />} />
        <Route path="/inventory" element={<InventoryDashboard />} />
        <Route path="/rfid" element={<RFIDDashboard />} />
        <Route path="/echomed-ai" element={<EchoMedAI />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BlockchainProvider>
          <InventoryProvider>
            <NotificationProvider>
              <InfiniteMemoryProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </TooltipProvider>
              </InfiniteMemoryProvider>
            </NotificationProvider>
          </InventoryProvider>
        </BlockchainProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
