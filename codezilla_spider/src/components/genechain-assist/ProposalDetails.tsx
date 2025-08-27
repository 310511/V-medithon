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
  isDarkMode?: boolean;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal, onClose, isDarkMode = true }) => {
  const [validationStatus, setValidationStatus] = useState<'pending' | 'validating' | 'approved' | 'rejected'>('pending');
  const [consentStatus, setConsentStatus] = useState<{[key: string]: boolean}>({
    patient: false,
    doctor: false,
    regulator: false,
    ethicist: false
  });

  useEffect(() => {
    // Simulate validation process
    const timer = setTimeout(() => {
      setValidationStatus('validating');
      setTimeout(() => {
        setValidationStatus(proposal.status === 'approved' ? 'approved' : 'rejected');
      }, 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [proposal.status]);

  const toggleConsent = (stakeholder: string) => {
    setConsentStatus(prev => ({
      ...prev,
      [stakeholder]: !prev[stakeholder]
    }));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return isDarkMode ? 'text-green-400 bg-green-900/20 border-green-500/30' : 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return isDarkMode ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return isDarkMode ? 'text-red-400 bg-red-900/20 border-red-500/30' : 'text-red-600 bg-red-50 border-red-200';
      default:
        return isDarkMode ? 'text-gray-400 bg-gray-900/20 border-gray-500/30' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return isDarkMode ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return isDarkMode ? 'text-green-400 bg-green-900/20 border-green-500/30' : 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return isDarkMode ? 'text-red-400 bg-red-900/20 border-red-500/30' : 'text-red-600 bg-red-50 border-red-200';
      case 'under_review':
        return isDarkMode ? 'text-blue-400 bg-blue-900/20 border-blue-500/30' : 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return isDarkMode ? 'text-gray-400 bg-gray-900/20 border-gray-500/30' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Proposal Details</h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>

      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Proposal Information</h4>
          <div className="space-y-3">
            <div>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gene Target</div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{proposal.geneTarget}</div>
            </div>
            <div>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Modification Type</div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{proposal.modificationType}</div>
            </div>
            <div>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Patient ID</div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{proposal.patientId}</div>
            </div>
            <div>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submitted</div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(proposal.timestamp)}</div>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Status & Risk</h4>
          <div className="space-y-4">
            <div>
              <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</div>
              <div className={`inline-flex items-center px-3 py-2 rounded-lg border ${getStatusColor(proposal.status)}`}>
                <span className="text-sm font-medium capitalize">
                  {proposal.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div>
              <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk Level</div>
              <div className={`inline-flex items-center px-3 py-2 rounded-lg border ${getRiskColor(proposal.riskLevel)}`}>
                <span className="text-sm font-medium capitalize">
                  {proposal.riskLevel} Risk
                </span>
              </div>
            </div>
            <div>
              <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Validation Score</div>
              <div className="flex items-center gap-2">
                <div className={`flex-1 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${proposal.validationScore}%` }}
                  />
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{proposal.validationScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Description</h4>
        <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{proposal.description}</p>
      </div>

      {/* Blockchain Information */}
      <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Blockchain Information</h4>
        <div className="space-y-3">
          <div>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Blockchain Hash</div>
            <div className="font-mono text-blue-400 text-sm break-all">
              {proposal.blockchainHash}
            </div>
          </div>
          <div>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Proposal ID</div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>#{proposal.id}</div>
          </div>
        </div>
      </div>

      {/* Validation Process */}
      <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Validation Process</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              validationStatus === 'pending' ? 'bg-gray-600' :
              validationStatus === 'validating' ? 'bg-blue-600 animate-pulse' :
              validationStatus === 'approved' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {validationStatus === 'pending' && <Clock className="w-4 h-4 text-white" />}
              {validationStatus === 'validating' && <Zap className="w-4 h-4 text-white" />}
              {validationStatus === 'approved' && <CheckCircle className="w-4 h-4 text-white" />}
              {validationStatus === 'rejected' && <AlertTriangle className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Smart Contract Validation</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {validationStatus === 'pending' && 'Waiting to start...'}
                {validationStatus === 'validating' && 'Validating proposal on blockchain...'}
                {validationStatus === 'approved' && 'Proposal validated successfully'}
                {validationStatus === 'rejected' && 'Proposal validation failed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Party Consent */}
      <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Multi-Party Consent</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'patient', label: 'Patient Consent', icon: Users },
            { key: 'doctor', label: 'Doctor Approval', icon: Shield },
            { key: 'regulator', label: 'Regulatory Review', icon: Activity },
            { key: 'ethicist', label: 'Ethics Committee', icon: Lock }
          ].map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                consentStatus[key as keyof typeof consentStatus]
                  ? 'border-green-500 bg-green-900/20'
                  : isDarkMode
                  ? 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
              onClick={() => toggleConsent(key)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  consentStatus[key as keyof typeof consentStatus]
                    ? 'bg-green-600'
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                }`}>
                  {consentStatus[key as keyof typeof consentStatus] ? (
                    <Unlock className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {consentStatus[key as keyof typeof consentStatus] ? 'Consent Given' : 'Pending Consent'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={onClose}
          className={`px-6 py-3 border rounded-lg transition-colors ${
            isDarkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Close
        </button>
        {proposal.status === 'pending' && (
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
            Approve Proposal
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalDetails;
