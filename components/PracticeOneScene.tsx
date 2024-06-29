"use client";

import { useEffect, useRef, useState } from "react";
// import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
// import { useEffect } from "react";
import {
  DirectionalLight,
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  OrthographicCamera,
  PointLight,
  Scene,
  Vector3,
  MeshStandardMaterial,
  PerspectiveCamera,
  ShaderMaterial,
  AxesHelper,
  DirectionalLightHelper,
  PointLightHelper,
  Color,
} from "three";

//
import palettes from "nice-color-palettes";

import { backInOut, elasticIn, cubicOut, expoInOut } from "eases";

import bease from "bezier-easing";

import {
  value as randVal,
  setSeed,
  range,
  pick,
} from "canvas-sketch-util/random";

import { bg_base } from "@/consts/styles";
import { usePlayhead } from "@/hooks/usePlayhead";

//

/**
 *
 * @description firts practice Scene
 */
export default function PracticeOneScene() {
  const zoom = 4;
  const pall = pick(palettes);
  setSeed("gamareo", {});
  // ------------------------------------------------------
  // ------------------------------------------------------
  // ------------------------------------------------------
  const { playheadRef, computePlayheadInFrame } = usePlayhead(20, 2, true);
  // ------------------------------------------------------
  // ------------------------------------------------------
  // ------------------------------------------------------

  const {
    gl,
    camera: cam,
    scene: sc,
    viewport: { aspect },
  } = useThree();

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // ------ CAMMERA, SCENE, LIGHTS, CONTROL
  const scene = sc as unknown as Scene;
  const camera = cam as unknown as PerspectiveCamera;
  // const camera = cam as unknown as  OrthographicCamera;
  // -------------------------------------------------------------
  // -------------------------------------------------------------

  // console.log({ aspect });
  // console.log({ clock });
  // const { elapsedTime } = clock;
  // const { offset } = useScroll();
  // -----------------------------------------------------------
  //  CAMERA LOOK AT VECTOR
  const [lookAtVector, setLookatVector] = useState<Vector3 | null>(null);

  //  SET UP SCENE
  useEffect(() => {
    gl.setClearColor(bg_base, 1);

    //
    camera.lookAt(new Vector3());

    camera;
  }, []);

  // handle resize for ortographic camera
  // useEffect(() => {
  if (camera instanceof OrthographicCamera) {
    // console.log({ camera });

    camera.left = -zoom * aspect;
    camera.right = zoom * aspect;
    camera.top = zoom;
    camera.bottom = -zoom;

    // near and far already defined
    // but you can define it here if you want

    camera.position.set(zoom, zoom, zoom);

    camera.updateProjectionMatrix();
  }

  // ------------------------------------------------------------
  // ANIMATION FRAME
  useFrame(
    (
      {
        camera: cm,
        viewport: { aspect },
        scene: sc,
        clock: { elapsedTime: time },
      },
      delta
    ) => {
      //
    }
  );

  return (
    <>
      <axesHelper />
      <mesh>
        <icosahedronGeometry args={[2, 0]} />
        <meshNormalMaterial flatShading />
      </mesh>
    </>
  );
}
