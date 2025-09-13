'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzePost, AnalyzePostOutput } from '@/ai/flows/analyze-post';
import { Loader2, Send, Wand2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export default function PostAnalyzer() {
  const [postText, setPostText] = useState(
    'Just saw the new AI announcements from Google. Feeling a mix of excitement and terror. The future is coming at us fast. #AI #FutureTech'
  );
  const [analysis, setAnalysis] = useState<AnalyzePostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!postText.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter some text to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzePost({ postText });
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze the post. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const getSentimentBadgeVariant = (sentiment: 'Positive' | 'Negative' | 'Neutral') => {
    switch (sentiment) {
      case 'Positive':
        return 'default';
      case 'Negative':
        return 'destructive';
      case 'Neutral':
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Analyze Post
        </CardTitle>
        <CardDescription>Enter any text to analyze its sentiment and trends.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter a social media post, comment, or any text..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          rows={4}
          disabled={isLoading}
        />
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send className="mr-2" />
              Analyze Sentiment
            </>
          )}
        </Button>
      </CardContent>

      {analysis && (
        <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
          <div className="w-full">
            <h3 className="font-semibold mb-2">Analysis Results</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Topic:</span>
                    <span className="font-medium">{analysis.topic}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Sentiment:</span>
                    <Badge variant={getSentimentBadgeVariant(analysis.sentiment)}>{analysis.sentiment}</Badge>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Intensity:</span>
                    <span className="font-medium">{analysis.emotionalIntensity}/10</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{analysis.country}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Subreddit:</span>
                    <span className="font-medium text-right">r/{analysis.subreddit}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Zeitgeist Pulse:</span>
                    <span className="font-medium">{analysis.zeitgeistPulse}/100</span>
                </div>
            </div>
          </div>
          <Separator />
          <div className="w-full space-y-2">
             <p className="text-sm text-muted-foreground leading-snug">{analysis.summary}</p>
             <div className="flex flex-wrap gap-2">
                {analysis.keywords.map(kw => <Badge key={kw} variant="outline">{kw}</Badge>)}
             </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}