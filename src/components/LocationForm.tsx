'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface LocationFormProps {
  onLocationSubmit: (location: string | { lat: number; lon: number }) => void;
  loading: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({ onLocationSubmit, loading }) => {
  const [city, setCity] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onLocationSubmit(city.trim());
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSubmit({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          // Potentially show a toast notification here
          alert(`Error: ${error.message}. Please ensure location services are enabled and permissions granted.`);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="mb-8 p-4 bg-primary/10 rounded-lg shadow-md">
      <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g., London)"
          className="flex-grow bg-background/80 focus:bg-background"
          aria-label="Enter city name"
          disabled={loading}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={loading || !city.trim()}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>
      <Button onClick={handleGeolocation} variant="outline" className="w-full" disabled={loading}>
        <MapPin className="mr-2 h-4 w-4" /> Use My Current Location
      </Button>
    </div>
  );
};

export default LocationForm;
