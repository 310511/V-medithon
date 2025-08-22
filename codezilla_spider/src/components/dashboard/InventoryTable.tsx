import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Package, Calendar, AlertCircle, ShoppingCart, Shield, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  "Antibiotics",
  "Consumables", 
  "Diabetes Care",
  "Equipment",
  "Pain Management",
  "Cardiovascular",
  "Respiratory",
  "Other"
];

export const InventoryTable = () => {
  const { address, syncInventoryToMarketplace, addAppNotification } = useBlockchain();
  const { inventoryItems, addInventoryItem, deleteInventoryItem } = useInventory();
  const [syncingItems, setSyncingItems] = useState<Set<number>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  console.log("InventoryTable rendered with items:", inventoryItems);
  console.log("Current address:", address);
  
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    stock: "",
    threshold: "",
    expiry: "",
    supplier: "",
    price: ""
  });

  const handleListOnMarketplace = async (item: any) => {
    console.log("List button clicked for item:", item);
    console.log("Current address:", address);
    
    try {
      if (!address) {
        console.log("No wallet address found, showing error notification");
        toast.error("Please connect your wallet to list items on the marketplace.");
        return;
      }

      console.log("Setting syncing state for item:", item.id);
      setSyncingItems(prev => new Set(prev).add(item.id));
      
      console.log("Starting marketplace sync for:", item.name);
      toast.info(`Listing ${item.name} on marketplace...`);
      
      await syncInventoryToMarketplace({
        id: item.id.toString(),
        name: item.name,
        category: item.category,
        stock: item.stock,
        threshold: item.threshold,
        expiry: item.expiry,
        supplier: item.supplier,
        status: item.status,
        price: item.price,
        blockchainVerified: item.blockchainVerified
      });
      
      console.log("Successfully listed item on marketplace");
      toast.success(`${item.name} successfully listed on marketplace!`);
    } catch (error) {
      console.error("Error listing item on marketplace:", error);
      toast.error(`Failed to list ${item.name} on marketplace. Please try again.`);
    } finally {
      console.log("Clearing syncing state for item:", item.id);
      setSyncingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleViewOnMarketplace = (item: any) => {
    console.log("View button clicked for item:", item);
    // Navigate to marketplace product page
    console.log("View on marketplace:", item);
    toast.info(`Viewing ${item.name} on marketplace`);
    // You can add navigation logic here when marketplace page is ready
    // navigate(`/marketplace/product/${item.id}`);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.stock || !newItem.threshold || !newItem.supplier || !newItem.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const stock = parseInt(newItem.stock);
    const threshold = parseInt(newItem.threshold);
    const price = parseFloat(newItem.price);

    if (isNaN(stock) || isNaN(threshold) || isNaN(price)) {
      toast.error("Please enter valid numbers for stock, threshold, and price.");
      return;
    }

    const status = stock <= threshold ? (stock <= threshold * 0.5 ? "critical" : "low") : "good";

    const newInventoryItem = {
      name: newItem.name,
      category: newItem.category,
      stock: stock,
      threshold: threshold,
      expiry: newItem.expiry || "N/A",
      supplier: newItem.supplier,
      status: status,
      price: price,
      blockchainVerified: false
    };

    addInventoryItem(newInventoryItem);
    toast.success("Item added to inventory successfully!");
    
    // Reset form
    setNewItem({
      name: "",
      category: "",
      stock: "",
      threshold: "",
      expiry: "",
      supplier: "",
      price: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteItem = (itemId: number) => {
    deleteInventoryItem(itemId);
    toast.success("Item removed from inventory.");
  };

  const handleInputChange = (field: string, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Management
            </CardTitle>
            <CardDescription className="mt-2">
              Manage your medical supplies and track inventory levels. Use <strong>List</strong> and <strong>View</strong> buttons to interact with marketplace.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Paracetamol 500mg"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select value={newItem.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    className="col-span-3"
                    placeholder="Current stock level"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">
                    Threshold
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={newItem.threshold}
                    onChange={(e) => handleInputChange("threshold", e.target.value)}
                    className="col-span-3"
                    placeholder="Restocking threshold"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiry" className="text-right">
                    Expiry
                  </Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={newItem.expiry}
                    onChange={(e) => handleInputChange("expiry", e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <Input
                    id="supplier"
                    value={newItem.supplier}
                    onChange={(e) => handleInputChange("supplier", e.target.value)}
                    className="col-span-3"
                    placeholder="Supplier name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="col-span-3"
                    placeholder="Price per unit"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventoryItems && inventoryItems.length > 0 ? (
            inventoryItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'critical' ? 'bg-red-100 text-red-800' :
                      item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                    <span>Stock: {item.stock}/{item.threshold}</span>
                    <span>${item.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.blockchainVerified && (
                    <Shield className="h-4 w-4 text-green-600" title="Blockchain Verified" />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleListOnMarketplace(item)}
                    disabled={syncingItems.has(item.id)}
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {syncingItems.has(item.id) ? "Syncing..." : "List"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOnMarketplace(item)}
                    className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No inventory items found.</p>
              <p className="text-sm">Add some items to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};