'use client';

import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
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

function renderError(title: string, children: React.ReactNode) {
  return (
    <div className="w-full h-full min-h-screen bg-muted flex items-center justify-center p-4 text-center">
      <div className="max-w-lg bg-card p-8 rounded-lg shadow-lg border-destructive/50 border">
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
}

const MissingApiKeyError = () => renderError("Google Maps API Key is Missing", (
  <>
    <div className="text-left space-y-4 text-muted-foreground">
        <p>To display the map, please follow these steps:</p>
        <ol className="list-decimal list-inside space-y-3">
            <li>
                <strong>Generate a New API Key:</strong><br/>
                Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Credentials page</a>, click <strong>"+ CREATE CREDENTIALS"</strong> and select <strong>"API key"</strong>.
            </li>
            <li>
                <strong>Add the Key to Your Project:</strong><br/>
                Create a file named <code className="font-mono bg-background p-1 rounded-sm text-sm">.env.local</code> in your project's root directory and add the key you just created:
                <pre className="bg-background text-left p-2 rounded-md mt-2 overflow-x-auto text-sm">
                    <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY</code>
                </pre>
            </li>
            <li>
                <strong>Enable Required APIs:</strong><br/>
                In the <a href="https://console.cloud.google.com/apis/library" target="_blank" rel="noopener noreferrer" className="text-primary underline">API Library</a>, search for and enable both the <strong>"Maps JavaScript API"</strong> and the <strong>"Geocoding API"</strong>.
            </li>
            <li>
                <strong>Enable Billing:</strong><br/>
                The Google Maps Platform requires billing. Go to the <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Billing page</a> and ensure your project is linked to a billing account.
            </li>
             <li>
                <strong>Restart Your Server:</strong><br/>
                Stop your development server and run <code className="font-mono bg-background p-1 rounded-sm text-sm">npm run dev</code> again.
            </li>
        </ol>
    </div>
  </>
));

export default function MoodMap({ regions, onSelectRegion }: MoodMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!isClient) {
    return <Skeleton className="w-full h-full min-h-screen" />;
  }

  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    return <MissingApiKeyError />;
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
        >
          <MapInner regions={regions} onSelectRegion={onSelectRegion} />
        </Map>
        <MapStatusManager />
      </APIProvider>
    </div>
  );
}


function MapStatusManager() {
  const map = useMap();
  const eventLibrary = useMapsLibrary('event');
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    if (!map || !eventLibrary) return;

    const authFailureListener = eventLibrary.addDomListener(
      window,
      'gm_authFailure',
      () => {
        setAuthFailed(true);
      }
    );
    
    // Check if the map has already failed to load
    // This can happen if the auth error occurs before the listener is attached
    const tilesLoadedListener = eventLibrary.addListener(map, 'tilesloaded', () => {
        const mapDiv = map.getDiv();
        if (mapDiv.querySelector('a[href*="error-messages"]')) {
            setAuthFailed(true);
        }
    });

    return () => {
      eventLibrary.removeListener(authFailureListener);
      eventLibrary.removeListener(tilesLoadedListener);
    };
  }, [map, eventLibrary]);

  if (authFailed) {
    return <MissingApiKeyError />;
  }

  return null;
}


function MapInner({ regions, onSelectRegion }: MoodMapProps) {
    const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  
    return (
      <>
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
      </>
    );
  }
