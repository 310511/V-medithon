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
  X,
  Save,
  List,
  Network,
  Microscope,
  UserCheck,
  ClipboardList,
  TrendingUp,
  BarChart3,
  FileText,
  Upload,
  Search,
  Settings,
  User,
  Bell,
  ChevronRight,
  ChevronDown,
  FileSpreadsheet,
  BrainCircuit,
  ShieldCheck,
  FileCheck,
  Download,
  Eye as EyeIcon,
  Calendar,
  Hash
} from 'lucide-react';
import ProposalForm from './ProposalForm';
import ProposalsList from './ProposalsList';
import ProposalDetails from './ProposalDetails';
import { useTheme } from '@/contexts/ThemeContext';

interface Proposal {
  id: string;
  geneTarget: string;
  modificationType: string;
  patientId: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  consentStatus: 'pending' | 'obtained' | 'denied';
}

interface GeneExpressionData {
  patientId: string;
  sampleData: any;
  prediction: string;
  probability: number;
  topGenes: Array<{ gene: string; importance: number }>;
  modelHash: string;
  blockchainTx: string;
  timestamp: string;
  status: 'processing' | 'completed' | 'failed';
}

interface AuditLog {
  id: string;
  patientId: string;
  action: string;
  modelHash: string;
  prediction: string;
  probability: number;
  blockchainTx: string;
  timestamp: string;
  userRole: string;
}

interface PromoterData {
  id: string;
  sequence: string;
  prediction: 'promoter' | 'not_promoter';
  probability: number;
  modelHash: string;
  blockchainTx: string;
  timestamp: string;
  referenceMatches: Array<{ database: string; match: string; score: number }>;
}

interface ConsentRequest {
  id: string;
  patientId: string;
  requesterId: string;
  requesterRole: string;
  requestType: 'read' | 'write' | 'full';
  duration: number; // days
  status: 'pending' | 'approved' | 'denied' | 'expired';
  timestamp: string;
  expiryDate: string;
  blockchainTx: string;
}

interface ReportData {
  id: string;
  type: 'gene_expression' | 'promoter' | 'consent' | 'combined';
  patientId?: string;
  startDate: string;
  endDate: string;
  data: any;
  blockchainTx: string;
  generatedAt: string;
  downloadUrl: string;
}

