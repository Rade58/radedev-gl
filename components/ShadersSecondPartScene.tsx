"use client";

import { useEffect, useRef, useState } from "react";
// import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, useAnimations } from "@react-three/drei";
import {
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  OrthographicCamera,
  PointLight,
  Scene,
  Vector3,
  DirectionalLight,
  MeshStandardMaterial,
  PerspectiveCamera,
  ShaderMaterial,
} from "three";

// -------------------------------------------------------------
import palettes from "nice-color-palettes";
import { backInOut, elasticIn, cubicOut, expoInOut } from "eases";
import bease from "bezier-easing";
import {
  value as randVal,
  setSeed,
  range,
  pick,
} from "canvas-sketch-util/random";
// -------------------------------------------------------------

import { bg_base } from "@/consts/styles";

// -------------------------------------------------------------
import { usePlayheadBackForth } from "@/hooks/usePlayheadBackForth";
import { usePlayhead } from "@/hooks/usePlayhead";
// -------------------------------------------------------------

import fragmentShader from "@/shaders/lesson_3/lesson3.frag";
import vertexShader from "@/shaders/lesson_3/lesson3.vert";

// -------------------------------------------------------------
// -------------------------------------------------------------

export default function ShaderSecondPartScene() {
  // ------------------------------------------------------
  // ------------------------------------------------------
  const zoom = 1;
  // ------------------------------------------------------
  // ------------------------------------------------------

  const {
    gl,
    camera: cam,
    scene: sc,
    clock: { elapsedTime: initialElapsedTime },
    viewport: { aspect },
  } = useThree();

  // ------ CAMMERA, SCENE, LIGHTS, CONTROL
  const scene = sc as unknown as Scene;
  const camera = cam as unknown as PerspectiveCamera; /* OrthographicCamera */

  // --------------------------------------------------------
  // --------------------------------------------------------
  const shaderRef = useRef<ShaderMaterial | null>(null);
  // --------------------------------------------------------
  // --------------------------------------------------------

  setSeed("shaderssec", {});

  // console.log({ aspect });
  // console.log({ clock });
  // const { elapsedTime } = clock;
  // const { offset } = useScroll();
  // -----------------------------------------------------------

  // const [lookAtVector, setLookatVector] = useState<Vector3 | null>(null);

  const { playheadRef, computePlayheadInFrame } = usePlayhead(20, 2, true);

  const pall = pick(palettes);

  useEffect(() => {
    gl.setClearColor(bg_base, 1);
    // gl.setClearColor(pick(pick(palettes)), 1);

    // const mainVec = new Vector3();
    // setLookatVector(mainVec);
    camera.lookAt(new Vector3());

    // const directLight = new DirectionalLight("white", 2);
    // const ambientLight = new AmbientLight("#351430", 1);
    // const pointLight = new PointLight("#8c86d6", 2.6, 73.18);
    // ---------------------------------------------------
    // ---------------------------------------------------

    // ---------------------------------------------------
    // ---------------------------------------------------

    // pointLight.position.set(14, 31, -31).multiplyScalar(3);
  }, []);

  // handle resize for ortographic camera
  // useEffect(() => {
  if (camera instanceof OrthographicCamera) {
    console.log({ camera });

    camera.left = -zoom * aspect;
    camera.right = zoom * aspect;
    camera.top = zoom;
    camera.bottom = -zoom;

    // near and far already defined
    // but you can define it here if you want

    camera.position.set(zoom, zoom, zoom);

    camera.updateProjectionMatrix();
    //
    // console.log("updated");
  }

  // ------------------------------------------------------------
  // ANIMATION FRAME
  useFrame(
    (
      { viewport: { aspect }, scene: sc, clock: { elapsedTime: time } },
      delta
    ) => {
      if (shaderRef.current) {
        // console.log({ time });

        shaderRef.current.uniforms.aspect.value = aspect;
        shaderRef.current.uniforms.time.value = time;

        shaderRef.current.uniforms.stretch.value = time * 0.2;
      }
    }
  );

  return (
    <>
      {/* <axesHelper /> */}
      <pointLight color={"crimson"} intensity={4} position={[-5, 5, 5]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          // @ts-expect-error ref
          ref={shaderRef}
          // args={[{}]}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            time: {
              value: initialElapsedTime,
            },
            aspect: {
              value: aspect,
            },
            //
            stretch: {
              value: 1,
            },

            //
            foo: {
              value: 6,
            },
          }}
        />
      </mesh>
    </>
  );
}
