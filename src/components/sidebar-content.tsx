'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { type RegionData, type Sentiment } from '@/lib/data';
import { Filter, Frown, Meh, Smile, TrendingUp, Newspaper } from 'lucide-react';
import PostAnalyzer from './post-analyzer';

interface SidebarContentProps {
  setFilter: (filter: Sentiment | 'all') => void;
  selectedRegion: RegionData | null;
  emergingTrend: { title: string; summary: string };
}

export default function SidebarContentComponent({
  setFilter,
  selectedRegion,
  emergingTrend,
}: SidebarContentProps) {
  return (
    <div className="p-4 space-y-6">
      <PostAnalyzer />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter by Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="all" onValueChange={(value) => setFilter(value as Sentiment | 'all')} className="space-y-2">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer font-normal">All Moods</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="positive" id="positive" />
              <Label htmlFor="positive" className="flex items-center gap-2 cursor-pointer font-normal"><Smile className="text-[hsl(var(--chart-2))]" /> Positive</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="neutral" id="neutral" />
              <Label htmlFor="neutral" className="flex items-center gap-2 cursor-pointer font-normal"><Meh className="text-[hsl(var(--chart-4))]" /> Neutral</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="negative" id="negative" />
              <Label htmlFor="negative" className="flex items-center gap-2 cursor-pointer font-normal"><Frown className="text-[hsl(var(--chart-1))]" /> Negative</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Daily Emotional Digest
          </CardTitle>
          <CardDescription>
            {selectedRegion ? `Analysis for ${selectedRegion.name}` : 'Select a region on the map'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedRegion ? (
            <p className="text-sm">{selectedRegion.digest}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Click a marker on the map to see the detailed emotional digest for that region.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-accent/20 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-foreground">
            <TrendingUp className="w-5 h-5 text-accent" />
            Emerging Trends
          </CardTitle>
          <CardDescription className="text-accent-foreground/80">{emergingTrend.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{emergingTrend.summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
