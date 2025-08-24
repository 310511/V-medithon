import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Lock, 
  Unlock, 
  Dna, 
  Activity, 
  AlertTriangle, 
  Heart, 
  Brain, 
  Eye,
  Globe,
  Smartphone,
  Watch,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Database,
  Key,
  Hospital,
  Stethoscope,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  X
} from 'lucide-react';

const GeneticEmergencySystem: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentEmergency, setCurrentEmergency] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const emergencies = [
    {
      title: "Unconscious Patient",
      description: "Patient arrives unconscious with unknown medical history",
      solution: "Instant genetic profile reveals drug allergies and conditions",
      timeSaved: "2-3 hours",
      icon: <AlertCircle className="w-8 h-8" />
    },
    {
      title: "Rare Drug Reaction",
      description: "Patient experiencing severe allergic reaction to medication",
      solution: "AI identifies genetic markers for drug sensitivity",
      timeSaved: "30-45 minutes",
      icon: <AlertTriangle className="w-8 h-8" />
    },
    {
      title: "Unknown Genetic Disorder",
      description: "Child with mysterious symptoms and no diagnosis",
      solution: "Genetic database cross-reference reveals rare condition",
      timeSaved: "Days to weeks",
      icon: <Brain className="w-8 h-8" />
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentEmergency((prev) => (prev + 1) % emergencies.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, emergencies.length]);

  const toggleDemo = () => {
    setShowDemo(!showDemo);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/20 to-green-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 opacity-10">
            <Dna className="w-96 h-96 text-blue-400 animate-pulse" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-10">
            <Shield className="w-96 h-96 text-green-400 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Dna className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-ping">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                Your Genetic Lifeline, Always Secure
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                AI-driven genetic assistance system with blockchain-secured emergency keys. 
                Instant access to critical genetic data when every second counts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={toggleDemo}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Learn How It Works
                </motion.button>
                
                <motion.button
                  className="inline-flex items-center px-8 py-4 border border-blue-400 text-blue-400 font-semibold rounded-lg hover:bg-blue-400/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  View Security Features
                </motion.button>
              </div>
            </motion.div>

            {/* Emergency Stats */}
            <motion.div 
              className="grid md:grid-cols-4 gap-6 mt-16"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { label: "Lives Saved", value: "2,847", icon: <Heart className="w-6 h-6" /> },
                { label: "Response Time", value: "<30s", icon: <Zap className="w-6 h-6" /> },
                { label: "Hospitals", value: "1,234", icon: <Hospital className="w-6 h-6" /> },
                { label: "Success Rate", value: "99.9%", icon: <CheckCircle className="w-6 h-6" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg mb-4 mx-auto">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From genetic data to emergency access in seconds
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Genetic Data Collection",
                  description: "Secure collection and analysis of genetic information",
                  icon: <Dna className="w-8 h-8" />,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  step: "2",
                  title: "AI Analysis",
                  description: "Advanced AI processes and identifies critical markers",
                  icon: <Brain className="w-8 h-8" />,
                  color: "from-purple-500 to-pink-500"
                },
                {
                  step: "3",
                  title: "Blockchain Key Creation",
                  description: "Tamper-proof emergency keys stored on blockchain",
                  icon: <Key className="w-8 h-8" />,
                  color: "from-green-500 to-emerald-500"
                },
                {
                  step: "4",
                  title: "Hospital Access",
                  description: "Instant access for medical teams during emergencies",
                  icon: <Hospital className="w-8 h-8" />,
                  color: "from-red-500 to-orange-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white mb-6`}>
                      {item.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">Step {item.step}</div>
                    <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                  
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-blue-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Emergency Use Cases */}
        <motion.section 
          className="py-20 px-4 sm:px-6 lg:px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Emergency Use Cases
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real scenarios where genetic emergency keys save lives
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {emergencies.map((emergency, index) => (
                <motion.div
                  key={index}
                  className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 transition-all duration-500 ${
                    index === currentEmergency ? 'border-blue-400 shadow-lg shadow-blue-400/25' : ''
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg mb-6">
                    {emergency.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{emergency.title}</h3>
                  <p className="text-gray-400 mb-4">{emergency.description}</p>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                    <div className="text-green-400 font-semibold mb-2">Solution:</div>
                    <p className="text-green-300 text-sm">{emergency.solution}</p>
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Time saved: {emergency.timeSaved}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'} Auto-rotation
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Why Blockchain + Genetics */}
        <motion.section 
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Why Blockchain + Genetics
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The perfect combination for secure, trustworthy genetic emergency access
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-8">
                  {[
                    {
                      title: "Immutability",
                      description: "Genetic data cannot be altered or tampered with once stored on the blockchain",
                      icon: <Lock className="w-6 h-6" />,
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      title: "Privacy",
                      description: "Zero-knowledge proofs ensure data privacy while maintaining accessibility",
                      icon: <Eye className="w-6 h-6" />,
                      color: "from-green-500 to-emerald-500"
                    },
                    {
                      title: "Trust",
                      description: "Decentralized verification ensures no single point of failure or control",
                      icon: <Shield className="w-6 h-6" />,
                      color: "from-purple-500 to-pink-500"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <span className="text-blue-400">Data Integrity</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <span className="text-green-400">Access Control</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <span className="text-purple-400">Audit Trail</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <span className="text-red-400">Emergency Override</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Database className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Future Vision */}
        <motion.section 
          className="py-20 px-4 sm:px-6 lg:px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Future Vision
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The roadmap to global genetic emergency response
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  phase: "Phase 1",
                  title: "Global Adoption",
                  description: "Integration with major hospital networks worldwide",
                  icon: <Globe className="w-8 h-8" />,
                  timeline: "2024-2025",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  phase: "Phase 2",
                  title: "AR Integration",
                  description: "Smart glasses for doctors with instant genetic data overlay",
                  icon: <Eye className="w-8 h-8" />,
                  timeline: "2025-2026",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  phase: "Phase 3",
                  title: "AI Prediction",
                  description: "Predictive genetic risk assessment and early intervention",
                  icon: <Brain className="w-8 h-8" />,
                  timeline: "2026-2027",
                  color: "from-purple-500 to-pink-500"
                }
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${phase.color} rounded-lg flex items-center justify-center text-white mb-6`}>
                    {phase.icon}
                  </div>
                  <div className="text-sm font-medium text-blue-400 mb-2">{phase.phase}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{phase.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{phase.description}</p>
                  <div className="text-sm text-gray-500">{phase.timeline}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Save Lives?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join the future of emergency genetic response. Every second counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Get Started Today
                </motion.button>
                <motion.button
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Contact Sales
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Demo Modal */}
        {showDemo && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Emergency Response Demo</h3>
                <button
                  onClick={toggleDemo}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                    <h4 className="text-xl font-semibold text-white">Emergency Alert</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Patient arrives unconscious at Emergency Room. No medical history available.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-yellow-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Time: 00:00:15</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Critical</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Key className="w-6 h-6 text-blue-400 mr-3" />
                    <h4 className="text-xl font-semibold text-white">Genetic Key Access</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Blockchain emergency key activated. Accessing patient's genetic profile...
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                  <div className="text-sm text-blue-400">Access granted in 2.3 seconds</div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                    <h4 className="text-xl font-semibold text-white">Genetic Profile Retrieved</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Drug Allergies</div>
                      <div className="text-white">Penicillin, Sulfa drugs</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Blood Type</div>
                      <div className="text-white">O Negative</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Genetic Conditions</div>
                      <div className="text-white">None detected</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Risk Factors</div>
                      <div className="text-white">Low cardiovascular risk</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Stethoscope className="w-6 h-6 text-purple-400 mr-3" />
                    <h4 className="text-xl font-semibold text-white">Treatment Recommendation</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    AI analysis complete. Safe treatment options identified based on genetic profile.
                  </p>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Patient stabilized successfully</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GeneticEmergencySystem;
