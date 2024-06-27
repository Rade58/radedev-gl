import { useRef } from "react";

export function usePlayhead(duration = 10, speed = 1, loop = true) {
  const playheadRef = useRef(0);

  function computePlayheadInFrame(delta: number) {
    playheadRef.current += (delta / duration) * speed;
    //
    if (loop) {
      playheadRef.current %= 1;
    } else {
      playheadRef.current = Math.min(playheadRef.current, 1);
    }
  }

  return {
    playheadRef,
    computePlayheadInFrame,
  };
}
