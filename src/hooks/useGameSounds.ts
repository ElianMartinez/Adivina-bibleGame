import { useCallback, useEffect, useRef } from "react";

// This hook manages game sounds with preloading for better performance
export function useGameSounds() {
  // Using refs to store audio instances so they persist between renders
  const soundRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Preload sounds when the hook is first used
  useEffect(() => {
    // Define all game sounds
    const sounds = {
      correct: "/sounds/correct.mp3",
      wrong: "/sounds/wrong.mp3",
      tick: "/sounds/tick.mp3",
      hover: "/sounds/hover.mp3",
      click: "/sounds/click.mp3",
      success: "/sounds/success.mp3",
    };

    // Create and preload audio elements
    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = "auto"; // Preload the audio file
      soundRefs.current[key] = audio;
    });

    // Cleanup function to remove audio elements
    return () => {
      Object.values(soundRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      soundRefs.current = {};
    };
  }, []);

  // Function to play a specific sound
  const playSound = useCallback((soundName: string, volume = 1) => {
    const audio = soundRefs.current[soundName];
    if (audio) {
      // Reset the audio to the beginning if it's already playing
      audio.currentTime = 0;
      audio.volume = volume;

      // Play the sound and handle any errors silently
      audio.play().catch(() => {
        // Silently handle autoplay restrictions
      });
    }
  }, []);

  return { playSound };
}
