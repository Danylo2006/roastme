"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ElevenLabsClient } from "elevenlabs";
import OpenAI from "openai";
import Link from "next/link";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

// Initialize ElevenLabs client
const elevenLabsClient = new ElevenLabsClient({
  apiKey: "sk_7c3f21888681e8c7b113b5212512d78e74e6fe3b8a572d30",
});

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const MODEL_ID = "eleven_multilingual_v2";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roastText, setRoastText] = useState("");

  // Function to generate text using OpenAI
  const generateText = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a sarcastic financial advisor who has personality of Andrew Tate. you roast people's spending habits in his style.",
          },
          {
            role: "user",
            content:
              "Generate a funny, sarcastic roast about someone who spent $38 on Burger King delivery late at night. Keep it short, burny and witty.",
          },
        ],
      });

      const generatedText =
        completion.choices[0].message.content ||
        "Spending $38 on fast food delivery? That's an expensive way to feel bad about yourself later.";

      setRoastText(generatedText);
      return generatedText;
    } catch (error) {
      console.error("Error generating text:", error);
      const fallbackText =
        "Spending $38 on fast food delivery? That's an expensive way to feel bad about yourself later.";
      setRoastText(fallbackText);
      return fallbackText;
    }
  };

  // Function to generate and play audio
  const generateAndPlayAudio = async (text: string) => {
    try {
      console.log("Converting and playing text:", text);

      // Convert text to audio
      const audio = await elevenLabsClient.textToSpeech.convert(VOICE_ID, {
        text,
        model_id: MODEL_ID,
        output_format: "mp3_44100_128",
      });

      console.log("Audio generated, starting playback...");

      // Collect chunks into a buffer
      const chunks = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      const audioBuffer = new Blob(chunks, { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBuffer);

      // Play the audio using the Audio API
      const audioElement = new Audio(audioUrl);
      audioElement.play();
      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl);
        console.log("Audio playback completed");
      };

      return true;
    } catch (error) {
      console.error("Failed to generate or play audio:", error);
      return false;
    }
  };

  // Main function to handle the roast generation and audio playback
  const handleGenerateRoast = async () => {
    setIsGenerating(true);
    try {
      // Generate the roast text
      const text = await generateText();

      // Display the roast in a toast notification
      toast("💸 RegretBot™ Analysis", {
        description: <p>{text}</p>,
        duration: 15000,
      });

      // Generate and play audio
      await generateAndPlayAudio(text);
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
