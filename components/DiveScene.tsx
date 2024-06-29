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
 * @description More "deeper" dive into webgl
 */
export default function DiveScene() {
  const directLightRef = useRef<DirectionalLight | null>(null);
  const pointLightRef = useRef<PointLight | null>(null);
  const boxMeshRef = useRef<Mesh | null>(null);
  const boxMeshRef2 = useRef<Mesh | null>(null);
  //
  const someVectorRef = useRef<Vector3 | null>(null);
  //
  const colorRef = useRef<Color | null>(null);
  //
  const meSeMatRef = useRef<MeshStandardMaterial | null>();

  //
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
  const camera = cam as unknown as /* PerspectiveCamera; */ OrthographicCamera;
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
    // gl.setClearColor(pick(pick(palettes)), 1);

    // const mainVec = new Vector3();
    // setLookatVector(mainVec);
    // camera.lookAt(mainVec);

    // ------ GEOMETRIES
    // const sphereGeo = new SphereGeometry(1, 32, 16);
    // const boxGeo = new BoxGeometry(1, 1, 1);
    // const boxGeo2 = new BoxGeometry(2, 2, 1);
    // ---------------------------------------------------

    // ------ MATERIALS
    /* const basicMat = new MeshBasicMaterial({
      color: "crimson",
      wireframe: true,
    }); */
    /* const phisMat = new MeshPhysicalMaterial({
      // color: "blanchedalmond",
      color: "#c571a5",
      roughness: 0.78,
      flatShading: true,
    }); */
    /* const basMat = new MeshBasicMaterial({
      color: "#c571a5",

    }); */

    /* const standMat = new MeshStandardMaterial({
      color: pick(pall),
    }); */

    if (!colorRef.current) {
      colorRef.current = new Color("crimson");

      colorRef.current.r = 1;
      colorRef.current.g = 0.1;
      colorRef.current.b = 0.4;
    }

    if (meSeMatRef.current) {
      meSeMatRef.current.color = colorRef.current;
    }

    if (meSeMatRef.current && meSeMatRef.current) {
      meSeMatRef.current.color = colorRef.current;
    }

    // ---------------------------------------------------
    // ---------------------------------------------------
    //  MESHES

    if (directLightRef.current) {
      directLightRef.current.position.set(4, 8, 10);

      const directLightHelper = new DirectionalLightHelper(
        directLightRef.current
      );

      scene.add(directLightHelper);
    }

    if (pointLightRef.current) {
      const pointLightHelper = new PointLightHelper(pointLightRef.current);
      scene.add(pointLightHelper);
    }

    if (boxMeshRef.current) {
      camera.lookAt(boxMeshRef.current.position);
    }

    // playing around with vectors
    const someVector = new Vector3(0, 0, 2);

    if (!someVectorRef.current) {
      someVectorRef.current = someVector;
    }

    if (someVectorRef.current && boxMeshRef2.current) {
      boxMeshRef2.current.position.copy(someVectorRef.current);

      someVector.x = 2;
      boxMeshRef2.current.position.copy(someVectorRef.current);

      someVector.setScalar(0);
      boxMeshRef2.current.position.copy(someVectorRef.current);

      someVector.set(2, 0, 2);
      boxMeshRef2.current.position.copy(someVectorRef.current);

      /* const cords = [0, 0, 0];
      someVector.fromArray(cords);

      boxMeshRef2.current.position.copy(someVectorRef.current); */
    }

    camera.lookAt(someVector);

    // HELPERS ------------------------------------------
    // --------------------------------------------------
    // const directLightHelper = new DirectionalLightHelper(directLight);
    /* if (pointLightRef.current) {
      const pointLightHelper = new PointLightHelper(
        pointLightRef.current,
        3,
        "green"
      );
      scene.add(pointLightHelper);
    }
    */
    // --------------------------------------------------
    // --------------------------------------------------

    // camera.lookAt(boxMesh.position);

    //
    // pointLight.position.set(14, 31, -31).multiplyScalar(3);
  }, [
    boxMeshRef,
    boxMeshRef2,
    pointLightRef,
    directLightRef,
    someVectorRef,
    colorRef,
    meSeMatRef,
  ]);

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
    // if (lookAtVector) {
    // camera.lookAt(lookAtVector);
    // }

    // if (boxMeshRef.current) {
    // camera.lookAt(boxMeshRef.current.position);
    // }

    camera.updateProjectionMatrix();
    //
    // console.log("updated");
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
      //
      //
      //

      const camera = cm as unknown as OrthographicCamera;

      if (boxMeshRef.current) {
        boxMeshRef.current.position.x = Math.sin(time * 0.2 * Math.PI * 2);
        // camera.lookAt(boxMeshRef.current.position);
      }

      // if (someVectorRef.current) {
      // someVectorRef.current.z = 4 * Math.sin(Math.PI * 2 * time * 0.4);
      // camera.lookAt(someVectorRef.current);
      // }

      // camera.position.z = Math.sin(Math.PI * 2 * time * 0.2);
      // camera.position.y = Math.sin(Math.PI * 2 * time * 0.2);
    }
  );

  return (
    <>
      <axesHelper />
      <directionalLight
        color={"white"}
        intensity={2}
        // @ts-expect-error ref
        ref={directLightRef}
      />
      {
        <pointLight
          color={"hotpink"}
          intensity={4}
          distance={100}
          position={[1, 4, 1]}
          // @ts-expect-error ref
          ref={pointLightRef}
        />
      }

      <mesh
        // @ts-expect-error ref
        ref={boxMeshRef}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={pick(pall)} />
      </mesh>
      <mesh
        // @ts-expect-error ref
        ref={boxMeshRef2}
      >
        <icosahedronGeometry args={[1, 0]} />
        {/* <meshStandardMaterial
          // @ts-expect-error ref
          ref={meSeMatRef}
          // color={pick(pall)}
        /> */}
        <meshPhysicalMaterial color={pick(pall)} roughness={0.78} flatShading />
      </mesh>
    </>
  );
}
