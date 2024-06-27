"use client";

import { useEffect, useRef, useState } from "react";
// import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
// import { useEffect } from "react";
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
import { shaderMaterial, useAnimations } from "@react-three/drei";

import { usePlayheadBackForth } from "@/hooks/usePlayheadBackForth";

import { bg_base } from "@/consts/styles";

import { usePlayhead } from "@/hooks/usePlayhead";

// import fragmentShader from "@/shaders/first/first.frag";
// import vertexShader from "@/shaders/first/first.vert";
//
import fragmentShader from "@/shaders/lesson_1/less1.frag";
import vertexShader from "@/shaders/default.vert";

export default function ShaderScene() {
  // ------------------------------------------------------
  // ------------------------------------------------------
  const zoom = 1;
  // ------------------------------------------------------
  // ------------------------------------------------------

  const {
    gl,
    camera: cam,
    scene: sc,

    viewport: { aspect },
  } = useThree();

  // ------ CAMMERA, SCENE, LIGHTS, CONTROL
  const scene = sc as unknown as Scene;
  const camera = cam as unknown as PerspectiveCamera; /* OrthographicCamera */

  const shaderRef = useRef<ShaderMaterial | null>(null);

  setSeed("postaorio", {});

  // console.log({ aspect });

  // console.log({ clock });

  // const { elapsedTime } = clock;

  // const { offset } = useScroll();
  // -----------------------------------------------------------

  const [lookAtVector, setLookatVector] = useState<Vector3 | null>(null);

  const { playheadRef, computePlayheadInFrame } = usePlayhead(20, 2, true);

  const pall = pick(palettes);

  useEffect(() => {
    gl.setClearColor(bg_base, 1);
    // gl.setClearColor(pick(pick(palettes)), 1);

    const mainVec = new Vector3();
    setLookatVector(mainVec);
    camera.lookAt(mainVec);

    const directLight = new DirectionalLight("white", 2);
    const ambientLight = new AmbientLight("#351430", 1);
    const pointLight = new PointLight("#8c86d6", 2.6, 73.18);
    // ---------------------------------------------------
    // ---------------------------------------------------

    // ------ GEOMETRIES
    // const sphereGeo = new SphereGeometry(1, 32, 16);
    const boxGeo = new BoxGeometry(1, 1, 1);
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
    // ---------------------------------------------------
    // ---------------------------------------------------

    const standMat = new MeshStandardMaterial({
      color: pick(pall),
    });

    const shaderMat = new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      fragmentShader,
      vertexShader,
    });

    shaderRef.current = shaderMat;

    const boxMesh = new Mesh(boxGeo, shaderMat /*  phisMat */ /* standMat */);

    scene.add(boxMesh);

    directLight.position.set(6, 4, 9);

    scene.add(directLight);
    scene.add(ambientLight);
    scene.add(pointLight);

    //
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
    if (lookAtVector) {
      camera.lookAt(lookAtVector);
    }

    camera.updateProjectionMatrix();
    //
    // console.log("updated");
  }

  // ------------------------------------------------------------
  // ANIMATION FRAME
  useFrame(({ scene: sc, clock: { elapsedTime: time } }, delta) => {
    //
    //
    //
    //
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = time;
    }
  });

  return null;
}
