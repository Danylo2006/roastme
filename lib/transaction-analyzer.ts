import type { Transaction, Regret } from "@/lib/types";
import { isLateNight, getTimeOfDay } from "./utils";
import "dotenv/config";
import OpenAI from "openai";

// Simple OpenAI client
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

// Function to check if a transaction is "regrettable"
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

// Generate a roast using OpenAI
async function generateRoast(
  transaction: Transaction
): Promise<{ roast: string; regretStat: string }> {
  try {
    const timeOfDay = getTimeOfDay(transaction.timestamp);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sarcastic financial advisor who roasts people's spending habits.",
        },
        {
          role: "user",
          content: `Generate a funny, sarcastic roast about someone who spent $${transaction.amount} at ${transaction.merchant} 
                   during the ${timeOfDay}. Also generate a made-up statistic about people who regret similar purchases.
                   Format as JSON: { "roast": "Your roast here", "regretStat": "73% of people regretted this purchase" }`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;

    if (response) {
      const parsedResponse = JSON.parse(response);
      return {
        roast: parsedResponse.roast,
        regretStat: parsedResponse.regretStat,
      };
    }

    // Fallback if no response
    throw new Error("No response from OpenAI");
  } catch (error) {
    console.error("Error generating roast:", error);
    return getFallbackRoast(transaction);
  }
}

// Fallback roasts
const fallbackRoasts = [
  {
    merchant: "DoorDash",
    roasts: ["Another DoorDash order? Your kitchen is feeling neglected."],
    stats: [
      "78% of people regretted ordering delivery when they had food at home.",
    ],
  },
  {
    merchant: "Starbucks",
    roasts: ["Your barista is naming their yacht after you."],
    stats: [
      "82% of daily coffee drinkers could have bought a car with what they spent in a year.",
    ],
  },
  {
    merchant: "default",
    roasts: [
      "Did your money burn a hole in your pocket?",
      "Your bank account is giving you side-eye right now.",
    ],
    stats: ["67% of impulse purchases end up unused or forgotten."],
  },
];

// Get a fallback roast if OpenAI fails
function getFallbackRoast(transaction: Transaction): {
  roast: string;
  regretStat: string;
} {
  const merchantRoasts =
    fallbackRoasts.find(
      (m) => m.merchant.toLowerCase() === transaction.merchant.toLowerCase()
    ) || fallbackRoasts.find((m) => m.merchant === "default");

  const randomRoast =
    merchantRoasts?.roasts[
      Math.floor(Math.random() * merchantRoasts.roasts.length)
    ] || "Your wallet is judging you right now.";

  const randomStat =
    merchantRoasts?.stats[
      Math.floor(Math.random() * merchantRoasts.stats.length)
    ] || "75% of people regretted similar purchases.";

  return { roast: randomRoast, regretStat: randomStat };
}

// Main function to analyze transactions and generate regrets
// Modified to only analyze the most recent transaction
export async function analyzeTransactions(
  transactions: Transaction[]
): Promise<Regret[]> {
  if (transactions.length === 0) return [];

  // Sort transactions by timestamp in descending order to get the most recent one
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Only analyze the most recent transaction
  const mostRecent = sortedTransactions[0];
  const isRegrettable = isRegrettableTransaction(mostRecent);

  // Only generate a roast if it's regrettable
  if (isRegrettable) {
    const { roast, regretStat } = await generateRoast(mostRecent);
    return [
      {
        transaction: mostRecent,
        roast,
        regretStat,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  return [];
}
