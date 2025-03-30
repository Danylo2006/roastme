import { NextResponse } from "next/server";
import { generateRoastWithAudio } from "@/lib/transaction-analyzer";

// Mock transaction for demonstration
const mockTransaction = {
  amount: 25.99,
  merchant: "Burger King",
  timestamp: new Date().toISOString(),
  category: "food",
};

export async function POST() {
  try {
    // Generate roast text and audio
    const { roastText, audioBase64 } = await generateRoastWithAudio(
      mockTransaction
    );

    // Return the results
    return NextResponse.json(
      {
        roastText,
        audioBase64,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating roast:", error);
    return NextResponse.json(
      { error: "Failed to generate roast" },
      { status: 500 }
    );
  }
}
