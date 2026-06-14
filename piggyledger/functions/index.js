const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { OpenAI } = require("openai");

// 🔍 BUG #2 CHECK: Verify if environment variables are visible at runtime
console.log("=== FIREBASE RUNTIME ENVIRONMENT VERIFICATION ===");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);
console.log("=================================================");

let openai;
/**
 * Safely initializes OpenAI only when needed to prevent global initialization crashes
 */
function getOpenAIClient() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new HttpsError("failed-precondition", "The server environment is missing the OPENAI_API_KEY configuration variable.");
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
    });
  }
  return openai;
}

/**
 * 📬 GENERATE PROGRESS SUMMARY LETTER
 */
exports.generatePiggyLetter = onCall(async (request) => {
  const piggyData = request.data;
  if (!piggyData) {
    throw new HttpsError("invalid-argument", "The function must be called with piggy data.");
  }

  const recentDeposits = (piggyData.logs || [])
    .filter(log => log.type === "deposit")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
    .map(log => `- ${log.user}: ₹${log.amount}${log.note ? ` ("${log.note}")` : ""}`)
    .join("\n");

  const progressPercent = Math.round(((piggyData.savedAmount || 0) / (piggyData.goal || 1)) * 100);

  const prompt = `
    Generate a highly energetic, playful financial savings progress letter written by an encouraging financial buddy named "Piggy".
    
    Goal Name: ${piggyData.name}
    Target Goal Amount: ₹${piggyData.goal}
    Current Total Savings: ₹${piggyData.savedAmount || 0}
    Progress Percentage: ${progressPercent}%
    
    Recent Individual Contributions:
    ${recentDeposits || "No recent deposits logged yet."}
    
    Write exactly 3 brief paragraphs:
    1. Summary (A vibrant greeting acknowledging their current milestones)
    2. Progress (Breakdown of how much closer they are to the goal)
    3. Encouragement (A quirky action challenge to keep the streak going)
    
    Keep the tone retro, cute, and under 130 words total.
  `;

  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return {
      // 🌐 BUG #1 FIXED: Added proper array index accessor
      letter: completion.choices.message.content
    };
  } catch (error) {
    console.error("OpenAI call failed:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to communicate with OpenAI engine.");
  }
});

/**
 * 💬 🐷 RETRO MESSENGER CONVERSATION AGENT
 */
exports.askPiggyAnything = onCall(async (request) => {
  const { piggy, prompt: userPrompt } = request.data || {};
  
  if (!piggy || !userPrompt) {
    throw new HttpsError("invalid-argument", "The function must be called with an object containing both 'piggy' and 'prompt'.");
  }

  const fullHistoryDump = (piggy.logs || [])
    .map(log => `[${log.timestamp}] ${log.user} executed a ${log.type} of ₹${log.amount} (Note: "${log.note || 'None'}")`)
    .join("\n");

  const systemInstructions = `
    You are "Piggy", a helpful, witty, and intelligent 90s retro desktop virtual pet assistant living inside a savings piggy bank software application.
    
    Your goal is to answer specific user questions about their budget allocations, timeline forecasts, leaderboards, or metrics using ONLY the telemetry data file provided below.
    
    --- ACCOUNT SNAPSHOT TELEMETRY ---
    Vault Workspace Title: ${piggy.name}
    Vault Architecture Type: ${piggy.type}
    Financial Saving Goal Target: ₹${piggy.goal}
    Current Combined Ledger Balance: ₹${piggy.savedAmount || 0}
    Registered Team Members/Contributors: ${piggy.members ? piggy.members.join(", ") : "Owner only"}
    
    --- COMPLETE HISTORICAL TRANSACTION LOG SHEET ---
    ${fullHistoryDump || "No financial actions have been logged yet on this sheet."}
    ----------------------------------
    
    RULES FOR RESPONSES:
    1. Be concise, scannable, and extremely punchy (keep under 3-4 short sentences).
    2. Maintain a cute desktop mascot personality (use occasional oinks, 🐷, or coin emojis).
    3. Calculate data cleanly based on logs (e.g., if asked who contributed most, verify individual deposit logs).
    4. If the user asks a tracking question (like reaching a goal by a certain month), use basic estimation reasoning based on the current balance vs target.
  `;

  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstructions },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
    });

    return {
      // 🌐 BUG #1 FIXED: Added proper array index accessor
      answer: completion.choices.message.content
    };
  } catch (error) {
    console.error("OpenAI Chat Engine execution crashed:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "The chat engine was unable to parse a response.");
  }
});