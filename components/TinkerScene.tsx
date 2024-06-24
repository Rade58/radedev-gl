"use client";

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
} from "three";

import { bg_base } from "@/consts/styles";
import { useEffect, useState } from "react";

// @ts-expect-error import
import { math } from "canvas-sketch-util";

export default function TinkerScene() {
  // ------------------------------------------------------
  // ------------------------------------------------------
  const zoom = 1.6;
  // ------------------------------------------------------
  // ------------------------------------------------------

  console.log(math.lerp);

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

  console.log({ aspect });

  // console.log({ clock });

  // const { elapsedTime } = clock;

  // const { offset } = useScroll();
  // -----------------------------------------------------------

  const [bMeshes, setBMeshes] = useState<Mesh[]>([]);
  const [lookAtVector, setLookatVector] = useState<Vector3 | null>(null);

  useEffect(() => {
    gl.setClearColor(bg_base, 1);

    const mainVec = new Vector3();
    setLookatVector(mainVec);
    camera.lookAt(mainVec);

    // camera.rotation.z = 6.28;

    const ambientLight = new AmbientLight("#d4a9b6");
    const pointLight = new PointLight("#8c86d6", 9.6, 13.18);
    scene.add(ambientLight);
    scene.add(pointLight);
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
    // ---------------------------------------------------

    // ------ MESHES
    // const sphereMesh = new Mesh(sphereGeo, basicMat);

    Array(20)
      .fill(1)
      .forEach((item, i) => {
        const boxMesh = new Mesh(boxGeo, phisMat);
        setBMeshes((prev) => [...prev, boxMesh]);
        // ---------------------------------------------------

        boxMesh.rotation.x = 2.2;
        boxMesh.rotation.y = 2;
        boxMesh.rotation.z = 1;

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
    pointLight.position.set(4, 3, -3).multiplyScalar(0.2);
  }, []);

  // handle resize for ortographic camera
  // useEffect(() => {
  if (camera) {
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

    // console.log("updated");
  }
  // }, [aspect, lookAtVector, camera]);

  // ------------------------------------------------------------
  // ANIMATION FRAME
  useFrame((state, delta) => {
    // console.log({ state });

    bMeshes.forEach((bMesh, i) => {
      bMesh.rotation.z = state.clock.elapsedTime * ((Math.PI * 10) / 180) - i;
      // bMesh.rotation.y =
      // -state.clock.elapsedTime * 0.1 * ((Math.PI * 10) / 180);
    });
  });
  // ------------------------------------------------------------
  // ------------------------------------------------------------

  return null;
}
