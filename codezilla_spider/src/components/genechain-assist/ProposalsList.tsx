import React, { useState } from 'react';
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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

interface ProposalsListProps {
  proposals: Proposal[];
  onViewProposal: (proposal: Proposal) => void;
  isDarkMode?: boolean;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, onViewProposal, isDarkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.geneTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || proposal.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'under_review':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-12">
            <div className={`text-lg mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No proposals found</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {proposals.length === 0 ? 'No proposals have been submitted yet.' : 'Try adjusting your search or filters.'}
            </div>
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-gray-600 transition-all duration-200 cursor-pointer shadow-lg`}
              onClick={() => onViewProposal(proposal)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {proposal.geneTarget} - {proposal.modificationType}
                    </h3>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusColor(proposal.status)}`}>
                      {getStatusIcon(proposal.status)}
                      <span className="text-sm font-medium capitalize">
                        {proposal.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getRiskColor(proposal.riskLevel)}`}>
                      <span className="text-sm font-medium capitalize">
                        {proposal.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Patient ID</div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{proposal.patientId}</div>
                    </div>
                    <div>
                      <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Validation Score</div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{proposal.validationScore}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</div>
                    <div className={`text-sm line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {proposal.description}
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div>Submitted: {formatDate(proposal.timestamp)}</div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className={`${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50'} rounded-lg p-4 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{proposals.length}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Proposals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {proposals.filter(p => p.status === 'pending').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {proposals.filter(p => p.status === 'approved').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Approved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {proposals.filter(p => p.status === 'rejected').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsList;
