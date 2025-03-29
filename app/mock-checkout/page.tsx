"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { analyzeTransactions } from "@/lib/transaction-analyzer";
import type { Transaction } from "@/lib/types";
import { useRegretStore } from "@/lib/store";

export default function MockCheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const addRegret = useRegretStore((state) => state.addRegret);

  // Mock order details
  const orderDetails = {
    restaurant: "Burger King",
    items: [
      { name: "Whopper Meal", price: 12.99, quantity: 1 },
      { name: "Chicken Fries", price: 5.49, quantity: 1 },
      { name: "Oreo Shake", price: 4.99, quantity: 1 },
    ],
    subtotal: 23.47,
    deliveryFee: 4.99,
    serviceFee: 3.5,
    tax: 2.35,
    tip: 4.0,
    total: 38.31,
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success message
    toast.success("Order placed successfully!", {
      description: "Your order has been placed and will be delivered soon.",
      duration: 3000,
    });

    // Create a transaction object from the order for analysis
    const currentTime = new Date().toISOString();
    const mockTransaction: Transaction = {
      merchant: orderDetails.restaurant,
      amount: orderDetails.total,
      timestamp: currentTime,
      category: "Food Delivery",
    };

    // Wait a bit and then analyze the transaction for roasting
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // Generate a real roast using our analyzer
      const regrets = await analyzeTransactions([mockTransaction]);

      if (regrets.length > 0) {
        // Store the regret in the global store
        addRegret(regrets[0]);

        // Show the roast notification with a "Get more info" action button at the bottom
        toast("💸 RegretBot™ Analysis", {
          description: (
            <div className="flex flex-col gap-4">
              <p>{regrets[0].roast}</p>
              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => router.push("/")}
              >
                Get more info
              </Button>
            </div>
          ),
          duration: 15000,
        });
      } else {
        // Fallback in case no regrets are generated
        const fallbackText =
          "Spending $38 on fast food at this hour? Your arteries and wallet are both crying right now.";

        // Create a fallback regret
        const fallbackRegret = {
          transaction: mockTransaction,
          roast: fallbackText,
          regretStat:
            "78% of people who order fast food delivery regret it within 30 minutes.",
          timestamp: new Date().toISOString(),
        };

        // Store the fallback regret
        addRegret(fallbackRegret);

        toast("💸 RegretBot™ Analysis", {
          description: (
            <div className="flex flex-col gap-4">
              <p>{fallbackText}</p>
              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => router.push("/")}
              >
                Get more info
              </Button>
            </div>
          ),
          duration: 15000,
        });
      }
    } catch (error) {
      console.error("Error analyzing transaction:", error);

      // Fallback notification if analysis fails
      const errorFallbackText =
        "Spending $38 on fast food delivery? That's an expensive way to feel bad about yourself later.";

      // Create an error fallback regret
      const errorFallbackRegret = {
        transaction: mockTransaction,
        roast: errorFallbackText,
        regretStat: "67% of impulse food purchases end up as regrets.",
        timestamp: new Date().toISOString(),
      };

      // Store the error fallback regret
      addRegret(errorFallbackRegret);

      toast("💸 RegretBot™ Analysis", {
        description: (
          <div className="flex flex-col gap-4">
            <p>{errorFallbackText}</p>
            <Button
              size="sm"
              className="mt-2 w-full"
              onClick={() => router.push("/")}
            >
              Get more info
            </Button>
          </div>
        ),
        duration: 15000,
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="container max-w-3xl mx-auto p-4 py-8">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 mr-3 relative">
          <Image
            src="/images/doordash-logo.jpg"
            alt="DoorDash Logo"
            fill
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <strong>Address:</strong> 123 Main St, Apt 4B, San Francisco, CA
                94105
              </p>
              <p className="text-muted-foreground">
                <strong>Delivery time:</strong> 30-45 min
              </p>
              <div className="mt-4 flex items-center">
                <div className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center text-white mr-3">
                  <span>🚗</span>
                </div>
                <p>Standard Delivery</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-10 h-6 bg-blue-700 rounded mr-3"></div>
                <p>•••• •••• •••• 4242</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <span className="mr-2">{orderDetails.restaurant}</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Open
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between mb-3">
                  <div>
                    <span className="font-medium">{item.quantity}x </span>
                    <span>{item.name}</span>
                  </div>
                  <div>{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(orderDetails.deliveryFee)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Service Fee</span>
                  <span>{formatCurrency(orderDetails.serviceFee)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Tax</span>
                  <span>{formatCurrency(orderDetails.tax)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Driver Tip</span>
                  <span>{formatCurrency(orderDetails.tip)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex flex-col">
              <div className="flex justify-between w-full py-2 font-bold">
                <span>Total</span>
                <span>{formatCurrency(orderDetails.total)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 mt-3"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
