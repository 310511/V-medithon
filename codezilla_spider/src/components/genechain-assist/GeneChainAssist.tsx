import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Users, 
  Brain, 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Dna,
  Network,
  Microscope,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Zap
} from 'lucide-react';

const GeneChainAssist: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const coreCapabilities = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Immutable Genetic Edit Log",
      description: "Every genetic modification is permanently recorded on the blockchain with cryptographic verification",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Smart Contract Safety Validation",
      description: "Automated safety checks ensure genetic edits meet regulatory and ethical standards",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Party Consent Management",
      description: "Secure consent tracking across patients, doctors, and regulatory bodies",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Risk Advisor",
      description: "Machine learning algorithms predict potential risks and suggest safer alternatives",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Post-Treatment Monitoring",
      description: "Continuous monitoring and reporting of treatment outcomes and side effects",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const integrationSteps = [
    { step: 1, title: "Lab Proposes Edit", description: "Genetic modification request submitted", icon: <Microscope /> },
    { step: 2, title: "Blockchain Validation", description: "Smart contracts verify safety protocols", icon: <Network /> },
    { step: 3, title: "Consent Collection", description: "Multi-party consent secured", icon: <UserCheck /> },
    { step: 4, title: "Treatment Execution", description: "Genetic therapy administered", icon: <Zap /> },
    { step: 5, title: "Monitoring", description: "Real-time outcome tracking", icon: <Activity /> },
    { step: 6, title: "Audit Log", description: "Complete treatment history recorded", icon: <ClipboardList /> }
  ];

  const stakeholderBenefits = [
    {
      role: "Patients",
      benefits: ["Transparent treatment tracking", "Enhanced safety guarantees", "Complete medical history"],
      icon: <Users className="w-6 h-6" />
    },
    {
      role: "Doctors",
      benefits: ["Compliance automation", "Risk assessment tools", "Treatment outcome analytics"],
      icon: <UserCheck className="w-6 h-6" />
    },
    {
      role: "Regulators",
      benefits: ["Real-time oversight", "Audit trail access", "Compliance verification"],
      icon: <Shield className="w-6 h-6" />
    },
    {
      role: "Researchers",
      benefits: ["Anonymized data access", "Treatment effectiveness studies", "Safety pattern analysis"],
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background DNA Motifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-5">
          <Dna className="w-96 h-96 text-blue-500 animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-5">
          <Network className="w-96 h-96 text-cyan-500 animate-pulse" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Feature Intro Section */}
        <motion.section 
          className="pt-20 pb-16 px-4 sm:px-6 lg:px-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              variants={fadeInUp}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                🔗 GeneChain Assist
              </motion.h1>
              <motion.p 
                className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
                variants={fadeInUp}
              >
                Blockchain-powered genetic therapy validation & safety module
              </motion.p>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                GeneChain Assist ensures transparency, safety, and compliance in genetic engineering treatments using blockchain and AI.
              </motion.p>
            </motion.div>

            {/* Side Illustration */}
            <motion.div 
              className="flex justify-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-200/50">
                  <div className="relative">
                    <Dna className="w-32 h-32 text-blue-500 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-20 animate-ping"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4">
                  <Network className="w-16 h-16 text-cyan-500 animate-bounce" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Why This Matters Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ensuring safe and traceable genetic interventions
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Problems */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                  Problems in Genetic Engineering
                </h3>
                <div className="space-y-4">
                  {[
                    "Lack of transparency in genetic modifications",
                    "Difficulty tracking treatment safety and outcomes",
                    "Complex regulatory compliance requirements",
                    "Limited audit trails for genetic interventions",
                    "Insufficient risk assessment tools"
                  ].map((problem, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">{problem}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Solutions */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  How GeneChain Assist Solves Them
                </h3>
                <div className="space-y-4">
                  {[
                    "Blockchain ensures immutable treatment records",
                    "AI-powered monitoring tracks outcomes in real-time",
                    "Smart contracts automate compliance checks",
                    "Complete audit trail for every genetic modification",
                    "Advanced risk assessment with ML algorithms"
                  ].map((solution, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300">{solution}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Interoperability:</strong> Seamlessly integrates with IoT monitoring, AI diagnosis, and health records modules for comprehensive patient care.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Core Capabilities Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Core Capabilities
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreCapabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  className="group relative p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${capability.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {capability.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {capability.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Integrates Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Integrates
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Seamless workflow from genetic modification proposal to treatment monitoring
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection Lines */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transform -translate-y-1/2"></div>
              
              <div className="grid lg:grid-cols-6 gap-4 lg:gap-8">
                {integrationSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`relative text-center ${index === activeStep ? 'scale-110' : 'scale-100'} transition-transform duration-500`}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white ${
                      index === activeStep 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50' 
                        : 'bg-gray-300 dark:bg-slate-600'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-slate-700">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                        Step {step.step}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Integration Context */}
            <motion.div 
              className="mt-12 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                System Integration Points
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400 font-medium">IoT Monitoring</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Real-time patient data</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-medium">AI Diagnosis</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Treatment recommendations</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-400 font-medium">Health Records</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Complete patient history</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stakeholder Benefits Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Stakeholder Benefits
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                How GeneChain Assist enhances workflows across the healthcare ecosystem
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stakeholderBenefits.map((stakeholder, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-4">
                    {stakeholder.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {stakeholder.role}
                  </h3>
                  <ul className="space-y-2">
                    {stakeholder.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer CTA Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                GeneChain Assist — building trust in the future of medicine
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join us in revolutionizing genetic therapy with blockchain-powered safety and transparency
              </p>
              <motion.button
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore More Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default GeneChainAssist;
