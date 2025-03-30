"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { playAudio } from "@/lib/transaction-analyzer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [roastData, setRoastData] = useState<{
    text: string;
    audio: string;
  } | null>(null);
  const router = useRouter();

  const orderItems = [
    { name: "Double Whopper Meal", price: 12.99, quantity: 1 },
    { name: "Chicken Royale", price: 8.99, quantity: 1 },
    { name: "Chicken Fries", price: 4.99, quantity: 1 },
    { name: "Onion Rings (Large)", price: 3.49, quantity: 1 },
    { name: "Chocolate Shake", price: 4.49, quantity: 1 },
  ];

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 2.99;
  const serviceFee = 1.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + serviceFee + tax;

  const handleCheckout = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-roast", { method: "POST" });
      if (!res.ok) {
        throw new Error("Failed to generate roast");
      }
      const { roastText, audioBase64 } = await res.json();

      // Store roast data and play audio
      setRoastData({ text: roastText, audio: audioBase64 });
      playAudio(audioBase64);

      // Show confirmation modal
      setAlertOpen(true);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process transaction", {
        description: "Something went wrong while generating your roast.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmPurchase = () => {
    setAlertOpen(false);
    toast.success("Purchase completed!", {
      description: "Your order has been placed successfully.",
    });
    if (roastData) {
      toast(roastData.text, {
        description: "Your purchase has been analyzed",
        duration: 20000,
        className: "dark flex-col",
        action: {
          label: "Dashboard",
          onClick: () => router.push("/"),
        },
      });
    }
  };

  const handleCancelPurchase = () => {
    setAlertOpen(false);
    toast.info("Purchase canceled", {
      description: "Your order has been canceled.",
    });
  };

  return (
    <main className="container max-w-4xl mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Food Order Details */}
        <div className="w-full md:w-2/3">
          <Card className="p-6">
            <div className="flex items-center gap-4 border-b pb-4 mb-4">
              <div className="w-16 h-16 relative overflow-hidden rounded-full">
                <Image
                  src="/images/doordash-logo.jpg"
                  alt="DoorDash"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Burger King</h2>
                <p className="text-muted-foreground">Delivery in 25-40 min</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                DashPass
              </Badge>
            </div>
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg">Your Order</h3>
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{item.quantity}×</span>
                    <span>{item.name}</span>
                  </div>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="w-full md:w-1/3">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3"
              size="lg"
              onClick={handleCheckout}
              disabled={isGenerating}
            >
              {isGenerating ? "Processing..." : "Place Order"}
            </Button>
            <p className="text-xs text-center mt-4 text-muted-foreground">
              By placing your order, you agree to our Terms of Service and
              acknowledge you&apos;ve read our Privacy Policy
            </p>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to proceed?
            </AlertDialogTitle>
            <AlertDialogDescription>
              After hearing our analysis, do you still want to complete this
              purchase?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelPurchase}>
              No, cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPurchase}>
              Yes, proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
