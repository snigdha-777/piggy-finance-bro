import { initializeApp, getApps, getApp } from "firebase/app";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"; // 🪙 Fixed: Combined here at the top!

// 1. Paste your Web App's Firebase Configuration object here
const firebaseConfig = {
  apiKey: "YOUR_WEB_API_KEY",
  authDomain: "localhost", // 🌐 Changed this to localhost for smooth local requests
  projectId: "piggy-ledger-cdf81", // 🎯 Your exact project ID! Perfect.
  storageBucket: "piggy-ledger-cdf81.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Safely initialize the Firebase Client App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const functions = getFunctions(app);

// 👑 HACKATHON ACCELERATOR: Safely point to local ports when running on localhost
if (window.location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "127.0.0.1", 5002);
}

/**
 * 📬 Fires a secure network request to generate progress letters.
 */
export async function fetchPiggyLetter(activePiggy) {
  try {
    const generateLetterCallable = httpsCallable(functions, "generatePiggyLetter");
    const result = await generateLetterCallable(activePiggy);
    return result.data.letter;
  } catch (error) {
    console.error("Cloud Function request intercepted an error:", error);
    return "Oink! I tried to contact the server to get your layout letter, but the network request timed out. Make sure your local emulator or server is live! 🐷";
  }
}

/**
 * 🐷 Connects PiggyChat.txt straight to your Firebase OpenAI function!
 */
export async function askPiggyAnything(activePiggy, promptString) {
  try {
    const askPiggyCallable = httpsCallable(functions, "askPiggyAnything");
    
    const result = await askPiggyCallable({
      piggy: activePiggy,
      prompt: promptString
    });
    
    return result.data.answer;
  } catch (error) {
    console.error("Cloud Function Chat Error:", error);
    return "Oink! I couldn't reach my internal thoughts right now. Check that your Firebase Emulator is running! 🔌🐷";
  }
}