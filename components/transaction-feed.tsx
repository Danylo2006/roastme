"use client";

import type { Transaction, Regret } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isLateNight } from "@/lib/utils";

export interface TransactionFeedProps {
  transactions: Transaction[];
  regrets?: Regret[];
}

// Function to determine if a transaction is regrettable (copied from transaction-analyzer logic)
function isRegrettableTransaction(transaction: Transaction): boolean {
  // Late night purchases (between 10 PM and 5 AM)
  if (isLateNight(transaction.timestamp)) return true;
  // Food delivery with high amounts
  if (transaction.category === "Food Delivery" && transaction.amount > 15)
    return true;
  // Suspicious merchants
  const suspiciousMerchants = ["OnlyFans", "Crystals Unlimited", "Steam Games"];
  if (suspiciousMerchants.includes(transaction.merchant)) return true;
  // Coffee purchases
  if (transaction.category === "Coffee") return true;
  // High value retail purchases
  if (transaction.category === "Retail" && transaction.amount > 50) return true;
  return false;
}

export default function TransactionFeed({
  transactions,
  regrets = [],
}: TransactionFeedProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Transaction Feed</h2>
        <p className="text-muted-foreground mb-4">
          No transactions found. Add some transactions to get started!
        </p>
      </div>
    );
  }

  // Calculate total unnecessary spending from regrets
  const totalUnnecessarySpending = regrets.reduce(
    (total, regret) => total + regret.transaction.amount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Transaction Feed</h2>
        {regrets.length > 0 && (
          <div className="p-3 rounded-lg border bg-muted text-muted-foreground">
            <p className="text-sm font-medium">
              Total unnecessary spending:{" "}
              {formatCurrency(totalUnnecessarySpending)}
            </p>
          </div>
        )}
      </div>

      {transactions.map((transaction, index) => {
        const isRegrettable = isRegrettableTransaction(transaction);
        const borderColor = isRegrettable
          ? "border-red-500"
          : "border-green-500";

        return (
          <Card
            key={index}
            className={`overflow-hidden transition-all duration-200 hover:shadow-md ${borderColor} border-2`}
          >
            <CardHeader
              className={`${
                isRegrettable
                  ? "bg-red-50 dark:bg-red-950/30"
                  : "bg-green-50 dark:bg-green-950/30"
              } pb-2`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">
                    {transaction.merchant}
                  </CardTitle>
                  <Badge
                    variant={isRegrettable ? "destructive" : "outline"}
                    className={
                      isRegrettable
                        ? "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200"
                        : "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200"
                    }
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <Badge
                  variant={isRegrettable ? "destructive" : "outline"}
                  className="font-semibold text-base"
                >
                  {formatCurrency(transaction.amount)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {formatDate(transaction.timestamp)}
              </p>
            </CardHeader>
            <CardContent className="pt-4 pb-3">
              <p className="text-sm">
                {isRegrettable
                  ? "This might be a regrettable purchase 😬"
                  : "Looks like a reasonable purchase 👍"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
