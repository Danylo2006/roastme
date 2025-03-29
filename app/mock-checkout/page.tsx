"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roastText, setRoastText] = useState("");

  const handleGenerateRoast = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-roast", { method: "POST" });
      if (!res.ok) {
        throw new Error("Failed to generate roast");
      }
      const { roastText, audioBase64 } = await res.json();

      // Convert base64 audio to ArrayBuffer and then Blob
      const binary = atob(audioBase64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      // Create an audio element and play it
      const audioElement = new Audio(url);

      // Wait for audio to start playing before showing text
      audioElement.onplay = () => {
        // Display the roast in a toast notification
        toast("💸 RegretBot™ Analysis", {
          description: <p>{roastText}</p>,
          duration: 15000,
        });

        // Set roast text to show in the UI
        setRoastText(roastText);
      };

      audioElement.play();
      audioElement.onended = () => {
        URL.revokeObjectURL(url);
        console.log("Audio playback completed");
      };
    } catch (error) {
      console.error("Error in roast process:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="container max-w-4xl mx-auto py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          RegretBot™
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          The AI that judges your financial decisions so your friends don&apos;t
          have to.
        </p>
        <div className="flex gap-4">
          <Link href="/mock-checkout">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Try Demo Checkout
            </Button>
          </Link>
          <Button
            size="lg"
            onClick={handleGenerateRoast}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isGenerating ? "Generating..." : "Generate Roast"}
          </Button>
        </div>
      </div>

      {roastText && (
        <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Latest Roast:</h2>
          <p className="text-lg">{roastText}</p>
        </div>
      )}
    </main>
  );
}
