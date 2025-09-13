'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { type RegionData } from '@/lib/data';
import { useState } from 'react';

interface MoodMapProps {
  regions: RegionData[];
  onSelectRegion: (regionId: string) => void;
}

const sentimentColors: Record<string, string> = {
  positive: 'hsla(173, 58%, 39%, 0.7)',
  negative: 'hsla(12, 76%, 61%, 0.7)',
  neutral: 'hsla(43, 74%, 66%, 0.7)',
};

const sentimentColorsHover: Record<string, string> = {
  positive: 'hsla(173, 58%, 39%, 1)',
  negative: 'hsla(12, 76%, 61%, 1)',
  neutral: 'hsla(43, 74%, 66%, 1)',
};

export default function MoodMap({ regions, onSelectRegion }: MoodMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-screen bg-muted flex items-center justify-center p-4 text-center">
        <div className="max-w-md bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Google Maps API Key is missing</h2>
            <p className="text-muted-foreground">
                To display the map, please add your Google Maps API Key to your environment variables.
                Create a file named <code className="font-mono bg-background p-1 rounded-sm">.env.local</code> in the root of your project and add the following line:
            </p>
            <pre className="bg-background text-left p-2 rounded-md mt-4 overflow-x-auto text-sm">
                <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY</code>
            </pre>
            <p className="text-muted-foreground mt-4">
                You will also need to enable the "Maps JavaScript API" in your Google Cloud Console.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <APIProvider apiKey={apiKey}>
        <Map
          center={{ lat: 20, lng: 0 }}
          zoom={2.5}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={'a2c98e1f216259ac'}
          styles={[{featureType:"all",elementType:"labels.text.stroke",stylers:[{color:"#ffffff"},{weight:3}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{color:"#746855"}]}]}
        >
          {regions.map((region) => (
            <AdvancedMarker
              key={region.id}
              position={region.coords}
              onClick={() => onSelectRegion(region.id)}
              onPointerEnter={() => setHoveredRegionId(region.id)}
              onPointerLeave={() => setHoveredRegionId(null)}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-white/80 shadow-lg transition-all cursor-pointer"
                style={{
                  backgroundColor: hoveredRegionId === region.id ? sentimentColorsHover[region.sentiment] : sentimentColors[region.sentiment],
                  transform: hoveredRegionId === region.id ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                <span className="sr-only">{region.name} - {region.sentiment}</span>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
