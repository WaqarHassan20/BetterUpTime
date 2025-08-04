"use client"
import DashboardHeader from './components/DashboardHeader';
import AddWebsiteForm from './components/AddWebsiteForm';
import Notification from './components/Notification';
import MonitoringControls from './components/MonitoringControls';
import WebsiteList from './components/WebsiteList';
import RegionModal from './components/RegionModal';
import LoadingSpinner from './components/LoadingSpinner';
import { useDashboard } from './hooks/useDashboard';

export default function Dashboard() {
  const {
    // State
    websites,
    regions,
    loading,
    newUrl,
    newRegionName,
    selectedRegionId,
    workerId,
    error,
    success,
    processingPusher,
    processingWorker,
    showRegionModal,
    
    // Setters
    setNewUrl,
    setNewRegionName,
    setSelectedRegionId,
    setWorkerId,
    setError,
    setSuccess,
    setShowRegionModal,
    
    // Actions
    addWebsite,
    deleteWebsite,
    addRegion,
    deleteRegion,
    createRedisGroup,
    logout,
    triggerPusher,
    triggerWorker
  } = useDashboard();

  // Show loading spinner for initial load
  if (loading && websites.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <DashboardHeader onLogout={logout} />

      {/* Add Website Form */}
      <AddWebsiteForm
        newUrl={newUrl}
        loading={loading}
        onUrlChange={setNewUrl}
        onSubmit={addWebsite}
      />

      {/* Notifications */}
      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Notification
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}

      {/* Monitoring Controls */}
      <MonitoringControls
        regions={regions}
        selectedRegionId={selectedRegionId}
        workerId={workerId}
        processingPusher={processingPusher}
        processingWorker={processingWorker}
        websitesCount={websites.length}
        onRegionChange={setSelectedRegionId}
        onWorkerIdChange={setWorkerId}
        onTriggerPusher={triggerPusher}
        onTriggerWorker={triggerWorker}
        onManageRegions={() => setShowRegionModal(true)}
      />

      {/* Websites List */}
      <WebsiteList
        websites={websites}
        onDeleteWebsite={deleteWebsite}
      />

      {/* Auto-refresh indicator */}
      {loading && (
        <div className="mt-6 text-center text-gray-500 text-sm">
          <span>Refreshing data...</span>
        </div>
      )}

      {/* Region Management Modal */}
      <RegionModal
        isOpen={showRegionModal}
        regions={regions}
        newRegionName={newRegionName}
        loading={loading}
        onClose={() => setShowRegionModal(false)}
        onRegionNameChange={setNewRegionName}
        onAddRegion={addRegion}
        onDeleteRegion={deleteRegion}
        onCreateRedisGroup={createRedisGroup}
      />
    </div>
  );
}