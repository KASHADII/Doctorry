import React, { useEffect, useRef, useState } from 'react';

const PharmacyMap = () => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  // Authentic dummy pharmacy data for Nabha district, Punjab
  const pharmacies = [
    {
      id: 1,
      name: "Prem Medical Store",
      address: "Near Railway Station, Nabha",
      phone: "+91-1765-220123",
      timings: "8:00 AM - 10:00 PM",
      lat: 30.3750,
      lng: 76.1465,
      services: ["Prescription Medicines", "OTC Drugs", "Health Supplements"]
    },
    {
      id: 2,
      name: "Indu Medical Agencies",
      address: "Main Bazaar, Nabha",
      phone: "+91-1765-220456",
      timings: "9:00 AM - 9:00 PM",
      lat: 30.3735,
      lng: 76.1440,
      services: ["Prescription Medicines", "Medical Equipment", "Home Delivery"]
    },
    {
      id: 3,
      name: "Mittal Medicos",
      address: "Gurudwara Road, Nabha",
      phone: "+91-1765-220789",
      timings: "8:30 AM - 10:30 PM",
      lat: 30.3760,
      lng: 76.1470,
      services: ["Prescription Medicines", "Ayurvedic Medicines", "Health Checkup"]
    },
    {
      id: 4,
      name: "JP Pharmacy",
      address: "Bus Stand Road, Nabha",
      phone: "+91-1765-220234",
      timings: "7:00 AM - 11:00 PM",
      lat: 30.3748,
      lng: 76.1452,
      services: ["Prescription Medicines", "Emergency Medicines", "24/7 Service"]
    },
    {
      id: 5,
      name: "Punjab Medical Store",
      address: "College Road, Nabha",
      phone: "+91-1765-220567",
      timings: "9:00 AM - 8:00 PM",
      lat: 30.3755,
      lng: 76.1460,
      services: ["Prescription Medicines", "Veterinary Medicines", "Health Consultations"]
    },
    {
      id: 6,
      name: "Saini Medical Hall",
      address: "Hospital Road, Nabha",
      phone: "+91-1765-220890",
      timings: "8:00 AM - 9:00 PM",
      lat: 30.3740,
      lng: 76.1455,
      services: ["Prescription Medicines", "Surgical Items", "Medical Tests"]
    },
    {
      id: 7,
      name: "Raj Medical Store",
      address: "Market Area, Nabha",
      phone: "+91-1765-220123",
      timings: "8:30 AM - 9:30 PM",
      lat: 30.3752,
      lng: 76.1468,
      services: ["Prescription Medicines", "Baby Care Products", "Home Delivery"]
    },
    {
      id: 8,
      name: "City Medical Center",
      address: "Civil Lines, Nabha",
      phone: "+91-1765-220456",
      timings: "9:00 AM - 10:00 PM",
      lat: 30.3738,
      lng: 76.1445,
      services: ["Prescription Medicines", "Chronic Disease Management", "Health Monitoring"]
    }
  ];

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setMapScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD26SBpP1s_j62OvJv5_hA4ZtthHNpkjTo"}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Set up global callback
      window.initMap = () => {
        setMapScriptLoaded(true);
      };

      document.head.appendChild(script);

      return () => {
        // Cleanup script
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete window.initMap;
      };
    };

    const cleanup = loadGoogleMapsScript();
    return cleanup;
  }, []);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!mapScriptLoaded || !mapRef.current) return;

    const initMap = () => {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 30.3745, lng: 76.1459 },
          zoom: 14,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Create markers
        pharmacies.forEach((pharmacy) => {
          const marker = new window.google.maps.Marker({
            position: { lat: pharmacy.lat, lng: pharmacy.lng },
            map: map,
            title: pharmacy.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
                  <path d="M12 16h16v8H12z" fill="white"/>
                  <path d="M16 12h8v4h-8z" fill="white"/>
                  <path d="M18 14h4v2h-4z" fill="#3B82F6"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-4 max-w-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${pharmacy.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${pharmacy.address}</p>
                <p class="text-sm text-gray-600 mb-2">📞 ${pharmacy.phone}</p>
                <p class="text-sm text-gray-600 mb-3">🕒 ${pharmacy.timings}</p>
                <div class="text-xs text-gray-500">
                  <strong>Services:</strong><br/>
                  ${pharmacy.services.map(service => `• ${service}`).join('<br/>')}
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });

        setIsLoaded(true);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please check your internet connection.');
      }
    };

    initMap();
  }, [mapScriptLoaded]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pharmacies in Nabha District</h2>
        <p className="text-gray-600">Find nearby pharmacies and their services. Click on markers for more details.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-96 w-full relative">
          <div className="h-full w-full" ref={mapRef}></div>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pharmacy List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Pharmacies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-2">{pharmacy.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{pharmacy.address}</p>
              <p className="text-sm text-gray-600 mb-2">📞 {pharmacy.phone}</p>
              <p className="text-sm text-gray-600 mb-3">🕒 {pharmacy.timings}</p>
              <div className="text-xs text-gray-500">
                <strong>Services:</strong>
                <ul className="mt-1">
                  {pharmacy.services.map((service, index) => (
                    <li key={index}>• {service}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmacyMap;
