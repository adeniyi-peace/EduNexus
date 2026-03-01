// type declearation for paystack-inline-js

declare module '@paystack/inline-js' {
// Defines the configuration object for a Paystack transaction.
export interface PaystackTransactionConfig {
key: string; // Your Paystack public key
email: string; // Customer email
amount: number; // Amount in kobo (e.g., ₦5000 should be 500000)
currency?: string; // Default: 'NGN'
ref?: string; // Optional unique transaction reference
metadata?: Record<string, any>;
onSuccess: (transaction: { reference: string; [key: string]: any }) => void;
onCancel: () => void;
[key: string]: any; // Allow for other potential properties
}

// Declares the PaystackPop class and its method.
export default class PaystackPop {
newTransaction(config: PaystackTransactionConfig): void;
}
}