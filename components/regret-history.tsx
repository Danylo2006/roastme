"use client";

import type { Regret } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Repeat, Share2 } from "lucide-react";

export interface RegretHistoryProps {
  regrets: Regret[];
  onRoastAgain: (transaction: Regret["transaction"]) => void;
}

export default function RegretHistory({
  regrets,
  onRoastAgain,
}: RegretHistoryProps) {
  if (regrets.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Regret History</h2>
        <p className="text-muted-foreground mb-4">
          No regrets yet. Complete a purchase in the Demo Checkout to see your
          regrets!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Regret History</h2>
      {regrets.map((regret, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="bg-muted pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {regret.transaction.merchant}
              </CardTitle>
              <Badge variant="outline">
                {formatCurrency(regret.transaction.amount)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(regret.transaction.timestamp)}
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                🤖
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">RegretBot™ says:</p>
                <p className="text-muted-foreground">{regret.roast}</p>
                {regret.regretStat && (
                  <p className="mt-2 text-sm bg-muted p-2 rounded-md">
                    {regret.regretStat}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRoastAgain(regret.transaction)}
              className="flex items-center gap-1"
            >
              <Repeat className="h-4 w-4" />
              Roast Me Again
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                const text = `RegretBot just roasted me: "${regret.roast}" #RegretBot`;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    text
                  )}`,
                  "_blank"
                );
              }}
            >
              <Share2 className="h-4 w-4" />
              Share My Shame
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
