/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Marketplace } from './components/Marketplace';
import { InteractiveMap } from './components/InteractiveMap';
import { AiAssistant } from './components/AiAssistant';
import { AffordabilityCalculator } from './components/AffordabilityCalculator';
import { InvestmentAnalyzer } from './components/InvestmentAnalyzer';
import { BuildFurnishMarketplace } from './components/BuildFurnishMarketplace';
import { ProfessionalsDirectory } from './components/ProfessionalsDirectory';
import { UserDashboard } from './components/UserDashboard';
import { AgentSellerDashboard } from './components/AgentSellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ViewingRequestModal } from './components/ViewingRequestModal';
import { AuthModal } from './components/AuthModal';
import { Property } from './types';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedProperty,
    setSelectedProperty,
    isViewingModalOpen,
    setIsViewingModalOpen,
    setInvestmentTargetProperty,
    toasts,
  } = useApp();

  const [activeViewingTarget, setActiveViewingTarget] = useState<Property | null>(null);
  const [passedAiPrompt, setPassedAiPrompt] = useState<string>('');

  const handleOpenDetails = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleRequestViewing = (property: Property) => {
    setActiveViewingTarget(property);
    setIsViewingModalOpen(true);
  };

  const handleAnalyzeInvestment = (property: Property) => {
    setInvestmentTargetProperty(property);
    setSelectedProperty(null);
    setCurrentView('investment');
  };

  const handleCheckAffordability = (property: Property) => {
    setSelectedProperty(null);
    setCurrentView('affordability');
  };

  const handleHeroAssistantPrompt = (prompt: string) => {
    setPassedAiPrompt(prompt);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      <Header />

      <main className="flex-1">
        {currentView === 'marketplace' && (
          <>
            <Hero onAssistantPrompt={handleHeroAssistantPrompt} />
            <Marketplace
              onOpenDetails={handleOpenDetails}
              onAnalyzeInvestment={handleAnalyzeInvestment}
            />
          </>
        )}

        {currentView === 'map' && (
          <InteractiveMap onOpenDetails={handleOpenDetails} />
        )}

        {currentView === 'assistant' && (
          <AiAssistant
            onOpenDetails={handleOpenDetails}
            initialPrompt={passedAiPrompt}
          />
        )}

        {currentView === 'affordability' && <AffordabilityCalculator />}

        {currentView === 'investment' && (
          <InvestmentAnalyzer onOpenDetails={handleOpenDetails} />
        )}

        {currentView === 'build' && <BuildFurnishMarketplace />}

        {currentView === 'professionals' && <ProfessionalsDirectory />}

        {currentView === 'user-dashboard' && (
          <UserDashboard onOpenDetails={handleOpenDetails} />
        )}

        {currentView === 'agent-dashboard' && (
          <AgentSellerDashboard onOpenDetails={handleOpenDetails} />
        )}

        {currentView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onRequestViewing={handleRequestViewing}
          onAnalyzeInvestment={handleAnalyzeInvestment}
          onCheckAffordability={handleCheckAffordability}
        />
      )}

      {/* Viewing Request Modal */}
      {isViewingModalOpen && (
        <ViewingRequestModal
          property={activeViewingTarget || selectedProperty}
          onClose={() => {
            setIsViewingModalOpen(false);
            setActiveViewingTarget(null);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal />

      {/* Live Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto p-3.5 rounded-2xl bg-stone-900/95 dark:bg-stone-800/95 text-white border border-stone-700 shadow-2xl flex items-center gap-2.5 text-xs max-w-sm animate-in slide-in-from-right duration-200"
          >
            {toast.type === 'info' ? (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-medium leading-tight">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
