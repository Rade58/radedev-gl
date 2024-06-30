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
  Texture,
  TextureLoader,
  Group,
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
export default function MoonScene() {
  const moonBasMatRef = useRef<MeshBasicMaterial | null>(null);
  const earthBasMatRef = useRef<MeshBasicMaterial | null>(null);
  const moonRef = useRef<Mesh | null>(null);
  const earthRef = useRef<Mesh | null>(null);
  const moonGroup = useRef<Group | null>(null);

  const pointLightRef = useRef<PointLight | null>(null);
  // ------------------------------------------------------
  // ------------------------------------------------------
  const zoom = 4;
  const pall = pick(palettes);
  setSeed("moonsceen", {});
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
    // gl.setClearColor(bg_base, 1);
    gl.setClearColor("#000", 1);

    //
    camera.lookAt(new Vector3());

    // ---------------------------------------------------

    if (moonBasMatRef.current && earthBasMatRef.current) {
      const textureLoder = new TextureLoader();
      moonBasMatRef.current.map = textureLoder.load("/moon.jpg");
      earthBasMatRef.current.map = textureLoder.load("/earth.jpg");
    }

    if (moonRef.current) {
      moonRef.current.position.set(1.5, 0.5, 0);
      moonRef.current.scale.setScalar(0.28);
    }
    // ---------------------------------------------------
    if (pointLightRef.current) {
      pointLightRef.current.position.set(3, 3, 3);

      const pointLightHelper = new PointLightHelper(pointLightRef.current);

      scene.add(pointLightHelper);
    }

    // ---------------------------------------------------
  }, [
    moonBasMatRef,
    moonRef,
    earthRef,
    earthBasMatRef,
    moonGroup,
    pointLightRef,
  ]);

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

      if (earthRef.current) {
        earthRef.current.rotation.y += delta * 0.18;
      }
      if (moonRef.current) {
        moonRef.current.rotation.y += delta * 0.14;
      }
      if (moonGroup.current) {
        moonGroup.current.rotation.y = time * 0.09;
      }
    }
  );

  return (
    <>
      {/* <axesHelper /> */}
      <pointLight
        // @ts-expect-error ref
        ref={pointLightRef}
        color={"white"}
        intensity={6}
      />
      <mesh
        // @ts-expect-error ref
        ref={earthRef}
      >
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial
          // @ts-expect-error ref
          ref={earthBasMatRef}
          metalness={0}
          roughness={1}
        />
      </mesh>
      <group
        // @ts-expect-error ref
        ref={moonGroup}
      >
        <mesh
          // @ts-expect-error ref
          ref={moonRef}
        >
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial
            // @ts-expect-error ref
            ref={moonBasMatRef}
            metalness={0}
            roughness={1}
          />
        </mesh>
      </group>
    </>
  );
}
