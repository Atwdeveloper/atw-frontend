import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWorkerLocations } from '../../api/admin/adminVendorAPI';

export const useLocationFilter = (options = {}) => {
  const {
    persistInURL = true,
    initialLocations = [],
    multiSelect = true
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({
    availableLocations: [],
    selectedLocations: initialLocations,
    loading: false
  });

  const fetchLocations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await getWorkerLocations();
      const locations = response.data?.locations?.map(loc => loc.location) || [];
      
      setState(prev => ({
        ...prev,
        availableLocations: locations,
        loading: false
      }));
      
      return locations;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      console.error('Error fetching locations:', error);
      return [];
    }
  }, []);

  const toggleLocation = useCallback((location) => {
    setState(prev => {
      if (!multiSelect) {
        return {
          ...prev,
          selectedLocations: [location]
        };
      }
      
      const isSelected = prev.selectedLocations.includes(location);
      return {
        ...prev,
        selectedLocations: isSelected
          ? prev.selectedLocations.filter(loc => loc !== location)
          : [...prev.selectedLocations, location]
      };
    });
  }, [multiSelect]);

  const selectAllLocations = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedLocations: [...prev.availableLocations]
    }));
  }, []);

  const clearLocations = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedLocations: []
    }));
  }, []);

  const filterOrdersByLocation = useCallback((orders) => {
    if (state.selectedLocations.length === 0) {
      return orders;
    }
    
    return orders.filter(order => 
      order.worker?.location && 
      state.selectedLocations.includes(order.worker.location)
    );
  }, [state.selectedLocations]);

  // Persist in URL
  useEffect(() => {
    if (persistInURL) {
      if (state.selectedLocations.length > 0) {
        searchParams.set('locations', state.selectedLocations.join(','));
      } else {
        searchParams.delete('locations');
      }
      setSearchParams(searchParams);
    }
  }, [state.selectedLocations, persistInURL, searchParams, setSearchParams]);

  // Initialize from URL
  useEffect(() => {
    if (persistInURL) {
      const urlLocations = searchParams.get('locations');
      if (urlLocations) {
        const locations = urlLocations.split(',').filter(Boolean);
        setState(prev => ({
          ...prev,
          selectedLocations: locations
        }));
      }
    }
  }, [persistInURL, searchParams]);

  return {
    ...state,
    fetchLocations,
    toggleLocation,
    selectAllLocations,
    clearLocations,
    filterOrdersByLocation,
    hasSelection: state.selectedLocations.length > 0,
    isAllSelected: state.selectedLocations.length === state.availableLocations.length
  };
};