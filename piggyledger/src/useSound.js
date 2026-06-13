// This creates the audio object ONCE when the app starts
const clickAudio = new Audio("/click.mp3");

export const useSound = () => {
  const playClick = () => {
    clickAudio.currentTime = 0; // Reset to start so it plays instantly on repeat clicks
    clickAudio.play().catch(e => console.log("Audio failed:", e));
  };
  return { playClick };
};