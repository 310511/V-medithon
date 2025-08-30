import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  Minimize2, 
  Maximize2, 
  ArrowLeft,
  Brain,
  Lightbulb,
  BookOpen,
  Zap,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string;
}

interface AIAssistantProps {
  context?: string;
  systemMessage?: string;
  contextData?: any;
  initialMessage?: string;
  className?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  context = 'general',
  systemMessage,
  contextData,
  initialMessage = 'How can I help you with your research today?',
  className,
  expanded = true,
  onToggleExpand,
}) => {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
      context: 'Welcome to GeneTrust AI Assistant powered by Groq. I can help you with CRISPR design, experimental protocols, data analysis, and research guidance.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(input, context),
        timestamp: new Date(),
        context: context
      };

      setConversation(prev => [...prev, aiResponse]);
    } catch (error) {
      setError('Failed to get AI response. Please try again.');
      toast.error('AI response failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = (userInput: string, context: string): string => {
    const responses = {
      general: [
        "I'd be happy to help you with that! Could you provide more specific details about your research question?",
        "That's an interesting question. Let me break this down for you step by step.",
        "Based on current research, I can suggest several approaches to consider."
      ],
      crispr: [
        "For CRISPR guide RNA design, I recommend considering the target sequence specificity and potential off-target effects. The optimal length is typically 20 nucleotides.",
        "When designing CRISPR experiments, remember to include proper controls and validation steps. Would you like me to elaborate on any specific aspect?",
        "CRISPR efficiency can be significantly improved by optimizing the guide RNA sequence and delivery method."
      ],
      lab: [
        "For optimal experimental conditions, I recommend maintaining consistent temperature and humidity levels. Have you checked your current lab environment?",
        "Lab protocols should always include proper safety measures and documentation. What specific protocol are you working with?",
        "Environmental monitoring is crucial for reproducible results. Consider implementing real-time sensor tracking."
      ],
      analysis: [
        "Data analysis should begin with quality control checks. What type of data are you working with?",
        "Statistical validation is essential for robust conclusions. Have you considered multiple testing corrections?",
        "Visualization can reveal patterns that statistical tests might miss. What visualization methods are you using?"
      ]
    };

    const contextResponses = responses[context as keyof typeof responses] || responses.general;
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  };

  const clearConversation = () => {
    setConversation([{
      id: '1',
      type: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
      context: 'Welcome to GeneTrust AI Assistant powered by Groq. I can help you with CRISPR design, experimental protocols, data analysis, and research guidance.'
    }]);
    setError(null);
    toast.success('Conversation cleared!');
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'crispr':
        return <Brain className="w-4 h-4" />;
      case 'lab':
        return <BookOpen className="w-4 h-4" />;
      case 'analysis':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
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
            <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Research Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Groq-powered AI for experimental guidance and research assistance
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>GeneTrust AI Assistant</CardTitle>
                      <CardDescription>Powered by Groq AI</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearConversation}
                      className="h-8 w-8"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    {onToggleExpand && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleExpand}
                        className="h-8 w-8"
                      >
                        {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
                  <AnimatePresence initial={false}>
                    {conversation.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.type === 'assistant' && (
                              <div className="p-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-1">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              {message.context && (
                                <div className="mt-2 flex items-center space-x-1">
                                  {getContextIcon(message.context)}
                                  <span className="text-xs opacity-70 capitalize">{message.context}</span>
                                </div>
                              )}
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="border-t p-4">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me about CRISPR, lab protocols, or data analysis..."
                      className="flex-1"
                      disabled={isProcessing}
                    />
                    <Button 
                      type="submit" 
                      disabled={!input.trim() || isProcessing}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Context Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-600" />
                  AI Capabilities
                </CardTitle>
                <CardDescription>
                  What I can help you with
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">CRISPR Design</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Guide RNA optimization</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Lab Protocols</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Experimental guidance</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Data Analysis</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Statistical insights</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Research Ideas</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Innovation suggestions</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Start</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setInput("How do I design a CRISPR guide RNA for my target gene?")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      CRISPR Design Help
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setInput("What are the best practices for lab environmental monitoring?")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Lab Best Practices
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setInput("How should I analyze my gene expression data?")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Data Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-2xl p-8 border border-orange-200 dark:border-orange-800"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI-Powered Research
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              The GeneTrust AI Assistant leverages Groq's lightning-fast AI to provide instant, 
              accurate guidance for your genomic research. Get expert advice on experimental design, 
              data interpretation, and research methodology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Instant Responses
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                Expert Knowledge
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Research Guidance
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Lightbulb className="w-4 h-4 mr-2" />
                Innovation Support
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { AIAssistant };
