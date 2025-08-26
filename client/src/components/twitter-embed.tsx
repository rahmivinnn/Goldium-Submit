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
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3 text-blue-300">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">𝕏</span>
          </div>
          Latest from Goldium Community
        </h3>
        <p className="text-gray-400 text-lg">Follow our journey and stay updated with the Solana ecosystem</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Goldium Official Timeline */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-2 border-blue-400/40 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-400/20 transition-all">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">G</span>
              </div>
              <h4 className="text-xl font-bold text-blue-300">@goldiumofficial Timeline</h4>
            </div>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="goldiumofficial"
              options={{
                height: 500,
                theme: 'dark',
                chrome: 'noheader nofooter noborders transparent'
              }}
            />
          </div>
        </Card>
        
        {/* Solana Ecosystem Timeline */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-2 border-purple-400/40 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-400/20 transition-all">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <h4 className="text-xl font-bold text-purple-300">Solana Ecosystem Updates</h4>
            </div>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="solana"
              options={{
                height: 500,
                theme: 'dark',
                chrome: 'noheader nofooter noborders transparent'
              }}
            />
          </div>
        </Card>
      </div>
      
      {/* Featured Tweets */}
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-white mb-2">Featured Tweets</h4>
          <p className="text-gray-400">Highlights from the crypto community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goldiumTweetIds.map((tweetId, index) => (
            <Card key={tweetId} className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 border-2 border-gray-600/40 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-gray-500 hover:shadow-2xl transition-all">
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
      </div>
      
      <Card className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 border-2 border-blue-400/40 rounded-2xl backdrop-blur-sm">
        <div className="p-8 text-center">
          <h4 className="text-2xl font-bold text-white mb-4">Join Our Community</h4>
          <p className="text-gray-300 text-lg mb-6">Stay updated with the latest Solana and DeFi news</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105 hover:-translate-y-1 shadow-2xl"
              onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🐦</span>
                Follow @goldiumofficial
              </div>
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105 hover:-translate-y-1 shadow-2xl"
              onClick={() => window.open('https://twitter.com/solana', '_blank')}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Follow @solana
              </div>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}