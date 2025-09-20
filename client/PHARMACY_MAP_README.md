# Pharmacy Map Feature

## Overview
Added an interactive map to the Pharmacy section showing pharmacy locations in Nabha district, Punjab, India.

## Features
- **Interactive Google Maps Integration**: Shows pharmacies with custom markers
- **Authentic Dummy Data**: 8 pharmacy locations with realistic names, addresses, and services
- **Detailed Information**: Each pharmacy marker shows:
  - Name and address
  - Phone number
  - Operating hours
  - Available services
- **Responsive Design**: Works on desktop and mobile devices
- **Pharmacy List**: Additional grid view of all pharmacies below the map

## Pharmacy Data
The following pharmacies are included with authentic-sounding names and locations:

1. **Prem Medical Store** - Near Railway Station
2. **Indu Medical Agencies** - Main Bazaar
3. **Mittal Medicos** - Gurudwara Road
4. **JP Pharmacy** - Bus Stand Road
5. **Punjab Medical Store** - College Road
6. **Saini Medical Hall** - Hospital Road
7. **Raj Medical Store** - Market Area
8. **City Medical Center** - Civil Lines

## Setup Instructions

### 1. Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
4. Create credentials (API Key)
5. **Important**: Create a Map ID for Advanced Markers:
   - Go to Map Management in Google Cloud Console
   - Create a new Map ID (e.g., "pharmacy-map")
   - Associate it with your project
6. Copy the API key to your `.env.local` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

### 2. Environment Configuration
Copy `env.example` to `.env.local` and add your Google Maps API key:
```bash
cp env.example .env.local
```

### 3. Dependencies
The following package was added:
- `@googlemaps/js-api-loader` - For Google Maps integration

## Usage
1. Navigate to the Pharmacy section from the navbar
2. View the interactive map with pharmacy markers
3. Click on any marker to see detailed pharmacy information
4. Browse the pharmacy list below the map for quick reference

## Technical Details
- **Map Center**: Nabha district coordinates (30.3745, 76.1459)
- **Zoom Level**: 14 (shows detailed street view)
- **Advanced Markers**: Uses Google's new AdvancedMarkerElement with PinElement
- **Map ID**: "pharmacy-map" (required for Advanced Markers)
- **Info Windows**: Detailed pharmacy information on marker click
- **Cleanup**: Proper component cleanup to prevent memory leaks
- **Error Handling**: Graceful fallback if map fails to load

## Files Modified/Created
- `client/src/components/PharmacyMap.jsx` - New map component
- `client/src/components/Pharmacy.jsx` - Updated to include map
- `client/env.example` - Added Google Maps API key configuration
- `client/package.json` - Added Google Maps dependency
