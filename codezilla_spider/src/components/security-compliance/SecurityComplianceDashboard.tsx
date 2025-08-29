import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Lock, Eye, FileText, Activity, Database, AlertTriangle, CheckCircle, Clock, Users, Key, Server } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SecurityEvent {
  id: string;
  type: 'login' | 'data_access' | 'permission_change' | 'backup' | 'encryption' | 'breach_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  user: string;
  timestamp: string;
  ipAddress: string;
  status: 'resolved' | 'investigating' | 'open';
  action: string;
}

interface ComplianceRequirement {
  id: string;
  standard: 'HIPAA' | 'GDPR' | 'FDA' | 'SOX' | 'PCI';
  requirement: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'pending';
  lastAudit: string;
  nextAudit: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  responsible: string;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure' | 'denied';
  details: string;
}

interface DataBackup {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled';
  startTime: string;
  endTime?: string;
  size: number;
  location: string;
  retention: string;
  encryption: boolean;
}

const SecurityComplianceDashboard: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [complianceRequirements, setComplianceRequirements] = useState<ComplianceRequirement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dataBackups, setDataBackups] = useState<DataBackup[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  useEffect(() => {
    const mockSecurityEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        severity: 'low',
        description: 'Successful login from new IP address',
        user: 'john.doe@hospital.com',
        timestamp: '2024-02-15T10:30:00Z',
        ipAddress: '192.168.1.100',
        status: 'resolved',
        action: 'Login verified'
      },
      {
        id: '2',
        type: 'data_access',
        severity: 'medium',
        description: 'Access to sensitive patient records',
        user: 'sarah.johnson@hospital.com',
        timestamp: '2024-02-15T09:15:00Z',
        ipAddress: '192.168.1.101',
        status: 'investigating',
        action: 'Access logged and monitored'
      },
      {
        id: '3',
        type: 'breach_attempt',
        severity: 'high',
        description: 'Multiple failed login attempts detected',
        user: 'unknown@external.com',
        timestamp: '2024-02-15T08:45:00Z',
        ipAddress: '203.0.113.45',
        status: 'open',
        action: 'IP blocked, investigation ongoing'
      }
    ];

    const mockComplianceRequirements: ComplianceRequirement[] = [
      {
        id: '1',
        standard: 'HIPAA',
        requirement: 'Patient Data Encryption',
        description: 'All patient data must be encrypted at rest and in transit',
        status: 'compliant',
        lastAudit: '2024-01-15',
        nextAudit: '2024-04-15',
        riskLevel: 'low',
        responsible: 'IT Security Team'
      },
      {
        id: '2',
        standard: 'GDPR',
        requirement: 'Data Processing Consent',
        description: 'Ensure proper consent mechanisms for data processing',
        status: 'in_progress',
        lastAudit: '2024-01-20',
        nextAudit: '2024-05-20',
        riskLevel: 'medium',
        responsible: 'Legal Team'
      },
      {
        id: '3',
        standard: 'FDA',
        requirement: 'Medical Device Security',
        description: 'Security controls for medical device integration',
        status: 'non_compliant',
        lastAudit: '2024-01-10',
        nextAudit: '2024-03-10',
        riskLevel: 'high',
        responsible: 'Medical Device Team'
      }
    ];

    const mockAuditLogs: AuditLog[] = [
      {
        id: '1',
        action: 'LOGIN',
        user: 'john.doe@hospital.com',
        resource: 'Patient Management System',
        timestamp: '2024-02-15T10:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        outcome: 'success',
        details: 'Successful authentication'
      },
      {
        id: '2',
        action: 'DATA_ACCESS',
        user: 'sarah.johnson@hospital.com',
        resource: 'Patient Records',
        timestamp: '2024-02-15T09:15:00Z',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        outcome: 'success',
        details: 'Accessed patient ID: 12345'
      },
      {
        id: '3',
        action: 'PERMISSION_CHANGE',
        user: 'admin@hospital.com',
        resource: 'User Management',
        timestamp: '2024-02-15T08:00:00Z',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        outcome: 'success',
        details: 'Updated user permissions for dr.smith@hospital.com'
      }
    ];

    const mockDataBackups: DataBackup[] = [
      {
        id: '1',
        type: 'full',
        status: 'completed',
        startTime: '2024-02-15T02:00:00Z',
        endTime: '2024-02-15T04:30:00Z',
        size: 500,
        location: 'Secure Cloud Storage',
        retention: '7 years',
        encryption: true
      },
      {
        id: '2',
        type: 'incremental',
        status: 'in_progress',
        startTime: '2024-02-15T12:00:00Z',
        size: 50,
        location: 'Local Backup Server',
        retention: '30 days',
        encryption: true
      },
      {
        id: '3',
        type: 'differential',
        status: 'scheduled',
        startTime: '2024-02-16T02:00:00Z',
        size: 0,
        location: 'Offsite Backup Facility',
        retention: '1 year',
        encryption: true
      }
    ];

    setSecurityEvents(mockSecurityEvents);
    setComplianceRequirements(mockComplianceRequirements);
    setAuditLogs(mockAuditLogs);
    setDataBackups(mockDataBackups);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'non_compliant': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const securityTrendsData = [
    { month: 'Jan', events: 45, threats: 12 },
    { month: 'Feb', events: 52, threats: 8 },
    { month: 'Mar', events: 48, threats: 15 },
    { month: 'Apr', events: 61, threats: 10 },
    { month: 'May', events: 55, threats: 7 },
    { month: 'Jun', events: 58, threats: 9 }
  ];

  const complianceData = [
    { name: 'Compliant', value: 75, color: '#10b981' },
    { name: 'In Progress', value: 15, color: '#f59e0b' },
    { name: 'Non-Compliant', value: 8, color: '#ef4444' },
    { name: 'Pending', value: 2, color: '#6b7280' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security & Compliance</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive security monitoring and regulatory compliance management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Alert:</strong> {securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length} high/critical security events detected
          </AlertDescription>
        </Alert>
      )}

      {complianceRequirements.filter(c => c.status === 'non_compliant').length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Compliance Alert:</strong> {complianceRequirements.filter(c => c.status === 'non_compliant').length} non-compliant requirements need attention
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Data Security</TabsTrigger>
          <TabsTrigger value="compliance">Healthcare Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit & Backup</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">8 requirements pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityEvents.length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Backups</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dataBackups.filter(b => b.status === 'completed').length}</div>
                <p className="text-xs text-muted-foreground">Successful backups</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Trends</CardTitle>
                <CardDescription>Monthly security events and threat detection</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={securityTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Distribution of compliance requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.description}</CardTitle>
                      <CardDescription>User: {event.user} • IP: {event.ipAddress}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <Badge variant={event.status === 'resolved' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm text-gray-600">{event.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Timestamp</Label>
                      <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">User</Label>
                      <p className="text-sm text-gray-600">{event.user}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">IP Address</Label>
                      <p className="text-sm text-gray-600">{event.ipAddress}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Action Taken</Label>
                    <p className="text-sm text-gray-600">{event.action}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Investigate</Button>
                    <Button variant="outline" size="sm">Block IP</Button>
                    <Button size="sm">Resolve</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Healthcare Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="space-y-4">
            {complianceRequirements.map((requirement) => (
              <Card key={requirement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{requirement.requirement}</CardTitle>
                      <CardDescription>{requirement.standard} • {requirement.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(requirement.status)}>
                        {requirement.status}
                      </Badge>
                      <Badge className={getRiskColor(requirement.riskLevel)}>
                        {requirement.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Standard</Label>
                      <p className="text-sm text-gray-600">{requirement.standard}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Audit</Label>
                      <p className="text-sm text-gray-600">{new Date(requirement.lastAudit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Audit</Label>
                      <p className="text-sm text-gray-600">{new Date(requirement.nextAudit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Responsible</Label>
                      <p className="text-sm text-gray-600">{requirement.responsible}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Update Status</Button>
                    <Button size="sm">Schedule Audit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit & Backup Tab */}
        <TabsContent value="audit" className="space-y-6">
          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
              <CardDescription>System activity and access logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.user} • {log.resource}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.outcome === 'success' ? 'default' : 'destructive'}>
                        {log.outcome}
                      </Badge>
                      <p className="text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Backups */}
          <Card>
            <CardHeader>
              <CardTitle>Data Backup Status</CardTitle>
              <CardDescription>Backup operations and retention management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataBackups.map((backup) => (
                  <div key={backup.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{backup.type.toUpperCase()} Backup</p>
                      <p className="text-sm text-gray-600">{backup.location} • {backup.size}GB</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                        {backup.status}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {backup.startTime && new Date(backup.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityComplianceDashboard;
