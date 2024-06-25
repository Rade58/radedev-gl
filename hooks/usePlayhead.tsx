import { useRef } from "react";

export function usePlayhead(duration = 10, loop = false) {
  const playheadRef = useRef(0);

  function computePlayheadInFrame(delta: number, elapsedTime?: number) {
    playheadRef.current += delta / duration;

    if (elapsedTime !== undefined) {
      const t = (elapsedTime % duration) / duration;

      //  Calculate rotation using a sine function
      const maxRotation = Math.PI / 2; // 90 degrees
      const rotation = Math.sin(t * Math.PI * 2) * maxRotation;
      playheadRef.current = rotation;
    } else {
      if (loop) {
        playheadRef.current %= 1;
      } else {
        playheadRef.current = Math.min(playheadRef.current, 1);
      }
    }
  }

  return {
    playheadRef,
    computePlayheadInFrame,
  };
}
