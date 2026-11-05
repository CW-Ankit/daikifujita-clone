"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getSoundEngine } from "@/lib/soundEngine";

interface ShardOfMemoryProps {
  className?: string;
  onHover?: () => void;
}

export default function ShardOfMemory({ className = "", onHover }: ShardOfMemoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(4, 5, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x90c0ff, 1.8);
    dirLight2.position.set(-4, -3, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2.0, 10);
    pointLight.position.set(0, 0, 2.5);
    scene.add(pointLight);

    // Load Textures
    const texLoader = new THREE.TextureLoader();
    const normalMap = texLoader.load("/textures/topb_ice_n.webp");
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    const roughnessMap = texLoader.load("/textures/topb_ice_m.webp");
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;

    // Custom Physical Ice Material
    const iceMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf6faff),
      metalness: 0.05,
      roughness: 0.12,
      transmission: 0.92,
      ior: 1.48,
      thickness: 1.5,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: roughnessMap,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.98,
    });

    let shardMesh: THREE.Object3D | null = null;
    const loader = new GLTFLoader();

    loader.load(
      "/models/tb_block.glb",
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = iceMaterial;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        model.scale.set(1.4, 1.4, 1.4);
        scene.add(model);
        shardMesh = model;
        setLoaded(true);
      },
      undefined,
      (err) => {
        console.warn("GLB load fallback, using procedural crystal:", err);
        // Fallback procedural crystal geometry
        const geom = new THREE.OctahedronGeometry(1.2, 2);
        const mesh = new THREE.Mesh(geom, iceMaterial);
        scene.add(mesh);
        shardMesh = mesh;
        setLoaded(true);
      }
    );

    // Mouse & Inertia Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotX = y * 0.8;
      targetRotY = x * 1.2;
    };

    const handleMouseEnter = () => {
      isHovered = true;
      getSoundEngine().playShimmer(659.25); // E5 shimmer
      if (onHover) onHover();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia lerp
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      if (shardMesh) {
        shardMesh.rotation.x = currentRotX + Math.sin(elapsedTime * 0.8) * 0.08;
        shardMesh.rotation.y = currentRotY + elapsedTime * 0.35;
        shardMesh.rotation.z = Math.cos(elapsedTime * 0.6) * 0.05;

        // Subtle hover levitation
        shardMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onHover]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity duration-1000 ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
