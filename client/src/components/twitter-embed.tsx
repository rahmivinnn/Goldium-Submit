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

const goldiumTweets: Tweet[] = [
  {
    id: '1',
    user: {
      name: 'Goldium Official',
      username: 'GoldiumOfficial',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: '🚀 GOLDIUM is revolutionizing DeFi on Solana! \n\n✨ Swap SOL ↔ GOLD with zero slippage\n🔒 Stake GOLD tokens for 5% APY\n🎮 Play & Earn with Solana Shard Chase\n\n#Goldium #GOLD #SolanaDeFi',
    timestamp: '1h',
    likes: 1247,
    retweets: 389,
    replies: 156,
  },
  {
    id: '2',
    user: {
      name: 'GOLD Token',
      username: 'GOLDToken',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: '📈 GOLD Token Performance Update:\n\n💰 Current Price: 0.00004654 SOL\n📊 24h Volume: 48.4K GOLD\n🔥 Total Staked: 2.1M GOLD\n⚡ Transactions: 15,000+\n\nThe future of digital gold is here! 🏆',
    timestamp: '3h',
    likes: 892,
    retweets: 234,
    replies: 67,
  },
  {
    id: '3',
    user: {
      name: 'DeFi Hunter',
      username: 'DeFiHunter_Sol',
      avatar: '/api/placeholder/40/40',
      verified: false
    },
    content: 'Just tried @GoldiumOfficial and WOW! 🤯\n\n✅ Seamless wallet connection\n✅ Lightning-fast swaps\n✅ Real staking rewards\n✅ Amazing UI/UX\n\nThis is what DeFi should feel like! #Goldium #GOLD',
    timestamp: '5h',
    likes: 456,
    retweets: 123,
    replies: 34,
  },
  {
    id: '4',
    user: {
      name: 'Solana Ecosystem',
      username: 'SolanaEco',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    content: '🌟 Featured Project Spotlight: GOLDIUM\n\nBuilding the next generation of DeFi infrastructure on Solana with:\n🔸 Advanced staking mechanisms\n🔸 Gaming integration\n🔸 Real-time analytics\n\nThe ecosystem keeps growing! 🚀',
    timestamp: '8h',
    likes: 1834,
    retweets: 567,
    replies: 189,
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
        Latest from Goldium Community
      </h3>
      
      {goldiumTweets.map((tweet) => (
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