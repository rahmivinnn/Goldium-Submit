import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Tweet {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  image?: string;
}

const mockTweets: Tweet[] = [
  {
    id: '1',
    user: {
      name: 'Solana',
      username: 'solana',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: 'The future of DeFi is here. Fast, cheap, and scalable transactions on Solana are changing the game. 🚀\n\nJoin millions already building on #Solana',
    timestamp: '2h',
    likes: 2847,
    retweets: 891,
    replies: 234,
  },
  {
    id: '2',
    user: {
      name: 'Phantom',
      username: 'phantom',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: 'New feature alert! 👻\n\nSwap tokens directly in your Phantom wallet with zero fees on select pairs. The DeFi experience just got smoother.',
    timestamp: '4h',
    likes: 1523,
    retweets: 456,
    replies: 89,
  },
  {
    id: '3',
    user: {
      name: 'Jupiter Exchange',
      username: 'JupiterExchange',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: 'Volume Update 📊\n\n24h Trading Volume: $847M\nActive Users: 125K+\nTotal Swaps: 2.1M\n\nJupiter continues to lead Solana DeFi! 🪐',
    timestamp: '6h',
    likes: 934,
    retweets: 267,
    replies: 45,
  },
  {
    id: '4',
    user: {
      name: 'Goldium DeFi',
      username: 'GoldiumDeFi',
      avatar: '/api/placeholder/40/40',
      verified: false
    },
    content: '🎮 NEW: Solana Shard Chase is now LIVE!\n\nReal-time multiplayer gaming meets DeFi:\n✅ Collect shards, earn GOLD tokens\n✅ Compete with hunters globally\n✅ Connect with Phantom, Solflare, Trust Wallet\n\nPlay now and turn gaming into earning! 🏆',
    timestamp: '1h',
    likes: 156,
    retweets: 78,
    replies: 23,
  }
];

export function TwitterEmbed() {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">𝕏</span>
        </div>
        Latest from Solana Ecosystem
      </h3>
      
      {mockTweets.map((tweet) => (
        <Card key={tweet.id} className="bg-black/40 border-gray-800 hover:bg-black/60 transition-colors">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={tweet.user.avatar} />
                <AvatarFallback>{tweet.user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white hover:underline cursor-pointer">
                    {tweet.user.name}
                  </span>
                  {tweet.user.verified && (
                    <Verified className="w-4 h-4 text-blue-500 fill-current" />
                  )}
                  <span className="text-gray-500 text-sm">
                    @{tweet.user.username}
                  </span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm hover:underline cursor-pointer">
                    {tweet.timestamp}
                  </span>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-300 hover:bg-gray-800">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="ml-13">
              <p className="text-white whitespace-pre-line mb-3 leading-relaxed">
                {tweet.content}
              </p>

              {/* Interaction Buttons */}
              <div className="flex items-center justify-between max-w-md">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(tweet.replies)}</span>
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-green-500 hover:bg-green-500/10 flex items-center gap-2"
                >
                  <Repeat2 className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(tweet.retweets)}</span>
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(tweet.likes)}</span>
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10"
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <Card className="bg-gray-900/40 border-gray-700">
        <div className="p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Stay updated with the latest Solana and DeFi news</p>
          <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
            Follow @solana on 𝕏
          </Button>
        </div>
      </Card>
    </div>
  );
}