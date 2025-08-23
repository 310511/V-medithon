import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  Filter,
  Search,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Settings,
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { ProductListing, Order } from "@/contexts/BlockchainContext";

interface SupplierStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyGrowth: number;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  inventoryLevel: number;
  thresholdQuantity: number;
  expiryDate: string;
  supplier: string;
}

export const SupplierDashboard: React.FC = () => {
  const { 
    address, 
    connectWallet, 
    disconnectWallet, 
    isLoading,
    createProductListing,
    getProductListings, 
    getUserOrders,
    addAppNotification 
  } = useBlockchain();

  const [products, setProducts] = useState<ProductListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SupplierStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingOrders: 0,
    completedOrders: 0,
    monthlyGrowth: 0
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    price: 0,
    inventoryLevel: 0,
    thresholdQuantity: 0,
    expiryDate: "",
    supplier: ""
  });

  const categories = [
    "Antibiotics", "Consumables", "Equipment", "Diabetes Care", 
    "Pain Management", "Cardiovascular", "Respiratory", "Vitamins"
  ];

  const orderStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  // Load supplier data
  useEffect(() => {
    if (address) {
      loadSupplierData();
    }
  }, [address]);

  const loadSupplierData = async () => {
    try {
      const allProducts = await getProductListings();
      const supplierProducts = allProducts.filter(p => p.supplier === address);
      setProducts(supplierProducts);

      const allOrders = await getUserOrders(address);
      setOrders(allOrders);

      // Calculate stats
      const activeProducts = supplierProducts.filter(p => p.inventoryLevel > 0).length;
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = allOrders.filter(o => o.status === "pending").length;
      const completedOrders = allOrders.filter(o => o.status === "delivered").length;
      const avgRating = supplierProducts.length > 0 
        ? supplierProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / supplierProducts.length 
        : 0;

      setStats({
        totalProducts: supplierProducts.length,
        activeProducts,
        totalOrders: allOrders.length,
        totalRevenue,
        averageRating: avgRating,
        pendingOrders,
        completedOrders,
        monthlyGrowth: 12.5 // Mock data
      });
    } catch (error) {
      console.error("Error loading supplier data:", error);
      addAppNotification("Failed to load supplier data", "error");
    }
  };

  const handleAddProduct = async () => {
    try {
      const success = await createProductListing({
        ...productForm,
        supplier: address || "",
        blockchainVerified: true,
        rating: 0
      });

      if (success) {
        setIsAddProductDialogOpen(false);
        setProductForm({
          name: "",
          description: "",
          category: "",
          price: 0,
          inventoryLevel: 0,
          thresholdQuantity: 0,
          expiryDate: "",
          supplier: ""
        });
        loadSupplierData();
        addAppNotification("Product added successfully!", "success");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      addAppNotification("Failed to add product", "error");
    }
  };

  const handleEditProduct = (product: ProductListing) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      inventoryLevel: product.inventoryLevel,
      thresholdQuantity: product.thresholdQuantity || 0,
      expiryDate: product.expiryDate || "",
      supplier: product.supplier
    });
    setIsEditProductDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(order => {
    return orderStatusFilter === "all" || order.status === orderStatusFilter;
  });

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Connect Wallet</h2>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to access the supplier dashboard
              </p>
              <Button onClick={connectWallet} disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your products and track performance
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={loadSupplierData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.totalPrice}</p>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Active Products</span>
                      <span className="font-semibold">{stats.activeProducts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pending Orders</span>
                      <span className="font-semibold text-yellow-600">{stats.pendingOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Completed Orders</span>
                      <span className="font-semibold text-green-600">{stats.completedOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Monthly Growth</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4" />
                        {stats.monthlyGrowth}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="inventory">Inventory</Label>
                        <Input
                          id="inventory"
                          type="number"
                          value={productForm.inventoryLevel}
                          onChange={(e) => setProductForm({...productForm, inventoryLevel: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct} className="flex-1">
                        Add Product
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <Package className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">{product.category}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        {product.blockchainVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">${product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{product.rating || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Stock: {product.inventoryLevel}</span>
                        <span>{product.supplier}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Add your first product to get started</p>
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {orderStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getOrderStatusIcon(order.status)}
                          <div>
                            <h4 className="font-semibold">Order #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">${order.totalPrice}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {order.quantity}
                          </p>
                        </div>
                        
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>

                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {order.transactionHash && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        TX: {order.transactionHash.substring(0, 10)}...
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>This Month</span>
                      <span className="font-semibold">${(stats.totalRevenue * 0.3).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Month</span>
                      <span className="font-semibold">${(stats.totalRevenue * 0.25).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Growth</span>
                      <span className="font-semibold text-green-600">+20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Top Selling</span>
                      <span className="font-semibold">Antibiotics</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Low Stock</span>
                      <span className="font-semibold text-yellow-600">3 items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Out of Stock</span>
                      <span className="font-semibold text-red-600">1 item</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 