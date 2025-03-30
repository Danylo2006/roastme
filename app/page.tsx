"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionFeed from "@/components/transaction-feed";
import RegretHistory from "@/components/regret-history";
import { mockTransactions } from "@/lib/mock-data";
import type { Transaction } from "@/lib/types";
import { toast } from "sonner";
import { analyzeTransactions } from "@/lib/transaction-analyzer";
import { useRegretStore } from "@/lib/store";
import Link from "next/link";
// import { useEffect } from "react";

export default function Home() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const regrets = useRegretStore((state) => state.regrets);
  const addRegrets = useRegretStore((state) => state.addRegrets);
  const clearRegrets = useRegretStore((state) => state.clearRegrets);
  const [isScanning, setIsScanning] = useState(false);

  const handleManualScan = async () => {
    setIsScanning(true);

    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Analyze transactions and generate regrets
    const newRegrets = await analyzeTransactions(transactions);

    // Add to the store
    if (newRegrets.length > 0) {
      addRegrets(newRegrets);

      toast("💸 RegretBot™ Analysis", {
        description: (
          <div className="flex flex-col gap-2">
            <p>{newRegrets[0].roast}</p>
          </div>
        ),
        duration: 15000,
      });
    } else {
      toast("No Regrets Found", {
        description:
          "Wow, you're actually being financially responsible. Boring!",
        duration: 6000,
      });
    }

    setIsScanning(false);
  };

  return (
    <main className="container max-w-4xl mx-auto py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          RegretBot™
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          The AI that judges your financial decisions so your friends don&apos;t
          have to
        </p>

        <div className="flex gap-4">
          {regrets.length === 0 ? (
            <Link href="/mock-checkout">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Try Demo Checkout
              </Button>
            </Link>
          ) : (
            <>
              <Button
                size="lg"
                onClick={handleManualScan}
                disabled={isScanning}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {isScanning
                  ? "Scanning Transactions..."
                  : "Scan More Transactions"}
              </Button>

              <Button variant="outline" size="lg" onClick={clearRegrets}>
                Clear All Regrets
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="transactions">Transaction Feed</TabsTrigger>
          <TabsTrigger value="regrets">Regret History</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionFeed transactions={transactions} regrets={regrets} />
        </TabsContent>

        <TabsContent value="regrets">
          <RegretHistory
            regrets={regrets}
            onRoastAgain={async (transaction) => {
              const newRegret = await analyzeTransactions([transaction]);
              if (newRegret.length > 0) {
                addRegrets(newRegret);

                toast("🔥 Fresh Roast Served!", {
                  description: (
                    <div className="flex flex-col gap-2">
                      <p>{newRegret[0].roast}</p>
                    </div>
                  ),
                  duration: 5000,
                });
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
