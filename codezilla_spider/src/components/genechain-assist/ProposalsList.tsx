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
}

const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, onViewProposal }) => {
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
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Genetic Edit Proposals ({filteredProposals.length})
        </h2>
      </div>

      {/* Search and Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white appearance-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No proposals found matching your criteria.</p>
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer border border-gray-200 dark:border-slate-600"
              onClick={() => onViewProposal(proposal)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(proposal.status)}
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(proposal.riskLevel)}`}>
                    {proposal.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Score: {proposal.validationScore}%
                  </span>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Gene Target:</span>
                  <p className="text-gray-900 dark:text-white font-medium">{proposal.geneTarget}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient ID:</span>
                  <p className="text-gray-900 dark:text-white">{proposal.patientId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type:</span>
                  <p className="text-gray-900 dark:text-white capitalize">{proposal.modificationType}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</span>
                <p className="text-gray-900 dark:text-white text-sm line-clamp-2">
                  {proposal.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>ID: #{proposal.id}</span>
                <span>Created: {new Date(proposal.timestamp).toLocaleDateString()}</span>
                <code className="text-blue-600 dark:text-blue-400 font-mono">
                  {proposal.blockchainHash.substring(0, 8)}...
                </code>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProposalsList;
