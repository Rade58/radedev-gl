import { useRef } from "react";

export function usePlayheadBackForth(
  duration = 10,
  speed = 10,
  paused = false
) {
  const playheadRef = useRef(0);

  function computePlayheadBackForthInFrame(delta: number, elapsedTime: number) {
    if (!paused) {
      playheadRef.current += delta / duration;

      const t = (elapsedTime % duration) / duration;

      //  Calculate rotation using a sine function
      const maxRotation = (speed * Math.PI) / 2; // 90 degrees
      const rotation = Math.sin(t * Math.PI * 2) * maxRotation;
      playheadRef.current = rotation;
    } else {
      playheadRef.current = 0;
    }
  }

  return {
    playheadBackForthRef: playheadRef,
    computePlayheadBackForthInFrame,
  };
}
