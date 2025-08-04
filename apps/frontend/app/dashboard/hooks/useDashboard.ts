import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '../../../lib/utils';
import { websiteSchema } from '../../../lib/validation';

interface Website {
  id: string;
  url: string;
  timeAdded: string;
  ticks: Array<{
    status: 'Up' | 'Down' | 'Unknown';
    response_time_ms: number;
    createdAt: string;
  }>;
}

interface Region {
  id: string;
  name: string;
}

export function useDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newRegionName, setNewRegionName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingPusher, setProcessingPusher] = useState(false);
  const [processingWorker, setProcessingWorker] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const router = useRouter();

  // Get auth headers
  const getHeaders = () => ({
    headers: { Authorization: localStorage.getItem("token") }
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/signin');
      return;
    }
    fetchWebsites();
    fetchRegions();
  }, [router]);

  // Fetch websites
  const fetchWebsites = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/websites`, getHeaders());
      setWebsites(response.data.websites);
      setError('');
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err && (err as any).response?.status === 401) {
        localStorage.removeItem("token");
        router.push('/signin');
      } else {
        setError('Failed to fetch websites');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch regions
  const fetchRegions = async () => {
    try {
      const headers = getHeaders();
      console.log('Fetching regions with headers:', headers);
      const response = await axios.get(`${BACKEND_URL}/regions`, headers);
      setRegions(response.data.regions);
    } catch (err) {
      console.error('Failed to fetch regions:', err);
      if (typeof err === 'object' && err !== null && 'response' in err && (err as any).response?.status === 401) {
        localStorage.removeItem("token");
        router.push('/signin');
      }
    }
  };

  // Add website
  const addWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      // Validate URL using Zod schema
      const validationResult = websiteSchema.safeParse({ url: newUrl.trim() });
      if (!validationResult.success) {
        setError(validationResult.error.issues[0].message);
        return;
      }
      
      // Use the normalized URL from validation
      const normalizedUrl = validationResult.data.url;
      
      await axios.post(`${BACKEND_URL}/websites`, { url: normalizedUrl }, getHeaders());
      setNewUrl('');
      setSuccess('✅ Website added successfully and ready for monitoring!');
      await fetchWebsites();
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to add website. Please check the URL and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete website
  const deleteWebsite = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${BACKEND_URL}/websites/${id}`, getHeaders());
      await fetchWebsites();
    } catch (err) {
      setError('Failed to delete website');
    } finally {
      setLoading(false);
    }
  };

  // Add region
  const addRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName.trim()) return;

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/regions`, { name: newRegionName }, getHeaders());
      setNewRegionName('');
      setSuccess('✅ Region created successfully');
      await fetchRegions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create region';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete region
  const deleteRegion = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${BACKEND_URL}/regions/${id}`, getHeaders());
      setSuccess('✅ Region deleted successfully');
      await fetchRegions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete region';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create Redis group for region
  const createRedisGroup = async (regionId: string, regionName: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/redis/create-group/${regionId}`, {}, getHeaders());
      setSuccess(`✅ ${response.data.message}`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create Redis group';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    router.push('/signin');
  };

  // Trigger pusher to add websites to monitoring queue
  const triggerPusher = async () => {
    try {
      setProcessingPusher(true);
      setError('');
      const response = await axios.post(`${BACKEND_URL}/trigger-pusher`, {}, getHeaders());
      setSuccess(`✅ ${response.data.message}`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to trigger pusher');
    } finally {
      setProcessingPusher(false);
    }
  };

  // Trigger worker to process monitoring queue
  const triggerWorker = async () => {
    if (!selectedRegionId || !workerId.trim()) {
      setError('Please select a region and enter a worker ID');
      return;
    }

    try {
      setProcessingWorker(true);
      setError('');
      const response = await axios.post(`${BACKEND_URL}/trigger-worker`, {
        regionId: selectedRegionId,
        workerId: workerId.trim()
      }, getHeaders());
      setSuccess(`✅ ${response.data.message}`);
      // Refresh data to show updated status
      await fetchWebsites();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to trigger worker';
      setError(errorMessage);
    } finally {
      setProcessingWorker(false);
    }
  };

  return {
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
  };
}
