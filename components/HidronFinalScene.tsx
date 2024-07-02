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
  Color,
  IcosahedronGeometry,
  Float32BufferAttribute,
  SphereGeometry,
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

import vertexShader from "@/shaders/hidron_final/hidron.vert";
import fragmentShader from "@/shaders/hidron_final/hidron.frag";

// -------------------------------------------------------------
// -------------------------------------------------------------

export default function HidronFinalScene() {
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
  const materialRef = useRef<ShaderMaterial | null>(null);
  const icosGeoRef = useRef<IcosahedronGeometry | null>(null);
  // --------------------------------------------------------
  // --------------------------------------------------------

  setSeed("shaderfinal", {});

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
    // gl.setClearColor(bg_base, 1);
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
    // taking vertices from icosahedron geometry
    if (icosGeoRef.current) {
      // like this
      // const vertices = icosGeoRef.current.attributes.position;
      // or like this
      // @ts-expect-error buffer attribute
      const buffAttr: Float32BufferAttribute =
        icosGeoRef.current.getAttribute("position");

      const vertices = buffAttr.array;

      //
      const sphereGeo = new SphereGeometry(0.1, 16, 32);
      const basicMater = new MeshBasicMaterial({
        color: "crimson",
        // wireframe: true,
      });

      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        //

        const mesh = new Mesh(sphereGeo, basicMater);

        mesh.position.set(x, y, z);

        scene.add(mesh);
      }
    }

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
      if (materialRef.current) {
        // console.log({ time });
        materialRef.current.uniforms.aspect.value = aspect;
        materialRef.current.uniforms.time.value = time;

        materialRef.current.uniforms.stretch.value = time * 0.2;
      }
    }
  );

  return (
    <>
      {/* <axesHelper /> */}
      <pointLight color={"white"} intensity={4} position={[-5, 5, 5]} />
      <mesh>
        <icosahedronGeometry
          // @ts-expect-error ref
          ref={icosGeoRef}
          args={[1, 0]}
        />
        {/* <boxGeometry args={[1, 1, 1]} /> */}
        <shaderMaterial
          // @ts-expect-error ref
          ref={materialRef}
          // args={[{}]}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          // wireframe
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
            color: {
              value: new Color("#fff"),
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
