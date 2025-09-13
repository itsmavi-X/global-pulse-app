export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface RegionData {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
  sentiment: Sentiment;
  positiveKeywords: string[];
  negativeKeywords: string[];
  digest: string;
}

export const regions: RegionData[] = [
  {
    id: 'usa',
    name: 'USA',
    coords: { lat: 39.8283, lng: -98.5795 },
    sentiment: 'positive',
    positiveKeywords: ['AI regulation', 'innovation', 'jobs'],
    negativeKeywords: ['healthcare costs', 'partisanship'],
    digest: 'People in the USA are hopeful about AI regulation, which is seen as a driver for innovation and job creation.'
  },
  {
    id: 'india',
    name: 'India',
    coords: { lat: 20.5937, lng: 78.9629 },
    sentiment: 'negative',
    positiveKeywords: ['startups', 'tech growth'],
    negativeKeywords: ['inflation', 'unemployment', 'heatwave'],
    digest: 'In India, there is significant anxiety about rising inflation and unemployment, compounded by a severe heatwave.'
  },
  {
    id: 'brazil',
    name: 'Brazil',
    coords: { lat: -14.2350, lng: -51.9253 },
    sentiment: 'neutral',
    positiveKeywords: ['Carnival', 'tourism'],
    negativeKeywords: ['deforestation', 'political instability'],
    digest: 'Sentiment in Brazil is mixed, with excitement for tourism around Carnival balanced by concerns over deforestation.'
  },
  {
    id: 'japan',
    name: 'Japan',
    coords: { lat: 36.2048, lng: 138.2529 },
    sentiment: 'neutral',
    positiveKeywords: ['technology', 'cultural exports'],
    negativeKeywords: ['aging population', 'economic stagnation'],
    digest: 'Japan shows neutral sentiment, with pride in technology and culture offset by worries about an aging population.'
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    coords: { lat: 9.0820, lng: 8.6753 },
    sentiment: 'positive',
    positiveKeywords: ['Nollywood', 'fintech', 'youth entrepreneurship'],
    negativeKeywords: ['insecurity', 'infrastructure'],
    digest: 'A positive wave is seen in Nigeria, fueled by the success of Nollywood, a booming fintech sector, and youth entrepreneurship.'
  },
  {
    id: 'germany',
    name: 'Germany',
    coords: { lat: 51.1657, lng: 10.4515 },
    sentiment: 'negative',
    positiveKeywords: ['renewable energy', 'manufacturing'],
    negativeKeywords: ['energy crisis', 'recession fears', 'immigration'],
    digest: 'Fears of a recession and an ongoing energy crisis are creating negative sentiment in Germany, despite progress in renewable energy.'
  },
  {
    id: 'australia',
    name: 'Australia',
    coords: { lat: -25.2744, lng: 133.7751 },
    sentiment: 'positive',
    positiveKeywords: ['work-life balance', 'nature', 'sports'],
    negativeKeywords: ['housing prices', 'wildfires'],
    digest: 'Australians are expressing positive sentiment, focused on work-life balance and a love for nature and sports.'
  },
];

export const emergingTrend = {
    title: "Global Shift Towards Climate Anxiety",
    summary: "A significant increase in negative sentiment related to climate change has been detected across Europe and North America, with keywords like 'climate anxiety', 'heatwave', and 'eco-grief' trending. This suggests a growing public concern that is starting to overshadow regional economic issues."
};
