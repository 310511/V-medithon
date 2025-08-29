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
import { Calendar, Clock, User, Pill, Stethoscope, Video, FileText, Clipboard, Users, MessageSquare, Phone, Mail } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  license: string;
  experience: number;
  rating: number;
  patientsCount: number;
  availability: string[];
  avatar: string;
}

interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'in-person' | 'virtual' | 'follow-up';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  prescription?: string;
  followUpDate?: string;
}

const DoctorIntegrationDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  useEffect(() => {
    const mockDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Wilson',
        specialization: 'Cardiology',
        email: 'sarah.wilson@hospital.com',
        phone: '+1-555-0101',
        license: 'MD123456',
        experience: 15,
        rating: 4.8,
        patientsCount: 245,
        availability: ['Mon', 'Wed', 'Fri'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Neurology',
        email: 'michael.chen@hospital.com',
        phone: '+1-555-0102',
        license: 'MD123457',
        experience: 12,
        rating: 4.9,
        patientsCount: 189,
        availability: ['Tue', 'Thu', 'Sat'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
      }
    ];

    const mockConsultations: Consultation[] = [
      {
        id: '1',
        doctorId: '1',
        patientId: '1',
        patientName: 'John Smith',
        date: '2024-02-15',
        time: '10:00 AM',
        type: 'virtual',
        status: 'scheduled',
        notes: 'Follow-up consultation for heart condition',
        followUpDate: '2024-03-15'
      }
    ];

    setDoctors(mockDoctors);
    setConsultations(mockConsultations);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Integration</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive doctor management and patient care system</p>
        </div>
        <Button>
          <Stethoscope className="w-4 h-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="treatments">Treatment Plans</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total Doctors: {doctors.length}</p>
              <p>Total Consultations: {consultations.length}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialization}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Experience: {doctor.experience} years</p>
                  <p>Rating: {doctor.rating}/5.0</p>
                  <p>Patients: {doctor.patientsCount}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consultations">
          <div className="space-y-4">
            {consultations.map((consultation) => {
              const doctor = doctors.find(d => d.id === consultation.doctorId);
              return (
                <Card key={consultation.id}>
                  <CardHeader>
                    <CardTitle>{consultation.patientName}</CardTitle>
                    <CardDescription>Consultation with {doctor?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Date: {new Date(consultation.date).toLocaleDateString()}</p>
                    <p>Time: {consultation.time}</p>
                    <p>Type: {consultation.type}</p>
                    <p>Status: {consultation.status}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorIntegrationDashboard;
