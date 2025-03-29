import type { Transaction } from "@/lib/types";

export const mockTransactions: Transaction[] = [
  {
    amount: 24.99,
    merchant: "DoorDash",
    timestamp: "2025-03-29T02:43:00Z",
    category: "Food Delivery",
  },
  {
    amount: 19.0,
    merchant: "Amazon",
    timestamp: "2025-03-28T14:23:00Z",
    category: "Retail",
  },
  {
    amount: 7.5,
    merchant: "Starbucks",
    timestamp: "2025-03-28T08:15:00Z",
    category: "Coffee",
  },
  {
    amount: 18.99,
    merchant: "Uber Eats",
    timestamp: "2025-03-27T19:30:00Z",
    category: "Food Delivery",
  },
  {
    amount: 6.99,
    merchant: "Starbucks",
    timestamp: "2025-03-27T08:10:00Z",
    category: "Coffee",
  },
  {
    amount: 59.99,
    merchant: "OnlyFans",
    timestamp: "2025-03-26T23:45:00Z",
    category: "Subscription",
  },
  {
    amount: 32.5,
    merchant: "Crystals Unlimited",
    timestamp: "2025-03-26T16:20:00Z",
    category: "Retail",
  },
  {
    amount: 14.99,
    merchant: "Taco Bell",
    timestamp: "2025-03-26T01:15:00Z",
    category: "Food Delivery",
  },
  {
    amount: 7.25,
    merchant: "Starbucks",
    timestamp: "2025-03-25T08:05:00Z",
    category: "Coffee",
  },
  {
    amount: 89.99,
    merchant: "Steam Games",
    timestamp: "2025-03-24T22:10:00Z",
    category: "Entertainment",
  },
];