const UnifiedGeneChain: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'variants' | 'audit' | 'promoter' | 'consent' | 'reports'>('dashboard');
  const [activeTab, setActiveTab] = useState<'assist' | 'emergency'>('assist');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentEmergency, setCurrentEmergency] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showProposalsList, setShowProposalsList] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<'Doctor' | 'Regulator' | 'Patient'>('Doctor');
  const [geneExpressionData, setGeneExpressionData] = useState<GeneExpressionData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditTab, setAuditTab] = useState<'upload' | 'analysis' | 'blockchain' | 'report'>('upload');
  
  // Promoter Validation State
  const [promoterData, setPromoterData] = useState<PromoterData | null>(null);
  const [promoterTab, setPromoterTab] = useState<'upload' | 'prediction' | 'blockchain' | 'reference'>('upload');
  
  // Consent Management State
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [consentTab, setConsentTab] = useState<'pending' | 'active' | 'blockchain'>('pending');
  
  // Reports State
  const [reports, setReports] = useState<ReportData[]>([]);
  const [reportsTab, setReportsTab] = useState<'gene_expression' | 'promoter' | 'consent' | 'export'>('gene_expression');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Emergency scenarios data
  const emergencies = [
    {
      title: "Unknown Drug Reaction",
      description: "Patient experiencing severe allergic reaction to medication",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Genetic Disorder Emergency",
      description: "Sudden onset of symptoms requiring immediate genetic analysis",
      icon: Dna,
      color: "blue"
    },
    {
      title: "Surgical Emergency",
      description: "Emergency surgery requiring genetic compatibility check",
      icon: Stethoscope,
      color: "green"
    }
  ];

  // Mock audit logs data
  useEffect(() => {
    setAuditLogs([
      {
        id: '1',
        patientId: 'P001',
        action: 'Gene Expression Analysis',
        modelHash: '0x1234...5678',
        prediction: 'ALL',
        probability: 0.87,
        blockchainTx: '0xabcd...efgh',
        timestamp: '2024-01-15T10:30:00Z',
        userRole: 'Doctor'
      },
      {
        id: '2',
        patientId: 'P002',
        action: 'Gene Expression Analysis',
        modelHash: '0x8765...4321',
        prediction: 'AML',
        probability: 0.92,
        blockchainTx: '0xdcba...hgfe',
        timestamp: '2024-01-14T15:45:00Z',
        userRole: 'Researcher'
      }
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && activeTab === 'emergency') {
        setCurrentEmergency((prev) => (prev + 1) % emergencies.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, emergencies.length, activeTab]);

  const toggleDemo = () => setShowDemo(!showDemo);

  const handleProposalSubmit = (formData: {
    geneTarget: string;
    modificationType: string;
    patientId: string;
    description: string;
    riskLevel: string;
  }) => {
    const newProposal: Proposal = {
      id: Date.now().toString(),
      ...formData,
      riskLevel: formData.riskLevel as 'low' | 'medium' | 'high',
      status: 'pending',
      timestamp: new Date().toISOString(),
      consentStatus: 'pending'
    };
    setProposals([...proposals, newProposal]);
    setShowProposalForm(false);
  };

  const handleFileUpload = async (file: File) => {
    // Simulate file processing
    const mockData: GeneExpressionData = {
      patientId: 'P' + Date.now(),
      sampleData: { genes: 20000, samples: 1 },
      prediction: 'ALL',
      probability: 0.87,
      topGenes: [
        { gene: 'CD19', importance: 0.15 },
        { gene: 'CD20', importance: 0.12 },
        { gene: 'CD22', importance: 0.10 },
        { gene: 'CD79A', importance: 0.08 },
        { gene: 'PAX5', importance: 0.07 }
      ],
      modelHash: '0x' + Math.random().toString(16).substr(2, 8),
      blockchainTx: '0x' + Math.random().toString(16).substr(2, 16),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setGeneExpressionData(mockData);
  };

  const generateReport = () => {
    // Simulate PDF generation
    const link = document.createElement('a');
    link.href = '#';
    link.download = `gene-expression-report-${Date.now()}.pdf`;
    link.click();
  };

  // Promoter Validation Handlers
  const handlePromoterUpload = async (sequence: string) => {
    // Simulate promoter analysis
    const mockData: PromoterData = {
      id: 'P' + Date.now(),
      sequence: sequence,
      prediction: Math.random() > 0.5 ? 'promoter' : 'not_promoter',
      probability: Math.random() * 0.4 + 0.6, // 60-100%
      modelHash: '0x' + Math.random().toString(16).substr(2, 8),
      blockchainTx: '0x' + Math.random().toString(16).substr(2, 16),
      timestamp: new Date().toISOString(),
      referenceMatches: [
        { database: 'NCBI', match: 'NM_001123456', score: 0.95 },
        { database: 'Ensembl', match: 'ENST00000123456', score: 0.87 }
      ]
    };
    setPromoterData(mockData);
  };

  // Consent Management Handlers
  const handleConsentGrant = (requestId: string) => {
    setConsentRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleConsentRevoke = (requestId: string) => {
    setConsentRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'denied' as const } : req
    ));
  };

  // Reports Handlers
  const generateCombinedReport = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `combined-report-${Date.now()}.pdf`;
    link.click();
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: activeSection === 'dashboard' },
    { id: 'variants', label: 'Genetic Variants', icon: Dna, active: activeSection === 'variants' },
    { id: 'audit', label: 'Gene Expression Audit Trail', icon: FileCheck, active: activeSection === 'audit' },
    { id: 'promoter', label: 'Promoter Validation', icon: ShieldCheck, active: activeSection === 'promoter' },
    { id: 'consent', label: 'Consent Management', icon: UserCheck, active: activeSection === 'consent' },
    { id: 'reports', label: 'Reports & Audit Logs', icon: FileText, active: activeSection === 'reports' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Analyses</p>
              <p className="text-2xl font-bold text-blue-500">1,247</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blockchain Transactions</p>
              <p className="text-2xl font-bold text-green-500">892</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Hash className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Consents</p>
              <p className="text-2xl font-bold text-purple-500">156</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.action} for Patient {log.patientId}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(log.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ML Models</span>
              <span className="text-green-500 text-sm">✓ Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blockchain</span>
              <span className="text-green-500 text-sm">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Database</span>
              <span className="text-green-500 text-sm">✓ Healthy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderGeneExpressionAudit = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'upload', label: 'Upload & Preprocess', icon: Upload },
          { id: 'analysis', label: 'Analysis', icon: BrainCircuit },
          { id: 'blockchain', label: 'Blockchain Audit', icon: Hash },
          { id: 'report', label: 'Report', icon: Download }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAuditTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              auditTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {auditTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Upload Gene Expression Data
            </h3>
            <div className="space-y-4">
              <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload CSV file with ALL/AML gene expression data
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Supports: CSV files with gene expression matrix
                </p>
                <button
                  onClick={() => handleFileUpload(new File([''], 'sample.csv'))}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Sample Data
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {auditTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {geneExpressionData ? (
              <>
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Analysis Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prediction</p>
                      <p className="text-2xl font-bold text-blue-600">{geneExpressionData.prediction}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence</p>
                      <p className="text-2xl font-bold text-green-600">{(geneExpressionData.probability * 100).toFixed(1)}%</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Model Hash</p>
                      <p className="text-sm font-mono text-gray-600">{geneExpressionData.modelHash}</p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Top Contributing Genes
                  </h3>
                  <div className="space-y-3">
                    {geneExpressionData.topGenes.map((gene, index) => (
                      <div key={gene.gene} className="flex items-center justify-between">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {index + 1}. {gene.gene}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${gene.importance * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {(gene.importance * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
                <BrainCircuit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No analysis data available
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Upload data in the Upload tab to see analysis results
                </p>
              </div>
            )}
          </motion.div>
        )}

        {auditTab === 'blockchain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Blockchain Audit Trail
              </h3>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Patient {log.patientId}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prediction: </span>
                        <span className="font-medium text-blue-600">{log.prediction}</span>
                      </div>
                      <div>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence: </span>
                        <span className="font-medium text-green-600">{(log.probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transaction: </span>
                        <span className="font-mono text-xs text-gray-600">{log.blockchainTx}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {auditTab === 'report' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Generate Report
            </h3>
            <div className="space-y-4">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Generate a comprehensive PDF report including:
              </p>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Prediction results and confidence scores</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Model version and parameters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Blockchain transaction hash</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Patient ID and timestamp</span>
                </li>
              </ul>
              <button
                onClick={generateReport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Generate PDF Report</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderPromoterValidation = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'upload', label: 'Sequence Upload', icon: Upload },
          { id: 'prediction', label: 'Prediction Results', icon: BrainCircuit },
          { id: 'blockchain', label: 'Blockchain Log', icon: Hash },
          { id: 'reference', label: 'Reference DB', icon: Database }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPromoterTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              promoterTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {promoterTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Upload DNA Sequence
            </h3>
            <div className="space-y-4">
              <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload FASTA file or paste DNA sequence
                </p>
                <textarea
                  placeholder="Paste DNA sequence here (ATCG...)"
                  className={`mt-4 w-full h-32 p-3 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <button
                  onClick={() => handlePromoterUpload("ATCGATCGATCG")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Analyze Sequence
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {promoterTab === 'prediction' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {promoterData ? (
              <>
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Promoter Prediction Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prediction</p>
                      <p className={`text-2xl font-bold ${promoterData.prediction === 'promoter' ? 'text-green-600' : 'text-red-600'}`}>
                        {promoterData.prediction === 'promoter' ? 'Promoter' : 'Not Promoter'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence</p>
                      <p className="text-2xl font-bold text-blue-600">{(promoterData.probability * 100).toFixed(1)}%</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Model Hash</p>
                      <p className="text-sm font-mono text-gray-600">{promoterData.modelHash}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
                <BrainCircuit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No prediction data available
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Upload a sequence in the Upload tab to see prediction results
                </p>
              </div>
            )}
          </motion.div>
        )}

        {promoterTab === 'blockchain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Blockchain Validation Log
            </h3>
            {promoterData ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Transaction Hash
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(promoterData.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600">{promoterData.blockchainTx}</p>
                </div>
              </div>
            ) : (
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No blockchain data available. Run a prediction first.
              </p>
            )}
          </motion.div>
        )}

        {promoterTab === 'reference' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Reference Database Cross-check
            </h3>
            {promoterData ? (
              <div className="space-y-4">
                {promoterData.referenceMatches.map((match, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {match.database}
                      </span>
                      <span className="text-sm text-blue-600">{(match.score * 100).toFixed(1)}% match</span>
                    </div>
                    <p className="font-mono text-sm text-gray-600">{match.match}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No reference data available. Run a prediction first.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderConsentManagement = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'pending', label: 'Pending Requests', icon: Clock },
          { id: 'active', label: 'Active Consents', icon: UserCheck },
          { id: 'blockchain', label: 'Blockchain Ledger', icon: Hash }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setConsentTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              consentTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {consentTab === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Pending Consent Requests
            </h3>
            <div className="space-y-4">
              {consentRequests.filter(req => req.status === 'pending').map((request) => (
                <div key={request.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.requesterRole} - {request.requesterId}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
                      {request.requestType}
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    Requesting access for {request.duration} days
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleConsentGrant(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Grant Access
                    </button>
                    <button
                      onClick={() => handleConsentRevoke(request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Deny Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {consentTab === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Active Consents
            </h3>
            <div className="space-y-4">
              {consentRequests.filter(req => req.status === 'approved').map((request) => (
                <div key={request.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.requesterRole} - {request.requesterId}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                      Active
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Expires: {new Date(request.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {consentTab === 'blockchain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Blockchain Consent Ledger
            </h3>
            <div className="space-y-4">
              {consentRequests.map((request) => (
                <div key={request.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.status.toUpperCase()}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(request.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600">{request.blockchainTx}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'gene_expression', label: 'Gene Expression Logs', icon: BarChart3 },
          { id: 'promoter', label: 'Promoter Validation Logs', icon: ShieldCheck },
          { id: 'consent', label: 'Consent History Logs', icon: UserCheck },
          { id: 'export', label: 'Export Center', icon: Download }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportsTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              reportsTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {reportsTab === 'gene_expression' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Gene Expression Analysis Logs
            </h3>
            <div className="space-y-4">
              {auditLogs.filter(log => log.action.includes('Gene Expression')).map((log) => (
                <div key={log.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Patient {log.patientId} - {log.prediction}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600">{log.blockchainTx}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {reportsTab === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Export Center
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Combined Report
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  Generate a comprehensive report including all analysis types
                </p>
                <button
                  onClick={generateCombinedReport}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate Combined Report</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'audit':
        return renderGeneExpressionAudit();
      case 'promoter':
        return renderPromoterValidation();
      case 'consent':
        return renderConsentManagement();
      case 'reports':
        return renderReports();
      default:
        return (
          <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {navigationItems.find(item => item.id === activeSection)?.label}
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              This feature is coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900'}`}>
      {/* Background Animation */}
      <motion.div
        style={{ y }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-200'} opacity-20 blur-xl animate-pulse`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 rounded-full ${isDarkMode ? 'bg-green-500' : 'bg-green-200'} opacity-20 blur-xl animate-pulse delay-1000`}></div>
        <div className={`absolute bottom-20 left-1/3 w-40 h-40 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-200'} opacity-20 blur-xl animate-pulse delay-2000`}></div>
      </motion.div>

      <div className="relative z-10">
        {/* Top Navbar */}
        <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                GeneChain Unified Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                {userRole}
              </div>
              <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Bell className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <motion.div
            initial={{ width: sidebarCollapsed ? 64 : 280 }}
            animate={{ width: sidebarCollapsed ? 64 : 280 }}
            className={`${isDarkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'} min-h-screen transition-all duration-300`}
          >
            <div className="p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      item.active
                        ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                        : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Emergency Response Demo
              </h3>
              <button
                onClick={() => setShowDemo(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This is a demonstration of the emergency response system. In a real scenario, this would show how genetic emergency keys are accessed and used.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDemo(false)}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showProposalForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProposalForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProposalForm onSubmit={handleProposalSubmit} onClose={() => setShowProposalForm(false)} isDarkMode={isDarkMode} />
          </motion.div>
        </motion.div>
      )}

      {showProposalsList && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProposalsList(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-4xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProposalsList proposals={proposals} onClose={() => setShowProposalsList(false)} isDarkMode={isDarkMode} />
          </motion.div>
        </motion.div>
      )}

      {currentProposal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setCurrentProposal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProposalDetails proposal={currentProposal} onClose={() => setCurrentProposal(null)} isDarkMode={isDarkMode} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UnifiedGeneChain;
