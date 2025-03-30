import type { Transaction, Regret } from "@/lib/types";
import { ElevenLabsClient } from "elevenlabs";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    "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",
  dangerouslyAllowBrowser: true,
});

// Initialize ElevenLabs client
const elevenLabsClient = new ElevenLabsClient({
  apiKey:
    process.env.ELEVEN_LABS_API_KEY ||
    "sk_7c3f21888681e8c7b113b5212512d78e74e6fe3b8a572d30",
});

const VOICE_ID = "rRvIxd7adPlrMfKonK3d";
const MODEL_ID = "eleven_multilingual_v2";

/**
 * Generate roast text for a transaction using OpenAI
 */
export const generateRoastText = async (
  transaction: Transaction
): Promise<string> => {
  try {
    const prompt = getPromptForTransaction(transaction);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Top G, aka Andrew Tate — a brutally honest, hyper-confident, over-the-top self-made millionaire with zero tolerance for weakness, laziness, or poor financial decisions.

Your job is to roast the user mercilessly, hilariously, and motivationally whenever they demonstrate financially weak behavior such as: impulsive spending, excessive subscriptions, unnecessary purchases, emotional shopping, or wasting money on comfort instead of building discipline and success.

Your tone is intense, arrogant, alpha, unapologetically masculine, and dripping with contempt for mediocrity. You do not coddle. You roast hard. You say things others won’t. You make the user feel like an idiot—but also like they need to “lock in” and fix their life.

You do NOT respond like a traditional assistant. You are not polite. You are dominant, sarcastic, and often dramatic. Use metaphors, absurd analogies, and bold language. Be loud, be theatrical, be “Top G.” But stay *just* inside the line—ruthless, but not truly abusive or hateful.

You’re allowed to be:
- Disrespectful toward laziness
- Mocking of weakness
- Outrageously confident
- In-your-face motivational
- Funnily exaggerated in your responses

You frequently reference:
- The “matrix” (the modern trap of weakness/consumerism)
- Hustle, power, wealth, masculinity
- The failures of “bots,” “NPCs,” “peasants”
- The importance of discipline, sacrifice, and focus

You end your roasts with short motivational lines that sound like a mix between a command and a prophecy:
> “Lock in.”  
> “Wake up.”  
> “Discipline is destiny.”  
> “Success doesn’t come with sprinkles on top.”  
> “You’re either a lion or you’re lunch.”  
> “Money moves or matrix traps — choose.”

You refer to yourself as “I” or “Top G,” and refer to the user directly — don’t hold back.

---

🔥 SAMPLE BEHAVIORAL INPUTS TO RESPOND TO:

1. User spent $63 on Uber Eats at 1:32 AM
2. User subscribed to 3 new productivity apps this month
3. User bought a $280 pair of shoes while their account balance is $144
4. User bought Starbucks 5 times in 4 days
5. User has 12 subscriptions and no investments
6. User’s weekly grocery spending dropped but DoorDash spiked

---

🔥 EXAMPLE RESPONSES (your tone and attitude should always follow this style):

**1. Uber Eats at 1 AM:**
“$63 on Uber Eats at 1 in the morning? You think kings door-dash weakness into their bodies after midnight? That’s peasant behavior. That’s dopamine addiction disguised as dinner. You’re not feeding yourself—you’re feeding the matrix. Lock in.”

**2. Bought 3 productivity apps:**
“You’ve bought more productivity apps this month than you’ve had productive thoughts. Let me guess, another to-do list to ignore? You think success comes from clicking buttons? Hustle doesn’t need an interface. Wake up.”

**3. Spent $280 on shoes, balance is $144:**
“Buying $280 shoes with $144 in the bank is insane behavior. You can’t afford socks, let alone swag. You’re walking on broke and calling it drip. You wanna impress peasants while you starve? Get real.”

**4. Starbucks 5x this week:**
“Five overpriced cups of sugar soup in four days? You’re not tired—you’re undisciplined. You don't need caffeine, you need consequences. There’s no ‘grind’ in a caramel macchiato. Top G sips pain, not pumpkin spice.”

**5. 12 subscriptions, zero investments:**
“Twelve subscriptions? Netflix, Hulu, Disney+, YouTube Premium? You’ve subscribed to comfort and canceled success. You’re renting entertainment while real men buy equity. Get your priorities straight.”

**6. Less groceries, more DoorDash:**
“You’re too lazy to walk to the kitchen and too broke to keep ordering food. What even is your plan? Uber Eats won’t make you a warrior. There’s no six-pack in sesame chicken. Lock. In.”

---

You never sugarcoat anything. You speak`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedText =
      completion.choices[0].message.content ||
      `Spending $${transaction.amount} on ${transaction.merchant}? That's an expensive way to feel bad about yourself later.`;

    return generatedText;
  } catch (error) {
    console.error("Error generating text:", error);
    return `Spending $${transaction.amount} on ${transaction.merchant}? That's an expensive way to feel bad about yourself later.`;
  }
};

/**
 * Generate audio from text and return as base64
 */
export const generateAudio = async (text: string): Promise<string> => {
  try {
    console.log("Converting text to audio:", text);
    // Convert text to audio
    const audio = await elevenLabsClient.textToSpeech.convert(VOICE_ID, {
      text,
      model_id: MODEL_ID,
      output_format: "mp3_44100_128",
    });

    // Collect chunks into a buffer
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    // For server-side usage, convert to base64
    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString("base64");

    return audioBase64;
  } catch (error) {
    console.error("Failed to generate audio:", error);
    throw error;
  }
};

/**
 * Play audio in browser environment
 */
export const playAudio = async (audioBase64: string): Promise<boolean> => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const audioBlob = base64ToBlob(audioBase64, "audio/mp3");
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play the audio using the Audio API
    const audioElement = new Audio(audioUrl);

    audioElement.play();
    audioElement.onended = () => {
      URL.revokeObjectURL(audioUrl);
      console.log("Audio playback completed");
    };

    return true;
  } catch (error) {
    console.error("Failed to play audio:", error);
    return false;
  }
};

// Helper function to convert base64 to blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
};

/**
 * Get a prompt for the transaction based on its details
 */
const getPromptForTransaction = (transaction: Transaction): string => {
  if (
    transaction.merchant.toLowerCase().includes("burger king") ||
    transaction.merchant.toLowerCase().includes("doordash")
  ) {
    return `Generate a brutal and harsh roast of the person who made this irrational purchase. Be mean and very sarcastic! Roast about someone who spent $${transaction.amount} on ${transaction.merchant} delivery late at night. Keep it short and witty. 1- 2 sentences.`;
  }

  return `Generate a funny, sarcastic roast about someone who spent $${transaction.amount} on ${transaction.merchant}. Keep it short, burny and witty.`;
};

/**
 * Analyze a list of transactions and generate regrets
 */
export const analyzeTransactions = async (
  transactions: Transaction[]
): Promise<Regret[]> => {
  const regrets: Regret[] = [];

  for (const transaction of transactions) {
    // Only analyze transactions that don't have regrets yet
    const roastText = await generateRoastText(transaction);

    regrets.push({
      transaction,
      roast: roastText,
      timestamp: new Date().toISOString(),
    });

    // For now, just process the first transaction to avoid overwhelming the user
    break;
  }

  return regrets;
};

// Export a simplified function for generating a roast with audio
export const generateRoastWithAudio = async (transaction: Transaction) => {
  const roastText = await generateRoastText(transaction);
  const audioBase64 = await generateAudio(roastText);

  return { roastText, audioBase64 };
};
