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
  isDarkMode?: boolean;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ onSubmit, onClose, isDarkMode = true }) => {
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
    if (!formData.modificationType.trim()) {
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

  const handleChange = (field: keyof ProposalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Gene Target *
          </label>
          <input
            type="text"
            value={formData.geneTarget}
            onChange={(e) => handleChange('geneTarget', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } ${
              errors.geneTarget ? 'border-red-500' : ''
            }`}
            placeholder="e.g., BRCA1, CFTR, TP53"
          />
          {errors.geneTarget && (
            <p className="mt-1 text-sm text-red-400">{errors.geneTarget}</p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Modification Type *
          </label>
          <select
            value={formData.modificationType}
            onChange={(e) => handleChange('modificationType', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } ${
              errors.modificationType ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select modification type</option>
            <option value="CRISPR-Cas9">CRISPR-Cas9</option>
            <option value="TALEN">TALEN</option>
            <option value="Zinc Finger">Zinc Finger</option>
            <option value="Base Editing">Base Editing</option>
            <option value="Prime Editing">Prime Editing</option>
          </select>
          {errors.modificationType && (
            <p className="mt-1 text-sm text-red-400">{errors.modificationType}</p>
          )}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Patient ID *
        </label>
        <input
          type="text"
          value={formData.patientId}
          onChange={(e) => handleChange('patientId', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-900 border-gray-300'
          } ${
            errors.patientId ? 'border-red-500' : ''
          }`}
          placeholder="Enter patient identifier"
        />
        {errors.patientId && (
          <p className="mt-1 text-sm text-red-400">{errors.patientId}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-900 border-gray-300'
          } ${
            errors.description ? 'border-red-500' : ''
          }`}
          placeholder="Describe the proposed genetic modification and its intended therapeutic effect..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Risk Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'low', label: 'Low', color: 'bg-green-600' },
            { value: 'medium', label: 'Medium', color: 'bg-yellow-600' },
            { value: 'high', label: 'High', color: 'bg-red-600' }
          ].map((risk) => (
            <button
              key={risk.value}
              type="button"
              onClick={() => handleChange('riskLevel', risk.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                formData.riskLevel === risk.value
                  ? `${risk.color} border-transparent text-white`
                  : isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {risk.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className={`px-6 py-3 border rounded-lg transition-colors ${
            isDarkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <X className="w-4 h-4 inline mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Submit Proposal
        </button>
      </div>
    </form>
  );
};

export default ProposalForm;
