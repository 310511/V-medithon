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
import { Calendar, Clock, User, Pill, AlertTriangle, TrendingUp, Activity, FileText, Shield, Bell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  bloodType: string;
  allergies: string[];
  emergencyContact: string;
  insurance: string;
  lastVisit: string;
  nextAppointment: string;
  healthScore: number;
  complianceRate: number;
}

interface Prescription {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'discontinued';
  compliance: number;
  sideEffects: string[];
}

interface AllergyAlert {
  id: string;
  patientId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  allergen: string;
  symptoms: string[];
  lastOccurrence: string;
  medication: string;
}

const PatientManagementDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [allergyAlerts, setAllergyAlerts] = useState<AllergyAlert[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        emergencyContact: '+1-555-0124',
        insurance: 'Blue Cross Blue Shield',
        lastVisit: '2024-01-15',
        nextAppointment: '2024-02-15',
        healthScore: 85,
        complianceRate: 92
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        age: 32,
        gender: 'Female',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0125',
        bloodType: 'A-',
        allergies: ['Sulfa drugs'],
        emergencyContact: '+1-555-0126',
        insurance: 'Aetna',
        lastVisit: '2024-01-20',
        nextAppointment: '2024-02-20',
        healthScore: 78,
        complianceRate: 88
      }
    ];

    setPatients(mockPatients);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive patient care and monitoring system</p>
        </div>
        <Button>
          <User className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patient Profiles</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="allergies">Allergy Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Health Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total Patients: {patients.length}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle>{patient.name}</CardTitle>
                  <CardDescription>{patient.age} years • {patient.gender}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Health Score: {patient.healthScore}%</p>
                  <p>Compliance: {patient.complianceRate}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientManagementDashboard;
