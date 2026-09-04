import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { NutriHeader } from './components/nutriscan/NutriHeader';
import { NutriHero } from './components/nutriscan/NutriHero';
import { Interactive3DCard } from './components/nutriscan/Interactive3DCard';
import { ActionButtons } from './components/nutriscan/ActionButtons';
import { TodaySnapshot } from './components/nutriscan/TodaySnapshot';
import { CategoryBrowse } from './components/nutriscan/CategoryBrowse';
import { RecentlyScanned, ScannedItem, RECENT_ITEMS } from './components/nutriscan/RecentlyScanned';
import { BottomNav } from './components/nutriscan/BottomNav';
import { LiveScannerModal } from './components/nutriscan/LiveScannerModal';
import { UploadProductModal } from './components/nutriscan/UploadProductModal';
import { InspectionDrawer } from './components/nutriscan/InspectionDrawer';
import { InsightsView } from './components/nutriscan/InsightsView';
import { CategoryView } from './components/nutriscan/CategoryView';
import { ProfileView } from './components/nutriscan/ProfileView';
import { PromotionalShowcase } from './components/nutriscan/PromotionalShowcase';
import { MobileQuickBar } from './components/nutriscan/MobileQuickBar';
import { PWAInstallBanner } from './components/nutriscan/PWAInstallBanner';
import { SIHProblemBanner } from './components/nutriscan/SIHProblemBanner';
import { NoticeModal } from './components/export/NoticeModal';
import { FairPackAPI } from './services/api';
import { AuditReport } from './types/compliance';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState<boolean>(false);
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(false);
  const [recentItems, setRecentItems] = useState<ScannedItem[]>(RECENT_ITEMS);

  // Load default preset audit on start & check query parameters
  useEffect(() => {
    async function loadInitial() {
      try {
        const initialReport = await FairPackAPI.runAudit('compliant-biscuit');
        setReport(initialReport);

        // Check if opened via PWA Shortcut action or query params
        const params = new URLSearchParams(window.location.search);
        const actionParam = params.get('action');
        const tabParam = params.get('tab');

        if (actionParam === 'scan') {
          setIsScannerOpen(true);
        } else if (actionParam === 'upload') {
          setIsUploadModalOpen(true);
        }

        if (tabParam && ['home', 'insights', 'category', 'profile'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      } catch (err) {
        console.error('Audit load error:', err);
      }
    }
    loadInitial();
  }, []);

  const handleSelectItem = async (item: ScannedItem) => {
    try {
      const newReport = await FairPackAPI.runAudit(item.presetId);
      setReport(newReport);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error('Error loading item audit:', err);
    }
  };

  const handleScanComplete = async (presetId: string) => {
    try {
      const newReport = await FairPackAPI.runAudit(presetId);
      setReport(newReport);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error('Scan audit error:', err);
    }
  };

  const handleAuditComplete = (newReport: AuditReport) => {
    setReport(newReport);

    // Create new scanned item card
    const isA = newReport.compliance_score >= 90;
    const isB = newReport.compliance_score >= 70;
    const formattedName = newReport.product_name || 'Scanned Specimen';

    const newItem: ScannedItem = {
      id: `upload-${Date.now()}`,
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      category: 'Scanned Packaging',
      timeAgo: 'Just now',
      grade: isA ? 'A+' : isB ? 'B-' : 'C',
      gradeBg: isA ? 'bg-[#D5FF3F]' : isB ? 'bg-[#8B5CF6]' : 'bg-[#FF2A85]',
      gradeColor: isA ? 'text-zinc-950 font-black' : 'text-white font-black',
      icon: Camera,
      iconBg: 'bg-[#D5FF3F]/30 text-zinc-900',
      presetId: 'custom-upload',
    };

    setRecentItems((prev) => [newItem, ...prev]);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F0EDE3] flex flex-col items-center justify-start text-zinc-900 selection:bg-[#FF2A85]/20 selection:text-[#FF2A85] relative overflow-x-hidden">
      
      {/* Background Organic Pastel Blobs */}
      <div className="fixed -top-16 -right-16 w-96 h-96 rounded-full bg-[#E5F792] opacity-75 blur-3xl pointer-events-none -z-0" />
      <div className="fixed top-1/3 -left-20 w-72 h-80 rounded-full bg-[#FFD1DC] opacity-70 blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#E0F7FA] opacity-50 blur-3xl pointer-events-none -z-0" />

      {/* Responsive Main Container */}
      <div
        className={`w-full transition-all duration-300 relative z-10 ${
          isMobileFrameMode
            ? 'max-w-[430px] my-0 sm:my-6 bg-[#F7F5EC] sm:rounded-[44px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border-x sm:border border-zinc-300/80 px-4 sm:px-5 min-h-screen pb-24 overflow-hidden'
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 min-h-screen pb-24 lg:pb-12'
        }`}
      >
        {/* Top Header with Mobile Feature Menu */}
        <NutriHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onProfileClick={() => setActiveTab('profile')}
          onScanClick={() => setIsScannerOpen(true)}
          onUploadClick={() => setIsUploadModalOpen(true)}
          onOpenNotice={() => setIsNoticeOpen(true)}
          isMobileFrameMode={isMobileFrameMode}
          onToggleFrameMode={() => setIsMobileFrameMode(!isMobileFrameMode)}
        />

        {/* SIH26034 Official Problem Statement Banner */}
        <SIHProblemBanner onOpenNotice={() => setIsNoticeOpen(true)} />

        {/* PWA Install Banner */}
        <div className="mt-2">
          <PWAInstallBanner />
        </div>

        {/* Mobile Instant Quick Action Pill Bar */}
        <div className={!isMobileFrameMode ? 'block md:hidden' : 'block'}>
          <MobileQuickBar
            onScanClick={() => setIsScannerOpen(true)}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onQuickPreset={(presetId) => handleScanComplete(presetId)}
            onOpenNotice={() => setIsNoticeOpen(true)}
          />
        </div>

        {/* Tab 1: Home Tab */}
        {activeTab === 'home' && (
          <div>
            {/* Desktop / Laptop Responsive Two-Column Layout (when not in mobile frame mode) */}
            {!isMobileFrameMode ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-2 items-start">
                  
                  {/* Left Column (Desktop 7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Hero Greeting Heading */}
                    <NutriHero />

                    {/* 3D Interactive Rotating Product Card */}
                    <Interactive3DCard
                      onExploreProduct={(presetId) => handleScanComplete(presetId)}
                    />

                    {/* Tactile Action Buttons */}
                    <ActionButtons
                      onScanClick={() => setIsScannerOpen(true)}
                      onUploadClick={() => setIsUploadModalOpen(true)}
                      onRecentScansClick={() => setIsDrawerOpen(true)}
                    />

                    {/* Browse by Category */}
                    <CategoryBrowse onSelectCategory={() => setActiveTab('category')} />
                  </div>

                  {/* Right Column (Desktop 5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Today's Snapshot */}
                    <TodaySnapshot onViewAll={() => setActiveTab('insights')} />

                    {/* Recently Scanned List */}
                    <RecentlyScanned
                      items={recentItems}
                      onSelectItem={handleSelectItem}
                      onSeeAll={() => setActiveTab('category')}
                    />
                  </div>
                </div>

                {/* Promotional Showcase with React Bits Pro StaggeredText */}
                <div className="mt-8">
                  <PromotionalShowcase
                    onInspectProduct={(presetId) => handleScanComplete(presetId)}
                  />
                </div>
              </div>
            ) : (
              /* Mobile Frame Layout (matches mobile stream) */
              <div className="space-y-3 pt-1">
                <NutriHero />
                <Interactive3DCard
                  onExploreProduct={(presetId) => handleScanComplete(presetId)}
                />
                <ActionButtons
                  onScanClick={() => setIsScannerOpen(true)}
                  onUploadClick={() => setIsUploadModalOpen(true)}
                  onRecentScansClick={() => setIsDrawerOpen(true)}
                />

                {/* Promotional Staggered Text Showcase with Minimal Products */}
                <PromotionalShowcase
                  onInspectProduct={(presetId) => handleScanComplete(presetId)}
                />

                <TodaySnapshot onViewAll={() => setActiveTab('insights')} />
                <CategoryBrowse onSelectCategory={() => setActiveTab('category')} />
                <RecentlyScanned
                  items={recentItems}
                  onSelectItem={handleSelectItem}
                  onSeeAll={() => setActiveTab('category')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Insights View */}
        {activeTab === 'insights' && (
          <div className="max-w-3xl mx-auto">
            <InsightsView onBackToHome={() => setActiveTab('home')} />
          </div>
        )}

        {/* Tab 3: Category View */}
        {activeTab === 'category' && (
          <div className="max-w-3xl mx-auto">
            <CategoryView onSelectItem={handleSelectItem} />
          </div>
        )}

        {/* Tab 4: Profile View */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <ProfileView onOpenNotice={() => setIsNoticeOpen(true)} />
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation Dock (Visible on Mobile & Tablet, and in Mobile Frame) */}
      <div className={!isMobileFrameMode ? 'lg:hidden' : 'block'}>
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onCenterAction={() => setIsScannerOpen(true)}
        />
      </div>

      {/* Live High-Tech Scanner Modal */}
      <LiveScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
        onAuditComplete={handleAuditComplete}
        onFileUpload={async (file) => {
          const report = await FairPackAPI.uploadImageAndAudit(file);
          handleAuditComplete(report);
        }}
      />

      {/* Dedicated Tactile Upload Product Modal */}
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAuditComplete={handleAuditComplete}
      />

      {/* Inspection Drawer / Bottom Sheet */}
      <InspectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        report={report}
        onOpenNotice={() => {
          setIsDrawerOpen(false);
          setIsNoticeOpen(true);
        }}
      />

      {/* Official Notice of Non-Compliance (Rule 32) Modal */}
      <NoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        report={report}
      />
    </div>
  );
}

export default App;
