import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { transactionHistory, TransactionRecord } from '@/lib/transaction-history';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Get transactions and update every 5 seconds
    const updateTransactions = () => {
      const allTransactions = transactionHistory.getTransactions();
      setTransactions(allTransactions);
    };

    updateTransactions();
    const interval = setInterval(updateTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);

  const getStatusIcon = (status: TransactionRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTypeColor = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'swap':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'send':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'stake':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'unstake':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    }
  };

  const formatAmount = (amount?: number, token?: string) => {
    if (!amount || !token) return '';
    return `${amount.toFixed(4)} ${token}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (transactions.length === 0) {
    return (
      <Card className="bg-galaxy-card border-galaxy-purple/20">
        <CardHeader>
          <CardTitle className="text-galaxy-bright">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-galaxy-muted text-center py-4">
            No transactions yet. Start swapping, sending, or staking to see your history!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-galaxy-card border-galaxy-purple/20">
      <CardHeader>
        <CardTitle className="text-galaxy-bright flex items-center justify-between">
          Transaction History
          <Badge variant="outline" className="bg-galaxy-purple/20 text-galaxy-bright">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 rounded-lg bg-galaxy-secondary/20 border border-galaxy-purple/10"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(tx.status)}
              <div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(tx.type)}>
                    {tx.type.toUpperCase()}
                  </Badge>
                  {tx.type === 'swap' && (
                    <span className="text-sm text-galaxy-muted">
                      {formatAmount(tx.fromAmount, tx.fromToken)} → {formatAmount(tx.toAmount, tx.toToken)}
                    </span>
                  )}
                  {tx.type === 'send' && (
                    <span className="text-sm text-galaxy-muted">
                      {formatAmount(tx.fromAmount, tx.fromToken)} sent
                    </span>
                  )}
                  {(tx.type === 'stake' || tx.type === 'unstake') && (
                    <span className="text-sm text-galaxy-muted">
                      {formatAmount(tx.fromAmount || tx.toAmount, tx.fromToken || tx.toToken)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-galaxy-muted mt-1">
                  {formatTimestamp(tx.timestamp)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(tx.txUrl, '_blank')}
                className="h-8 w-8 p-0 hover:bg-galaxy-purple/20"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {transactions.length > 5 && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="border-galaxy-purple/30 hover:bg-galaxy-purple/10"
            >
              {showAll ? 'Show Less' : `Show All ${transactions.length} Transactions`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}