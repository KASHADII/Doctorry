import { useState, useEffect, useCallback } from 'react';
import indexedDBService from '../services/indexedDBService';

// Custom hook for managing offline functionality
export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isIndexedDBSupported, setIsIndexedDBSupported] = useState(false);

  useEffect(() => {
    // Check if IndexedDB is supported
    setIsIndexedDBSupported(indexedDBService.isSupported());

    // Initialize IndexedDB
    if (indexedDBService.isSupported()) {
      indexedDBService.init().catch(console.error);
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save appointment offline
  const saveAppointmentOffline = useCallback(async (appointment) => {
    if (!isIndexedDBSupported) {
      throw new Error('IndexedDB not supported');
    }

    try {
      if (isOnline) {
        // Try to save online first
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointment)
        });

        if (response.ok) {
          const savedAppointment = await response.json();
          await indexedDBService.saveAppointment(savedAppointment);
          return savedAppointment;
        } else {
          throw new Error('Failed to save appointment online');
        }
      } else {
        // Save offline
        const offlineAppointment = {
          ...appointment,
          id: `offline_${Date.now()}`,
          synced: false,
          createdAt: new Date().toISOString()
        };
        
        await indexedDBService.savePendingAppointment(offlineAppointment);
        return offlineAppointment;
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      
      // Fallback to offline storage
      const offlineAppointment = {
        ...appointment,
        id: `offline_${Date.now()}`,
        synced: false,
        createdAt: new Date().toISOString()
      };
      
      await indexedDBService.savePendingAppointment(offlineAppointment);
      return offlineAppointment;
    }
  }, [isOnline, isIndexedDBSupported]);

  // Get appointments (online + offline)
  const getAppointments = useCallback(async (userId, userType = 'patient') => {
    if (!isIndexedDBSupported) {
      return [];
    }

    try {
      let appointments = [];
      
      if (isOnline) {
        // Try to fetch from server
        const response = await fetch(`/api/appointments?${userType}Id=${userId}`);
        if (response.ok) {
          appointments = await response.json();
          // Cache the appointments
          for (const appointment of appointments) {
            await indexedDBService.saveAppointment(appointment);
          }
        }
      }

      // Get cached appointments
      const cachedAppointments = userType === 'patient' 
        ? await indexedDBService.getAppointmentsByPatient(userId)
        : await indexedDBService.getAppointmentsByDoctor(userId);

      // Merge and deduplicate
      const allAppointments = [...appointments, ...cachedAppointments];
      const uniqueAppointments = allAppointments.filter((appointment, index, self) => 
        index === self.findIndex(a => a.id === appointment.id)
      );

      return uniqueAppointments;
    } catch (error) {
      console.error('Error getting appointments:', error);
      
      // Fallback to cached data
      if (isIndexedDBSupported) {
        return userType === 'patient' 
          ? await indexedDBService.getAppointmentsByPatient(userId)
          : await indexedDBService.getAppointmentsByDoctor(userId);
      }
      
      return [];
    }
  }, [isOnline, isIndexedDBSupported]);

  // Get doctors (with caching)
  const getDoctors = useCallback(async (specialization = null) => {
    if (!isIndexedDBSupported) {
      return [];
    }

    try {
      let doctors = [];
      
      if (isOnline) {
        // Try to fetch from server
        const url = specialization 
          ? `/api/doctors?specialization=${specialization}`
          : '/api/doctors';
        
        const response = await fetch(url);
        if (response.ok) {
          doctors = await response.json();
          // Cache the doctors
          await indexedDBService.saveDoctors(doctors);
        }
      }

      // Get cached doctors
      const cachedDoctors = specialization 
        ? await indexedDBService.getDoctorsBySpecialization(specialization)
        : await indexedDBService.getDoctors();

      // Merge and deduplicate
      const allDoctors = [...doctors, ...cachedDoctors];
      const uniqueDoctors = allDoctors.filter((doctor, index, self) => 
        index === self.findIndex(d => d.id === doctor.id)
      );

      return uniqueDoctors;
    } catch (error) {
      console.error('Error getting doctors:', error);
      
      // Fallback to cached data
      if (isIndexedDBSupported) {
        return specialization 
          ? await indexedDBService.getDoctorsBySpecialization(specialization)
          : await indexedDBService.getDoctors();
      }
      
      return [];
    }
  }, [isOnline, isIndexedDBSupported]);

  // Save user profile
  const saveUserProfile = useCallback(async (profile) => {
    if (!isIndexedDBSupported) {
      return profile;
    }

    try {
      await indexedDBService.saveUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return profile;
    }
  }, [isIndexedDBSupported]);

  // Get user profile
  const getUserProfile = useCallback(async () => {
    if (!isIndexedDBSupported) {
      return null;
    }

    try {
      return await indexedDBService.getUserProfile();
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }, [isIndexedDBSupported]);

  // Sync pending appointments when back online
  const syncPendingAppointments = useCallback(async () => {
    if (!isOnline || !isIndexedDBSupported) {
      return;
    }

    try {
      const pendingAppointments = await indexedDBService.getPendingAppointments();
      
      for (const appointment of pendingAppointments) {
        try {
          const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointment)
          });
          
          if (response.ok) {
            const savedAppointment = await response.json();
            await indexedDBService.saveAppointment(savedAppointment);
            await indexedDBService.removePendingAppointment(appointment.id);
          }
        } catch (error) {
          console.error('Failed to sync appointment:', error);
        }
      }
    } catch (error) {
      console.error('Error syncing pending appointments:', error);
    }
  }, [isOnline, isIndexedDBSupported]);

  // Sync when back online
  useEffect(() => {
    if (isOnline) {
      syncPendingAppointments();
    }
  }, [isOnline, syncPendingAppointments]);

  return {
    isOnline,
    isIndexedDBSupported,
    saveAppointmentOffline,
    getAppointments,
    getDoctors,
    saveUserProfile,
    getUserProfile,
    syncPendingAppointments
  };
};
