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
import { Calendar, Clock, Package, Truck, DollarSign, Shield, CheckCircle, AlertTriangle, TrendingUp, BarChart3, Users, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  strength: string;
  form: string;
  manufacturer: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  expiryDate: string;
  batchNumber: string;
  qualityStatus: 'approved' | 'pending' | 'rejected';
  fdaApproved: boolean;
  lastRestocked: string;
  reorderPoint: number;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  reliability: number;
  deliveryTime: number;
  paymentTerms: string;
  contractEndDate: string;
  totalOrders: number;
  onTimeDelivery: number;
  qualityRating: number;
}

const PharmacyManagementDashboard: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockMedicines: Medicine[] = [
      {
        id: '1',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        category: 'Cardiovascular',
        strength: '10mg',
        form: 'Tablet',
        manufacturer: 'Merck',
        supplier: 'ABC Pharmaceuticals',
        currentStock: 150,
        minStock: 50,
        maxStock: 300,
        unitPrice: 0.85,
        expiryDate: '2025-06-15',
        batchNumber: 'LIS2024001',
        qualityStatus: 'approved',
        fdaApproved: true,
        lastRestocked: '2024-01-15',
        reorderPoint: 75
      },
      {
        id: '2',
        name: 'Metformin',
        genericName: 'Metformin Hydrochloride',
        category: 'Diabetes',
        strength: '500mg',
        form: 'Tablet',
        manufacturer: 'Bristol-Myers Squibb',
        supplier: 'XYZ Medical Supplies',
        currentStock: 25,
        minStock: 100,
        maxStock: 500,
        unitPrice: 0.45,
        expiryDate: '2024-12-20',
        batchNumber: 'MET2024002',
        qualityStatus: 'pending',
        fdaApproved: true,
        lastRestocked: '2024-01-10',
        reorderPoint: 150
      }
    ];

    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'ABC Pharmaceuticals',
        contactPerson: 'John Smith',
        email: 'john.smith@abcpharma.com',
        phone: '+1-555-0101',
        address: '123 Pharma St, Medical City, MC 12345',
        rating: 4.8,
        reliability: 95,
        deliveryTime: 3,
        paymentTerms: 'Net 30',
        contractEndDate: '2024-12-31',
        totalOrders: 150,
        onTimeDelivery: 142,
        qualityRating: 4.9
      }
    ];

    setMedicines(mockMedicines);
    setSuppliers(mockSuppliers);
  }, []);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockMedicines = medicines.filter(medicine => medicine.currentStock <= medicine.reorderPoint);
  const inventoryValue = medicines.reduce((total, medicine) => total + (medicine.currentStock * medicine.unitPrice), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pharmacy Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive pharmacy inventory and supplier management system</p>
        </div>
        <Button>
          <Package className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {lowStockMedicines.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Low Stock Alert:</strong> {lowStockMedicines.length} medicines need restocking
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${inventoryValue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Medicines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicines.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockMedicines.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="space-y-4">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id}>
                <CardHeader>
                  <CardTitle>{medicine.name}</CardTitle>
                  <CardDescription>{medicine.genericName} • {medicine.strength}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Current Stock: {medicine.currentStock} units</p>
                  <p>Unit Price: ${medicine.unitPrice}</p>
                  <p>Supplier: {medicine.supplier}</p>
                  <p>Quality Status: {medicine.qualityStatus}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <CardTitle>{supplier.name}</CardTitle>
                  <CardDescription>{supplier.contactPerson}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Rating: {supplier.rating}/5.0</p>
                  <p>Reliability: {supplier.reliability}%</p>
                  <p>Delivery Time: {supplier.deliveryTime} days</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacyManagementDashboard;
