"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getSoundEngine } from "@/lib/soundEngine";
import Image from "next/image";

interface DreamShiftProps {
  onExit: () => void;
}

interface MemoryNode {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  link: string;
  collected: boolean;
  position: THREE.Vector3;
  mesh?: THREE.Mesh;
}

export default function DreamShift({ onExit }: DreamShiftProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shardsCount, setShardsCount] = useState(0);
  const [activeShard, setActiveShard] = useState<MemoryNode | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const [hudMessage, setHudMessage] = useState("PILOT: MOUSE / WASD / DRAG TO COLLECT MEMORY SHARDS");
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const engine = getSoundEngine();
    setSoundOn(!engine.getMuted());
  }, []);

  const handleSoundToggle = () => {
    const engine = getSoundEngine();
    const isNowOn = engine.toggleMute();
    setSoundOn(isNowOn);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene, Fog & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06050e);
    scene.fog = new THREE.FogExp2(0x06050e, 0.022);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 600);
    camera.position.set(0, 0, 18);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Cosmic Lighting
    const ambient = new THREE.AmbientLight(0x433d59, 2.2);
    scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xb4a4ff, 2.8);
    dirLight1.position.set(25, 45, 25);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 1.8);
    dirLight2.position.set(-25, -20, -10);
    scene.add(dirLight2);

    const centerLight = new THREE.PointLight(0x8bc2ff, 3.5, 60);
    centerLight.position.set(0, 4, 0);
    scene.add(centerLight);

    // Particle Star Field
    const particleCount = 2400;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 180;
      positions[i + 1] = (Math.random() - 0.5) * 140;
      positions[i + 2] = (Math.random() - 0.5) * 180;

      // Celestial color gradients
      colors[i] = 0.65 + Math.random() * 0.35;
      colors[i + 1] = 0.75 + Math.random() * 0.25;
      colors[i + 2] = 1.0;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Load Center Models
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "/models/dream_model.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -2.5, -16);
        model.scale.set(3.6, 3.6, 3.6);
        scene.add(model);
      },
      undefined,
      (e) => console.warn("Dream model fallback:", e)
    );

    gltfLoader.load(
      "/models/figure.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.5, -2.5);
        model.scale.set(1.6, 1.6, 1.6);
        scene.add(model);
      },
      undefined,
      (e) => console.warn("Figure model fallback:", e)
    );

    // Interactive Shards
    const nodesData: MemoryNode[] = [
      {
        id: "p2",
        title: "Portfolio v2",
        category: "Portfolio / 2026",
        year: "2026",
        image: "/images/1bkjcB7uulAIeieaHzJp5p1WdYU.jpg",
        link: "https://daikifujita.com",
        collected: false,
        position: new THREE.Vector3(-11, 3.5, -12),
      },
      {
        id: "inc",
        title: "INCEPTURE",
        category: "Gallery Site / 2025",
        year: "2025",
        image: "/images/UwSYwpPkghWNn8uZekuo1xu6Vc.png",
        link: "https://incepture.da-san333.com",
        collected: false,
        position: new THREE.Vector3(12.5, -2.5, -17),
      },
      {
        id: "p1",
        title: "Portfolio v1",
        category: "Portfolio / 2025",
        year: "2025",
        image: "/images/6bqqivg1une0B2aPLSjxvyhqXs.png",
        link: "https://da-san333.com",
        collected: false,
        position: new THREE.Vector3(0, 8.5, -24),
      },
    ];

    const shardMeshes: THREE.Mesh[] = [];
    nodesData.forEach((node) => {
      const geom = new THREE.OctahedronGeometry(1.2, 1);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x90d5ff,
        emissive: 0x1f3c7a,
        roughness: 0.1,
        metalness: 0.15,
        transmission: 0.88,
        ior: 1.48,
        transparent: true,
        opacity: 0.92,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(node.position);
      scene.add(mesh);
      node.mesh = mesh;
      shardMeshes.push(mesh);
    });

    // Flight and Camera Controls
    const keys = { w: false, a: false, s: false, d: false, up: false, down: false };
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraRotY = 0;
    let targetCameraRotX = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.w = true;
      if (k === "s" || k === "arrowdown") keys.s = true;
      if (k === "a" || k === "arrowleft") keys.a = true;
      if (k === "d" || k === "arrowright") keys.d = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.w = false;
      if (k === "s" || k === "arrowdown") keys.s = false;
      if (k === "a" || k === "arrowleft") keys.a = false;
      if (k === "d" || k === "arrowright") keys.d = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraRotY = -mouseX * 0.45;
      targetCameraRotX = mouseY * 0.35;

      if (isDragging) {
        const dx = e.clientX - prevPointerX;
        const dy = e.clientY - prevPointerY;
        camera.position.x -= dx * 0.03;
        camera.position.y += dy * 0.03;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // Raycast interaction
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(shardMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const matched = nodesData.find((n) => n.mesh === hit);
        if (matched) {
          getSoundEngine().playShimmer(880);
          if (!matched.collected) {
            matched.collected = true;
            setShardsCount((prev) => prev + 1);
            setHudMessage(`MEMORY RESTORED: ${matched.title.toUpperCase()}`);
          }
          setActiveShard(matched);
        }
      }
    };

    window.addEventListener("click", onClick);

    // Main Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Keyboard Speed
      const speed = 14 * delta;
      if (keys.w) camera.position.z -= speed;
      if (keys.s) camera.position.z += speed;
      if (keys.a) camera.position.x -= speed;
      if (keys.d) camera.position.x += speed;

      // Camera rotation dampening
      camera.rotation.y += (targetCameraRotY - camera.rotation.y) * 0.06;
      camera.rotation.x += (targetCameraRotX - camera.rotation.x) * 0.06;

      // Orbit particles slowly
      particles.rotation.y = elapsed * 0.025;

      // Animate Shards
      nodesData.forEach((node, idx) => {
        if (node.mesh) {
          node.mesh.rotation.y = elapsed * 0.8 + idx;
          node.mesh.rotation.x = Math.sin(elapsed + idx) * 0.4;
          node.mesh.position.y = node.position.y + Math.sin(elapsed * 1.5 + idx) * 0.5;

          // Proximity collision detection
          const dist = camera.position.distanceTo(node.mesh.position);
          if (dist < 4.5 && !node.collected) {
            node.collected = true;
            setShardsCount((prev) => prev + 1);
            getSoundEngine().playShimmer(987.77); // B5 high chime
            setHudMessage(`PROXIMITY SYNC: ${node.title.toUpperCase()} RETRIEVED`);
            setActiveShard(node);
          }
        }
      });

      // Update HUD Coordinates
      setCoords({
        x: Math.round(camera.position.x * 10) / 10,
        y: Math.round(camera.position.y * 10) / 10,
        z: Math.round(camera.position.z * 10) / 10,
      });

      renderer.render(scene, camera);
    };
    render();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-[#06050e] overflow-hidden select-none animate-in fade-in duration-700">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Atmospheric Vignette & Grain */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,2,8,0.85)_100%)]" />

      {/* Dream HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 text-white font-mono text-xs">
        {/* Top Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
            <span className="tracking-widest uppercase text-indigo-200">
              [ 夢モード // THREE.JS DREAM ENGINE ]
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
            {/* Audio Toggle in Dream HUD */}
            <button
              onClick={handleSoundToggle}
              className="border border-white/20 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-indigo-200 hover:text-white transition-colors cursor-pointer"
            >
              {soundOn ? "SOUND: ON" : "SOUND: OFF"}
            </button>

            <div className="border border-white/20 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-indigo-300">
              SHARDS RETRIEVED: {shardsCount} / 3
            </div>

            <button
              onClick={() => {
                getSoundEngine().playTransition(false);
                onExit();
              }}
              className="px-4 py-1.5 rounded-full bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg"
            >
              Wake Up [ESC] ↗
            </button>
          </div>
        </div>

        {/* Shard Card Lightbox Modal */}
        {activeShard && (
          <div className="pointer-events-auto self-center max-w-md w-full bg-neutral-900/95 border border-white/20 backdrop-blur-2xl p-6 rounded-md shadow-2xl text-white flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] tracking-widest text-indigo-300 uppercase">
                MEMORY SHARD RETRIEVED
              </span>
              <button
                onClick={() => setActiveShard(null)}
                className="text-neutral-400 hover:text-white font-mono cursor-pointer"
              >
                ✕ [CLOSE]
              </button>
            </div>

            <div className="relative aspect-16/10 rounded overflow-hidden">
              <Image
                src={activeShard.image}
                alt={activeShard.title}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h4 className="text-xl font-sans font-medium text-white">{activeShard.title}</h4>
              <p className="text-xs text-neutral-400 mt-1">{activeShard.category}</p>
            </div>

            <a
              href={activeShard.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center bg-white text-black font-semibold text-xs tracking-wider uppercase rounded hover:bg-neutral-200 transition-colors"
            >
              Open Project Archive ↗
            </a>
          </div>
        )}

        {/* Bottom Status & Coordinates */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1 text-[11px] text-neutral-400">
            <span className="text-white font-semibold">{hudMessage}</span>
            <span>COORDINATES: X:{coords.x} Y:{coords.y} Z:{coords.z}</span>
          </div>

          {/* Mobile Touch Flight Pad */}
          <div className="sm:hidden flex items-center gap-2 pointer-events-auto my-2">
            <button
              onPointerDown={() => {
                const e = new KeyboardEvent("keydown", { key: "w" });
                window.dispatchEvent(e);
              }}
              onPointerUp={() => {
                const e = new KeyboardEvent("keyup", { key: "w" });
                window.dispatchEvent(e);
              }}
              className="px-3 py-1.5 bg-white/10 active:bg-white/30 border border-white/20 rounded text-[11px] font-mono select-none"
            >
              ▲ FWD
            </button>
            <button
              onPointerDown={() => {
                const e = new KeyboardEvent("keydown", { key: "s" });
                window.dispatchEvent(e);
              }}
              onPointerUp={() => {
                const e = new KeyboardEvent("keyup", { key: "s" });
                window.dispatchEvent(e);
              }}
              className="px-3 py-1.5 bg-white/10 active:bg-white/30 border border-white/20 rounded text-[11px] font-mono select-none"
            >
              ▼ BACK
            </button>
          </div>

          <div className="text-[10px] tracking-widest text-neutral-500 uppercase">
            [ Three.js WebGL Engine · Daiki Fujita ]
          </div>
        </div>
      </div>
    </div>
  );
}
