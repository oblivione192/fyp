import { useState, useEffect } from 'react';

const useGeolocation = (options) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const errorHandler = (err) => {
      setError(err.message);
      setLoading(false);
    };
    
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      options
    ); 

    setLoading(true); 
    // If using watchPosition, return a cleanup function to clear the watch
    // return () => navigator.geolocation.clearWatch(watchId);
    return () => navigator.geolocation.clearWatch(watchId);  
  }, [options]); // Re-run if options change

  return { location, loading, error};
};

export default useGeolocation;