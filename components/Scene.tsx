"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Html,
  OrbitControls,
  ScrollControls,
  useProgress,
} from "@react-three/drei";

//
import TinkerScene from "./TinkerScene";
import ShaderScene from "./ShaderScene";
import NoiseScene from "./NoiseScene";
import DiveScene from "./DiveScene";
import PracticeOneScene from "./PracticeOneScene";
import MoonScene from "./MoonScene";
//

export default function Scene() {
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Canvas
      // set to true if you want ortographic camera
      // ------ ortographic camera ------
      // orthographic={true}
      camera={{
        // ---------------------------------------
        // ---------------------------------------
        // ------ ortographic camera------
        // isOrthographicCamera: true,
        // near: -100,
        // far: 100,
        // ---------------------------------------
        // ------ perspective camera ------
        // isPerspectiveCamera: true,
        fov: 50,
        // near: 0.1,
        near: 0.01,
        far: 100,
        position: [2, 2, -6],
        // ---------------------------------------
        // aspect: 1, // don't adjust this in any case,
        // it will mess up aspect ratio, don't set it especially
        // for ortographic camera since
        // we are doing it already in scene

        /* lookAt: (ve3) => {
          console.log({ ve3 });
        }, */
      }}
      // ref={canvasRef}
      gl={{
        antialias: true,
      }}
      dpr={[1, 1.5]}
      className="canvas-holder"
    >
      <Suspense fallback={<Loader />}>
        <OrbitControls />
        {/* <ScrollControls damping={0.5} pages={4}> */}
        {/* <TinkerScene /> */}
        {/* <ShaderScene /> */}
        {/* <NoiseScene /> */}
        {/* <DiveScene /> */}
        {/* <PracticeOneScene /> */}
        <MoonScene />
        {/* </ScrollControls> */}
      </Suspense>
    </Canvas>
  );
}

function Loader() {
  const { active, progress } = useProgress();

  return (
    <Html center className="text-3xl text-stone-100">
      {progress.toFixed(1)}% loaded
    </Html>
  );
}
