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
  RepeatWrapping,
  Vector2,
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
 * @description
 */
export default function BrickScene() {
  // ------------------------------------------------------
  // ------------------------------------------------------
  const meshRef = useRef<Mesh | null>(null);
  const stanMatRef = useRef<MeshStandardMaterial | null>(null);
  const pointLightRef = useRef<PointLight | null>(null);
  const groupRef = useRef<Group | null>(null);
  // ------------------------------------------------------
  // ------------------------------------------------------
  const zoom = 4;
  const pall = pick(palettes);
  setSeed("bricksceene", {});
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

  //  SET UP SCENE
  useEffect(() => {
    // gl.setClearColor(bg_base, 1);
    gl.setClearColor("#000", 1);

    //
    camera.lookAt(new Vector3());
    //

    if (stanMatRef.current) {
      const textureLoader = new TextureLoader();
      const texture = textureLoader.load("/brick-diffuse.jpg");

      stanMatRef.current.map = texture;
      texture.wrapS = texture.wrapT = RepeatWrapping;

      texture.repeat.set(3, 2).multiplyScalar(1.2);

      const normalTexture = textureLoader.load("/brick-normal.jpg");
      stanMatRef.current.normalMap = normalTexture;

      normalTexture.wrapS = normalTexture.wrapT = RepeatWrapping;

      normalTexture.repeat.copy(texture.repeat);

      // stanMatRef.current.normalScale = new Vector2(1, -4);
    }

    if (pointLightRef.current) {
      pointLightRef.current.position.set(0, 2, -4);
      const plhelp = new PointLightHelper(pointLightRef.current);

      scene.add(plhelp);
    }

    if (meshRef.current) {
      meshRef.current.rotation.z = 2;
      meshRef.current.scale.setScalar(1.1);
    }

    // ---------------------------------------------------

    // ---------------------------------------------------
  }, [stanMatRef, pointLightRef, meshRef]);

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
      /*  if (pointLightRef.current) {
        pointLightRef.current.position.z =
          Math.sin(time * 0.04 * Math.PI * 2) * 6;
      } */

      if (groupRef.current) {
        groupRef.current.rotation.y = time * 0.7;
      }
    }
  );

  return (
    <>
      {/* <axesHelper /> */}
      <group
        // @ts-expect-error ref
        ref={groupRef}
      >
        <pointLight
          // @ts-expect-error ref
          ref={pointLightRef}
          color="white"
          intensity={4}
        />
      </group>
      <mesh
        // @ts-expect-error ref
        ref={meshRef}
      >
        <torusGeometry args={[0.8, 0.4, 34, 64]} />
        <meshStandardMaterial
          // @ts-expect-error ref
          ref={stanMatRef}
          flatShading
          roughness={0.75}
          metalness={0.4}
        />
      </mesh>
    </>
  );
}
