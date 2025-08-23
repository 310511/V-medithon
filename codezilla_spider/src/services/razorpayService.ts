/**
 * Razorpay Payment Service for MedChain Marketplace
 * Handles payment processing through Razorpay
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  order_id: string;
  description: string;
  email: string;
  contact: string;
  created_at: number;
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  orderId: string;
  description: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
  };
}

class RazorpayService {
  private keyId: string;
  private keySecret: string;
  private isInitialized: boolean = false;

  constructor() {
    // In production, these should come from environment variables
    this.keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY';
    this.keySecret = process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'YOUR_TEST_SECRET';
  }

  /**
   * Initialize Razorpay SDK
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay SDK'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Create a Razorpay order on the server
   */
  async createOrder(orderData: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: { [key: string]: string };
  }): Promise<RazorpayOrder> {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Process payment using Razorpay
   */
  async processPayment(options: PaymentOptions): Promise<RazorpayPayment> {
    try {
      await this.initialize();

      return new Promise((resolve, reject) => {
        const rzpOptions = {
          key: this.keyId,
          amount: options.amount * 100, // Razorpay expects amount in paise
          currency: options.currency || 'INR',
          name: 'MedChain Marketplace',
          description: options.description,
          order_id: options.orderId,
          prefill: {
            name: options.prefill?.name || options.customerName,
            email: options.prefill?.email || options.customerEmail,
            contact: options.prefill?.contact || options.customerPhone,
          },
          notes: options.notes,
          theme: {
            color: options.theme?.color || '#6366f1',
          },
          handler: (response: any) => {
            resolve({
              id: response.razorpay_payment_id,
              amount: options.amount,
              currency: options.currency || 'INR',
              status: 'captured',
              method: response.razorpay_payment_method || 'card',
              order_id: response.razorpay_order_id,
              description: options.description,
              email: options.customerEmail,
              contact: options.customerPhone || '',
              created_at: Date.now(),
            });
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            },
          },
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.open();
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature
   */
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          orderId,
          signature,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId: string): Promise<RazorpayPayment | null> {
    try {
      const response = await fetch(`/api/razorpay/payment/${paymentId}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return null;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<boolean> {
    try {
      const response = await fetch('/api/razorpay/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          amount,
          reason,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error refunding payment:', error);
      return false;
    }
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Convert amount to paise (Razorpay format)
   */
  toPaise(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert paise to amount
   */
  fromPaise(paise: number): number {
    return paise / 100;
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService();
export default razorpayService;
