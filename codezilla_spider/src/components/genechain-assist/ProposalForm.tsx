import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface ProposalFormData {
  geneTarget: string;
  modificationType: string;
  patientId: string;
  description: string;
  riskLevel: string;
}

interface ProposalFormProps {
  onSubmit: (data: ProposalFormData) => void;
  onClose: () => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ProposalFormData>({
    geneTarget: '',
    modificationType: '',
    patientId: '',
    description: '',
    riskLevel: 'medium'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.geneTarget.trim()) {
      newErrors.geneTarget = 'Gene target is required';
    }
    if (!formData.modificationType) {
      newErrors.modificationType = 'Modification type is required';
    }
    if (!formData.patientId.trim()) {
      newErrors.patientId = 'Patient ID is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ProposalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-gray-200 dark:border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Propose Genetic Edit
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gene Target *
              </label>
              <input
                type="text"
                value={formData.geneTarget}
                onChange={(e) => handleInputChange('geneTarget', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                  errors.geneTarget ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="e.g., BRCA1, CFTR, TP53"
              />
              {errors.geneTarget && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.geneTarget}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modification Type *
              </label>
              <select
                value={formData.modificationType}
                onChange={(e) => handleInputChange('modificationType', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                  errors.modificationType ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                }`}
              >
                <option value="">Select type</option>
                <option value="knockout">Gene Knockout</option>
                <option value="insertion">Gene Insertion</option>
                <option value="replacement">Gene Replacement</option>
                <option value="modification">Gene Modification</option>
                <option value="activation">Gene Activation</option>
                <option value="silencing">Gene Silencing</option>
              </select>
              {errors.modificationType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.modificationType}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Patient ID *
            </label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                errors.patientId ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
              }`}
              placeholder="Enter patient identifier"
            />
            {errors.patientId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.patientId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
              }`}
              rows={4}
              placeholder="Detailed description of the genetic modification, including purpose, methodology, and expected outcomes..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Risk Level
            </label>
            <select
              value={formData.riskLevel}
              onChange={(e) => handleInputChange('riskLevel', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Save className="w-5 h-5 mr-2" />
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;
