import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Dna, 
  Monitor, 
  Shield, 
  Bot, 
  TrendingUp, 
  Activity,
  ArrowRight,
  FlaskConical,
  Database,
  Brain,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GeneTrustDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      id: 'gene-predictor',
      title: 'AI Gene Predictor',
      description: 'Advanced CRISPR guide RNA design using DNABERT-2 model',
      icon: Dna,
      color: 'from-blue-500 to-cyan-500',
      route: '/gene-predictor',
      status: 'active'
    },
    {
      id: 'lab-monitor',
      title: 'Real-Time Lab Monitoring',
      description: 'IoT sensor data visualization and environmental control',
      icon: Monitor,
      color: 'from-green-500 to-emerald-500',
      route: '/lab-monitor',
      status: 'active'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Verification',
      description: 'Secure data provenance on Base blockchain',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      route: '/blockchain-verification',
      status: 'active'
    },
    {
      id: 'ai-assistant',
      title: 'AI Research Assistant',
      description: 'Groq-powered AI for experimental guidance',
      icon: Bot,
      color: 'from-orange-500 to-red-500',
      route: '/ai-assistant',
      status: 'active'
    }
  ];

  const stats = [
    { label: 'Predictions Made', value: '1,247', change: '+12%', icon: TrendingUp },
    { label: 'Lab Sessions', value: '89', change: '+5%', icon: Activity },
    { label: 'Blockchain Transactions', value: '456', change: '+23%', icon: Database },
    { label: 'AI Interactions', value: '2,891', change: '+18%', icon: Brain }
  ];

  const handleFeatureClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mr-4">
              <Dna className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              GeneTrust AI Studio
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering precision gene editing with AI, IoT, and blockchain technology. 
            Seamlessly integrated into the CodeZilla ecosystem for comprehensive genomic research.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                onClick={() => handleFeatureClick(feature.route)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-full`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      variant={feature.status === 'active' ? 'default' : 'secondary'}
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="w-full group hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Integration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Seamlessly Integrated
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              GeneTrust features are fully integrated into the CodeZilla ecosystem, providing a unified 
              experience for researchers, biotech professionals, and students. All features maintain 
              consistent styling and navigation patterns.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <FlaskConical className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Monitor className="w-4 h-4 mr-2" />
                Real-Time
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Blockchain Secured
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Database className="w-4 h-4 mr-2" />
                IoT Connected
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { GeneTrustDashboard };
