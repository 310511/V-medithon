import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Wallet,
  Database,
  Lock,
  FileText,
  Hash,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  hash: string;
  type: 'gene_prediction' | 'lab_data' | 'verification';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  blockNumber: number;
  dataHash: string;
  description: string;
}

interface VerificationResult {
  isValid: boolean;
  timestamp: string;
  blockNumber: number;
  dataHash: string;
  signature: string;
  verifiedBy: string;
}

const BlockchainVerification = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [dataHash, setDataHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Simulate wallet connection
  useEffect(() => {
    // Simulate connecting to wallet
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    }, 1000);
  }, []);

  // Initialize sample transactions
  useEffect(() => {
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        type: 'gene_prediction',
        status: 'confirmed',
        timestamp: '2024-01-15 14:30:22',
        blockNumber: 12345678,
        dataHash: '0xabc123def456...',
        description: 'CRISPR guide RNA prediction for sequence ATCGATCGATCGATCGATCG'
      },
      {
        id: '2',
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        type: 'lab_data',
        status: 'confirmed',
        timestamp: '2024-01-15 13:45:11',
        blockNumber: 12345675,
        dataHash: '0xdef456abc123...',
        description: 'Lab environmental data batch #2024-001'
      },
      {
        id: '3',
        hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
        type: 'verification',
        status: 'pending',
        timestamp: '2024-01-15 14:15:33',
        blockNumber: 12345679,
        dataHash: '0x789abc123def...',
        description: 'Data integrity verification request'
      }
    ];
    setTransactions(sampleTransactions);
  }, []);

  const connectWallet = async () => {
    toast.info('Connecting to wallet...');
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    toast.success('Wallet connected successfully!');
  };

  const verifyData = async () => {
    if (!dataHash.trim()) {
      toast.error('Please enter a data hash to verify');
      return;
    }

    setIsVerifying(true);
    toast.info('Verifying data on blockchain...');

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: VerificationResult = {
        isValid: true,
        timestamp: new Date().toISOString(),
        blockNumber: 12345680,
        dataHash: dataHash,
        signature: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        verifiedBy: walletAddress
      };

      setVerificationResult(result);
      toast.success('Data verification completed successfully!');
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gene_prediction':
        return <Database className="w-4 h-4" />;
      case 'lab_data':
        return <Activity className="w-4 h-4" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/genetrust')}
            className="mb-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to GeneTrust
          </Button>
          
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mr-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Blockchain Verification
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Secure data provenance and verification on Base blockchain
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-purple-600" />
                  Wallet Connection
                </CardTitle>
                <CardDescription>
                  Connect your wallet to verify data on the Base blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <Button 
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 dark:text-green-200 font-medium">Connected</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Base Network
                      </Badge>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wallet Address</div>
                      <div className="font-mono text-sm text-gray-900 dark:text-white">
                        {formatAddress(walletAddress)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Verification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-purple-600" />
                  Data Verification
                </CardTitle>
                <CardDescription>
                  Verify data integrity and provenance on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataHash">Data Hash</Label>
                  <Input
                    id="dataHash"
                    value={dataHash}
                    onChange={(e) => setDataHash(e.target.value)}
                    placeholder="0x1234567890abcdef..."
                    className="font-mono"
                    disabled={!isConnected}
                  />
                </div>
                
                <Button 
                  onClick={verifyData}
                  disabled={!isConnected || !dataHash.trim() || isVerifying}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isVerifying ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Data
                    </>
                  )}
                </Button>

                {verificationResult && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800 dark:text-green-200">
                        Verification Successful
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Block Number:</span>
                        <span className="font-mono">{verificationResult.blockNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                        <span>{new Date(verificationResult.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Verified By:</span>
                        <span className="font-mono">{formatAddress(verificationResult.verifiedBy)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-purple-600" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Track your blockchain transactions and data verifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                        {getTypeIcon(tx.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {tx.description}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Block #{tx.blockNumber} • {tx.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(tx.status)}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        as="a"
                        href={`https://basescan.org/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-2xl p-8 border border-purple-200 dark:border-purple-800"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Blockchain Security
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              All GeneTrust data is securely stored and verified on the Base blockchain, ensuring 
              data integrity, provenance tracking, and immutable audit trails for research compliance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Lock className="w-4 h-4 mr-2" />
                Immutable Records
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Hash className="w-4 h-4 mr-2" />
                Data Provenance
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Integrity Verification
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Audit Trails
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { BlockchainVerification };
