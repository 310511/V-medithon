import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, CheckCircle, AlertTriangle, Clock, Zap, Shield, Users, Activity } from 'lucide-react';

interface Proposal {
  id: number;
  geneTarget: string;
  modificationType: string;
  patientId: string;
  description: string;
  riskLevel: string;
  status: string;
  timestamp: string;
  blockchainHash: string;
  validationScore: number;
}

interface ProposalDetailsProps {
  proposal: Proposal;
  onClose: () => void;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal, onClose }) => {
  const [validationStatus, setValidationStatus] = useState<'pending' | 'validating' | 'approved' | 'rejected'>('pending');
  const [consentStatus, setConsentStatus] = useState<{[key: string]: boolean}>({
    patient: false,
    doctor: false,
    regulator: false,
    ethicist: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [validationProgress, setValidationProgress] = useState(0);

  useEffect(() => {
    if (validationStatus === 'validating') {
      const interval = setInterval(() => {
        setValidationProgress(prev => {
          if (prev >= 100) {
            setValidationStatus('approved');
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [validationStatus]);

  const simulateValidation = () => {
    setValidationStatus('validating');
    setValidationProgress(0);
  };

  const toggleConsent = (stakeholder: string) => {
    setConsentStatus(prev => ({
      ...prev,
      [stakeholder]: !prev[stakeholder]
    }));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const allConsentsGranted = Object.values(consentStatus).every(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-gray-200 dark:border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Genetic Edit Proposal #{proposal.id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Proposal Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Proposal Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Gene Target:</span>
                  <p className="text-gray-900 dark:text-white font-medium">{proposal.geneTarget}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Modification Type:</span>
                  <p className="text-gray-900 dark:text-white font-medium capitalize">{proposal.modificationType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient ID:</span>
                  <p className="text-gray-900 dark:text-white font-medium">{proposal.patientId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Level:</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(proposal.riskLevel)}`}>
                    {proposal.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</span>
                <p className="text-gray-900 dark:text-white mt-1">{proposal.description}</p>
              </div>
            </div>

            {/* Blockchain Validation */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Blockchain Validation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blockchain Hash:</span>
                  <code className="text-xs text-blue-600 dark:text-blue-400 font-mono">{proposal.blockchainHash}</code>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Validation Score:</span>
                  <span className="text-sm font-bold text-green-600">{proposal.validationScore}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(validationStatus)}`}>
                    {validationStatus === 'validating' ? 'Validating...' : validationStatus.toUpperCase()}
                  </span>
                </div>
                
                {validationStatus === 'validating' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Validation Progress</span>
                      <span>{validationProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${validationProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {validationStatus === 'pending' && (
                  <button
                    onClick={simulateValidation}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Run Blockchain Validation
                  </button>
                )}
              </div>
            </div>

            {/* Workflow Progress */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Progress</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Proposal Submitted', icon: CheckCircle, completed: true },
                  { step: 2, title: 'Blockchain Validation', icon: validationStatus === 'approved' ? CheckCircle : Clock, completed: validationStatus === 'approved' },
                  { step: 3, title: 'Consent Collection', icon: allConsentsGranted ? CheckCircle : Clock, completed: allConsentsGranted },
                  { step: 4, title: 'Treatment Execution', icon: Clock, completed: false },
                  { step: 5, title: 'Monitoring', icon: Clock, completed: false },
                  { step: 6, title: 'Audit Log', icon: Clock, completed: false }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    item.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-slate-600'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.completed ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      item.completed ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Consent Management */}
          <div className="space-y-6">
            {/* Consent Management */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Multi-Party Consent
              </h3>
              <div className="space-y-4">
                {Object.entries(consentStatus).map(([stakeholder, hasConsent]) => (
                  <div key={stakeholder} className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {stakeholder} Consent
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stakeholder === 'patient' && 'Patient approval required'}
                        {stakeholder === 'doctor' && 'Medical professional approval'}
                        {stakeholder === 'regulator' && 'Regulatory body approval'}
                        {stakeholder === 'ethicist' && 'Ethics committee approval'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleConsent(stakeholder)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        hasConsent 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                      }`}
                    >
                      {hasConsent ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      <span>{hasConsent ? 'Granted' : 'Pending'}</span>
                    </button>
                  </div>
                ))}
              </div>
              
              {allConsentsGranted && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      All consents granted! Ready for execution.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Assessment */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Risk Assessment
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Safety Score:</span>
                  <span className="text-sm font-bold text-green-600">{100 - proposal.validationScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compliance Score:</span>
                  <span className="text-sm font-bold text-blue-600">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ethics Score:</span>
                  <span className="text-sm font-bold text-purple-600">88%</span>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created:</span>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(proposal.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated:</span>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
