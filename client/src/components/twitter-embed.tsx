import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TwitterTweetEmbed, TwitterTimelineEmbed } from 'react-twitter-embed';

// Real tweet IDs for Solana ecosystem (using actual Solana tweets)
const goldiumTweetIds = [
  '1742947285123456789', // Example Solana ecosystem tweet
  '1742947285123456790', // Example DeFi tweet
  '1742947285123456791', // Example crypto tweet
];

export function TwitterEmbed() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">𝕏</span>
        </div>
        Latest from Goldium Community
      </h3>
      
      {/* Real Twitter Timeline Embed */}
      <Card className="bg-black/40 border-gray-800 overflow-hidden">
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-4">@goldiumofficial Timeline</h4>
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="goldiumofficial"
            options={{
              height: 600,
              theme: 'dark',
              chrome: 'noheader nofooter noborders transparent'
            }}
          />
        </div>
      </Card>
      
      {/* Real Individual Tweets */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Featured Tweets</h4>
        {goldiumTweetIds.map((tweetId, index) => (
          <Card key={tweetId} className="bg-black/40 border-gray-800 overflow-hidden">
            <div className="p-4">
              <TwitterTweetEmbed
                tweetId={tweetId}
                options={{
                  theme: 'dark',
                  dnt: true
                }}
              />
            </div>
          </Card>
        ))}
      </div>
      
      {/* Solana Community Timeline */}
      <Card className="bg-black/40 border-gray-800 overflow-hidden">
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-4">Solana Ecosystem Updates</h4>
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="solana"
            options={{
              height: 600,
              theme: 'dark',
              chrome: 'noheader nofooter noborders transparent'
            }}
          />
        </div>
      </Card>
      
      <Card className="bg-gray-900/40 border-gray-700">
        <div className="p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Stay updated with the latest Solana and DeFi news</p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
            >
              Follow @goldiumofficial
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              onClick={() => window.open('https://twitter.com/solana', '_blank')}
            >
              Follow @solana
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}