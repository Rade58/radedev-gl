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
  BufferGeometry,
  BufferAttribute,
  DoubleSide,
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
export default function CustomGeometryScene() {
  // ------------------------------------------------------
  // ------------------------------------------------------
  const meshRef = useRef<Mesh | null>(null);

  // ------------------------------------------------------
  // ------------------------------------------------------
  const zoom = 4;
  const pall = pick(palettes);

  const gridScale = 10;

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
    gl.setClearColor("#fff", 1);

    //
    camera.lookAt(new Vector3());
    //

    // --------------------------------------------------
    // --------------------------------------------------

    if (meshRef.current) {
      const buffGeo = new BufferGeometry();
      const vertices = new Float32Array([
        //  vert one
        0.5, 0.0, 0.0,
        //  vert two
        0.0, 0.5, 0.0,
        //  vert thre
        0.0, 0.0, 0.0,
        //  vert four
        0.0, 0.0, 0.9,
      ]);

      // not going to use it
      const indices = new Uint16Array([
        // indice one
        0, 1, 2,
        // indice two
        3, 1, 2,
      ]);

      buffGeo.setAttribute("position", new BufferAttribute(vertices, 3));

      buffGeo.setIndex(new BufferAttribute(indices, 1));

      // for normal material to get other colors than black
      buffGeo.computeVertexNormals();

      meshRef.current.geometry = buffGeo;
    }

    // ---------------------------------------------------

    // ---------------------------------------------------
  }, [meshRef]);

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
    ) => {}
  );

  return (
    <>
      <axesHelper />
      {/* <gridHelper args={[gridScale, 6, "hsl(0, 0%, 50%)", "hsl(0, 0%, 70%)"]} /> */}
      <mesh
        // @ts-expect-error ref
        ref={meshRef}
      >
        {/* <meshBasicMaterial color="crimson" side={DoubleSide} /> */}
        <meshNormalMaterial
          // color="crimson"
          side={DoubleSide}
        />
      </mesh>
    </>
  );
}
