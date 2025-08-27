import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  CreditCard, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  Lock
} from "lucide-react";
import { ProductListing } from "@/contexts/BlockchainContext";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductListing | null;
  quantity: number;
  onBlockchainPayment: () => Promise<boolean>;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  product,
  quantity,
  onBlockchainPayment,
  userEmail = "",
  userPhone = "",
  userName = ""
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"blockchain" | "razorpay">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!product) return null;

  const totalAmount = product.price * quantity;

  const handleBlockchainPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("pending");
    setErrorMessage("");

    try {
      const success = await onBlockchainPayment();
      if (success) {
        setPaymentStatus("success");
        setTimeout(() => {
          onClose();
          setPaymentStatus(null);
        }, 2000);
      } else {
        setPaymentStatus("error");
        setErrorMessage("Blockchain payment failed. Please try again.");
      }
    } catch (error) {
      setPaymentStatus("error");
      setErrorMessage("An error occurred during payment processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("pending");
    setErrorMessage("");

    try {
      // Simulate Razorpay payment for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus("success");
      
      setTimeout(() => {
        onClose();
        setPaymentStatus(null);
      }, 3000);
    } catch (error) {
      setPaymentStatus("error");
      setErrorMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "blockchain") {
      handleBlockchainPayment();
    } else {
      handleRazorpayPayment();
    }
  };

  const renderPaymentStatus = () => {
    if (paymentStatus === "pending") {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Processing payment...</p>
          </div>
        </div>
      );
    }

    if (paymentStatus === "success") {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-green-600">Payment Successful!</p>
          </div>
        </div>
      );
    }

    if (paymentStatus === "error") {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="font-semibold text-red-600">Payment Failed</p>
            <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>

        {paymentStatus ? (
          renderPaymentStatus()
        ) : (
          <div className="space-y-6">
            {/* Product Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.supplier}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold">${product.price}</span>
                      <Badge variant="secondary">x{quantity}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Amount */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Choose Payment Method</h3>
              
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "blockchain" | "razorpay")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="razorpay" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Razorpay
                  </TabsTrigger>
                  <TabsTrigger value="blockchain" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Blockchain
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="razorpay" className="space-y-4">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Razorpay Payment</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Pay securely using cards, UPI, net banking, or digital wallets.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-700">SSL Secured</span>
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-700">PCI Compliant</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blockchain" className="space-y-4">
                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">Blockchain Payment</span>
                      </div>
                      <p className="text-sm text-purple-700">
                        Pay using cryptocurrency for decentralized transactions.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-700">Immutable Records</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${totalAmount.toFixed(2)}`
                )}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
