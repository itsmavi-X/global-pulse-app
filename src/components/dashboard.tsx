'use client';

import { useState, useMemo } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Globe } from 'lucide-react';
import SidebarContentComponent from '@/components/sidebar-content';
import MoodMap from '@/components/mood-map';
import { regions, emergingTrend, type RegionData, type Sentiment } from '@/lib/data';

export default function Dashboard() {
  const [filter, setFilter] = useState<Sentiment | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(regions[0]);

  const filteredRegions = useMemo(() => {
    if (filter === 'all') {
      return regions;
    }
    return regions.filter((r) => r.sentiment === filter);
  }, [filter]);

  const handleSelectRegion = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    setSelectedRegion(region || null);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg shadow-md">
              <Globe className="text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-headline font-bold">Global Pulse</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarContentComponent
            setFilter={setFilter}
            selectedRegion={selectedRegion}
            emergingTrend={emergingTrend}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="absolute top-4 left-4 z-10 md:hidden">
          <SidebarTrigger />
        </div>
        <MoodMap regions={filteredRegions} onSelectRegion={handleSelectRegion} />
      </SidebarInset>
    </SidebarProvider>
  );
}
