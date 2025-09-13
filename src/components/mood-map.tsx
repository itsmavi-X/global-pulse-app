'use client';

import { APIProvider, Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { type RegionData } from '@/lib/data';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { AlertTriangle } from 'lucide-react';

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

function MapComponent({ regions, onSelectRegion }: MoodMapProps) {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  
  return (
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
  )
}

function MapStatusManager({ onAuthFailure }: { onAuthFailure: () => void }) {
  const coreLibrary = useMapsLibrary('core');
  
  useEffect(() => {
    if (!coreLibrary) return;

    const authFailureListener = coreLibrary.maps.event.addDomListener(
      window,
      'gm_authFailure',
      () => {
        onAuthFailure();
      }
    );

    return () => {
      coreLibrary.maps.event.removeListener(authFailureListener);
    };
  }, [coreLibrary, onAuthFailure]);

  return null;
}


export default function MoodMap({ regions, onSelectRegion }: MoodMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [authFailed, setAuthFailed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Skeleton className="w-full h-full min-h-screen" />;
  }
  
  const renderError = (title: string, children: React.ReactNode) => (
    <div className="w-full h-full min-h-screen bg-muted flex items-center justify-center p-4 text-center">
      <div className="max-w-md bg-card p-8 rounded-lg shadow-lg border-destructive/50 border">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-destructive">{title}</h2>
        {children}
      </div>
    </div>
  );

  if (authFailed) {
    return renderError("Map Authentication Failed", (
      <>
        <p className="text-muted-foreground">
          There is a problem with your Google Maps API key. The map could not be loaded. This is usually caused by one of the following issues:
        </p>
        <ul className="text-sm text-muted-foreground/80 list-disc list-inside text-left my-4 space-y-1">
          <li>The API key is incorrect or invalid.</li>
          <li>The "Maps JavaScript API" is not enabled in your Google Cloud project.</li>
          <li>Billing is not enabled for your Google Cloud project.</li>
          <li>The API key has restrictions (e.g., HTTP referrers) that are blocking access.</li>
        </ul>
        <p className="text-muted-foreground mt-4">
          Please check your settings in the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a> and ensure your key is configured correctly.
        </p>
      </>
    ));
  }

  if (!apiKey) {
    return renderError("Google Maps API Key is Missing", (
      <>
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
      </>
    ));
  }

  return (
    <div className="w-full h-screen">
      <APIProvider apiKey={apiKey}>
        <MapStatusManager onAuthFailure={() => setAuthFailed(true)} />
        <MapComponent regions={regions} onSelectRegion={onSelectRegion} />
      </APIProvider>
    </div>
  );
}
