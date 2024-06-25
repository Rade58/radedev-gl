"use client";

import { useEffect, useState } from "react";
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
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  DirectionalLight,
  MeshStandardMaterial,
  AnimationMixer,
} from "three";

//
import palettes from "nice-color-palettes";

import { bg_base } from "@/consts/styles";

import {
  value as randVal,
  setSeed,
  range,
  pick,
} from "canvas-sketch-util/random";
import { useAnimations } from "@react-three/drei";

import { usePlayhead } from "@/hooks/usePlayhead";

export default function TinkerScene() {
  // ------------------------------------------------------
  // ------------------------------------------------------
  const zoom = 8;
  const duration = 10;
  // ------------------------------------------------------
  // ------------------------------------------------------

  const {
    gl,
    camera: cam,
    scene: sc,

    clock,
    viewport: { aspect },
  } = useThree();

  // ------ CAMMERA, SCENE, LIGHTS, CONTROL
  const scene = sc as unknown as Scene;
  const camera = cam as unknown as /* PerspectiveCamera | */ OrthographicCamera;

  setSeed("purkolar", {});

  const [rotationSpeed, setRotationSpeed] = useState(0.02);
  const [rotationY, setRotationY] = useState(0);

  // console.log({ aspect });

  // console.log({ clock });

  // const { elapsedTime } = clock;

  // const { offset } = useScroll();
  // -----------------------------------------------------------

  const [bMeshes, setBMeshes] = useState<Mesh[]>([]);
  const [lookAtVector, setLookatVector] = useState<Vector3 | null>(null);

  const { playheadRef, computePlayheadInFrame } = usePlayhead(20, true);

  const pall = pick(palettes);

  useEffect(() => {
    gl.setClearColor(bg_base, 1);
    // gl.setClearColor(pick(pick(palettes)), 1);

    const mainVec = new Vector3();
    setLookatVector(mainVec);
    camera.lookAt(mainVec);

    // camera.rotation.z = 6.28;

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
    const phisMat = new MeshPhysicalMaterial({
      // color: "blanchedalmond",
      color: "#c571a5",
      // color: "hsl(46, 70%, 12%)",
      roughness: 0.78,
      flatShading: true,
    });
    const basMat = new MeshBasicMaterial({
      // color: "blanchedalmond",
      color: "#c571a5",
      // color: "hsl(46, 70%, 12%)",
    });
    // ---------------------------------------------------

    // ------ MESHES
    // const sphereMesh = new Mesh(sphereGeo, basicMat);

    Array(39)
      .fill(1)
      .forEach((_, __) => {
        /*  const basMat = new MeshBasicMaterial({
          color: pick(pall),
        }); */

        const standMat = new MeshStandardMaterial({
          color: pick(pall),
        });

        const boxMesh = new Mesh(boxGeo, /*  phisMat */ standMat);
        setBMeshes((prev) => [...prev, boxMesh]);
        // ---------------------------------------------------

        /* boxMesh.rotation.x = 2.2;
        boxMesh.rotation.y = 2;
        boxMesh.rotation.z = 1; */

        boxMesh.position.set(range(-1, 1), range(-1, 1), range(-1, 1));
        boxMesh.scale.set(range(-1, 1), range(-1, 1), range(-1, 1));

        boxMesh.position.multiplyScalar(7);
        boxMesh.scale.multiplyScalar(2);

        scene.add(boxMesh);
      });

    //

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // ---------------------------------------------------------

    // scene.add(sphereMesh);
    // ---------------------------------------------------
    // ---------------------------------------------------
    // ---------------------------------------------------

    //
    directLight.position.set(6, 4, 9);

    scene.add(directLight);
    scene.add(ambientLight);
    scene.add(pointLight);

    //
    // pointLight.position.set(14, 31, -31).multiplyScalar(3);
  }, []);

  // handle resize for ortographic camera
  // useEffect(() => {
  if (camera) {
    // console.log({ camera });

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
  // }, [aspect, lookAtVector, camera]);

  // ------------------------------------------------------------
  // ANIMATION FRAME
  useFrame((state, delta) => {
    computePlayheadInFrame(delta, state.clock.elapsedTime);

    // Apply rotation to the mesh

    // state.scene.rotation.y = playheadRef.current * Math.PI;
    state.scene.position.y = playheadRef.current;
    // state.scene.rotation.y = delta * 100;

    bMeshes.forEach((bMesh, i) => {
      bMesh.rotation.z = state.clock.elapsedTime * ((Math.PI * 10) / 180);
    });
  });
  // ------------------------------------------------------------
  // ------------------------------------------------------------

  return null;
}
