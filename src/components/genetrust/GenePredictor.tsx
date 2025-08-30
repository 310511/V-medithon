import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dna, 
  FlaskConical, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ArrowLeft,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PredictionResult {
  originalSequence: string;
  editedSequence: string;
  changeIndicator: string;
  efficiency: number;
  changedPosition: number;
  originalBase: string;
  newBase: string;
  message: string;
  originalEfficiency: number;
}

const GenePredictor = () => {
  const navigate = useNavigate();
  const [sequence, setSequence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Basic validation
    const cleanedSequence = sequence.trim().toUpperCase();
    if (!cleanedSequence) {
      setError('Please enter a DNA sequence');
      setIsLoading(false);
      return;
    }

    if (!/^[ATCG]+$/.test(cleanedSequence)) {
      setError('Invalid DNA sequence. Only A, T, C, G bases are allowed.');
      setIsLoading(false);
      return;
    }

    if (cleanedSequence.length !== 20) {
      setError('DNA sequence must be exactly 20 characters long for Gene prediction.');
      setIsLoading(false);
      return;
    }

    try {
      // For now, we'll simulate the API call
      // In production, this would call the actual DNABERT service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated result
      const simulatedResult: PredictionResult = {
        originalSequence: cleanedSequence,
        editedSequence: cleanedSequence.substring(0, 10) + 'G' + cleanedSequence.substring(11),
        changeIndicator: 'G',
        efficiency: 0.89,
        changedPosition: 10,
        originalBase: cleanedSequence.charAt(10),
        newBase: 'G',
        message: 'Optimized base change at position 10 for improved CRISPR efficiency',
        originalEfficiency: 0.76
      };

      setResult(simulatedResult);
      toast.success('Prediction successful! Your DNA sequence has been analyzed.');
    } catch (err: any) {
      setError(err.message || 'An error occurred while getting the prediction');
      toast.error('Prediction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSequenceComparison = () => {
    if (!result) return null;

    const { originalSequence, editedSequence, changedPosition } = result;

    const beforeChange = originalSequence.substring(0, changedPosition);
    const originalBase = originalSequence.charAt(changedPosition);
    const afterChange = originalSequence.substring(changedPosition + 1);

    const beforeNewBase = editedSequence.substring(0, changedPosition);
    const newBase = editedSequence.charAt(changedPosition);
    const afterNewBase = editedSequence.substring(changedPosition + 1);

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Sequence Comparison</h4>
          <div className="font-mono text-sm space-y-2">
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400 mr-2">Original:</span>
              <span className="text-gray-900 dark:text-white">{beforeChange}</span>
              <Badge variant="destructive" className="mx-1">{originalBase}</Badge>
              <span className="text-gray-900 dark:text-white">{afterChange}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400 mr-2">Edited:  </span>
              <span className="text-gray-900 dark:text-white">{beforeNewBase}</span>
              <Badge variant="default" className="mx-1 bg-green-600">{newBase}</Badge>
              <span className="text-gray-900 dark:text-white">{afterNewBase}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Position changed: {changedPosition} (0-indexed)
          </p>
        </div>
      </div>
    );
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
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mr-4">
              <Dna className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Gene Predictor
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced CRISPR guide RNA design using DNABERT-2 model
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-fit">
              <CardHeader>
                                 <CardTitle className="flex items-center">
                   <FlaskConical className="w-5 h-5 mr-2 text-blue-600" />
                   DNA Sequence Input
                 </CardTitle>
                <CardDescription>
                  Submit a 20-base DNA sequence to predict optimal Gene editing changes for improved efficiency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sequence">DNA Sequence (20 bases)</Label>
                    <Input
                      id="sequence"
                      value={sequence}
                      onChange={(e) => setSequence(e.target.value.toUpperCase())}
                      placeholder="ATCGATCGATCGATCGATCG"
                      pattern="[ATCGatcg]{20}"
                      className="font-mono text-lg"
                      maxLength={20}
                      disabled={isLoading}
                    />
                    {error && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {error}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Enter exactly 20 DNA bases (A, T, C, G only)
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={!sequence || sequence.length !== 20 || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Predict Gene Edits
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading && (
              <Card className="h-fit">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Analyzing DNA Sequence
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Running DNABERT-2 model analysis...
                  </p>
                </CardContent>
              </Card>
            )}

            {result && (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Prediction Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderSequenceComparison()}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {(result.originalEfficiency * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-600">Original Efficiency</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(result.efficiency * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-green-600">New Efficiency</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Recommended Change
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">{result.message}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="text-center">
            <CardContent className="p-6">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Precision Targeting</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Advanced algorithms ensure minimal off-target effects in CRISPR editing
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Efficiency Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI-powered predictions for optimal guide RNA design and success rates
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Continuous Learning</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Model improves with each prediction and user feedback
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export { GenePredictor };
