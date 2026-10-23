'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Occasion } from './catalogue';

interface GiftUniverseProps {
  occasion: Occasion | 'All';
  onOccasionChange: (occasion: Occasion) => void;
}

const sceneOccasions: Occasion[] = ['Birthday', 'Love', 'Friendship', 'Thank you', 'Just because'];

function roundedBoxGeometry(width: number, height: number, depth: number) {
  return new THREE.BoxGeometry(width, height, depth, 5, 5, 5);
}

export function GiftUniverse({ occasion, onOccasionChange }: GiftUniverseProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onOccasionChange);
  const occasionRef = useRef(occasion);
  const [webglReady, setWebglReady] = useState(false);
  callbackRef.current = onOccasionChange;
  occasionRef.current = occasion;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 8.8);

    let renderer: THREE.WebGLRenderer;
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2', { alpha: true, antialias: true })
        ?? canvas.getContext('webgl', { alpha: true, antialias: true });
      if (!context) {
        setWebglReady(false);
        return;
      }
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: context as WebGLRenderingContext,
        antialias: true,
        alpha: true,
      });
    } catch {
      setWebglReady(false);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    setWebglReady(true);

    scene.add(new THREE.HemisphereLight(0xfff4e5, 0x6f1a2b, 3.1));
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    key.position.set(3, 5, 6);
    scene.add(key);
    const glow = new THREE.PointLight(0xff743d, 24, 12);
    glow.position.set(-3, -1, 4);
    scene.add(glow);

    const world = new THREE.Group();
    scene.add(world);

    const palette = [0xe23b2e, 0xe8b64a, 0x8e2438, 0xd9552e, 0xf2b38c];
    const gifts: THREE.Group[] = [];

    sceneOccasions.forEach((label, index) => {
      const angle = (index / sceneOccasions.length) * Math.PI * 2 - Math.PI / 2;
      const radius = index === 0 ? 0 : 2.55;
      const gift = new THREE.Group();
      gift.userData = { label, index, baseY: Math.sin(index * 1.7) * 0.35 };
      gift.position.set(Math.cos(angle) * radius, gift.userData.baseY, Math.sin(angle) * 0.65);
      gift.rotation.set(-0.08, -angle * 0.35, 0.04 * (index - 2));

      const scale = index === 0 ? 1.05 : 0.62 + (index % 2) * 0.08;
      const boxMaterial = new THREE.MeshStandardMaterial({ color: palette[index], roughness: 0.48, metalness: 0.03 });
      const ribbonMaterial = new THREE.MeshStandardMaterial({ color: index === 1 ? 0x8e2438 : 0xfff1d8, roughness: 0.38 });
      const box = new THREE.Mesh(roundedBoxGeometry(1.65, 1.35, 1.45), boxMaterial);
      const lid = new THREE.Mesh(roundedBoxGeometry(1.82, 0.24, 1.6), boxMaterial.clone());
      lid.position.y = 0.73;
      const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.72, 1.55), ribbonMaterial);
      const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.28, 1.66), ribbonMaterial.clone());
      const knot = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.1, 12, 32), ribbonMaterial.clone());
      knot.rotation.x = Math.PI / 2;
      knot.position.y = 1.05;
      gift.add(box, lid, ribbonV, ribbonH, knot);
      gift.scale.setScalar(scale);
      world.add(gift);
      gifts.push(gift);
    });

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(90);
    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 9;
      starPositions[i + 1] = (Math.random() - 0.5) * 6;
      starPositions[i + 2] = -1.5 + Math.random() * 2;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: 0xe8b64a, size: 0.055, transparent: true, opacity: 0.7 }),
    );
    scene.add(stars);

    const pointer = new THREE.Vector2(4, 4);
    const raycaster = new THREE.Raycaster();
    let hovered: THREE.Group | null = null;
    let frame = 0;

    function resize() {
      const width = host!.clientWidth || 1;
      const height = host!.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    function findGift(object: THREE.Object3D | undefined): THREE.Group | null {
      let current = object;
      while (current && current.parent !== world) current = current.parent ?? undefined;
      return current instanceof THREE.Group && current.parent === world ? current : null;
    }

    function updatePointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onPointerMove(event: PointerEvent) {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      hovered = findGift(raycaster.intersectObjects(gifts, true)[0]?.object);
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
    }

    function onClick(event: PointerEvent) {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      const target = findGift(raycaster.intersectObjects(gifts, true)[0]?.object);
      if (target) callbackRef.current(target.userData.label as Occasion);
    }

    function render(time = 0) {
      const seconds = time / 1000;
      if (!reducedMotion) {
        world.rotation.y += (pointer.x * 0.11 - world.rotation.y) * 0.035;
        world.rotation.x += (-pointer.y * 0.05 - world.rotation.x) * 0.035;
        stars.rotation.z = seconds * 0.015;
      }
      gifts.forEach((gift, index) => {
        const selected = gift.userData.label === occasionRef.current;
        const targetScale = (index === 0 ? 1.05 : 0.62 + (index % 2) * 0.08) * (gift === hovered || selected ? 1.14 : 1);
        gift.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        if (!reducedMotion) gift.position.y = gift.userData.baseY + Math.sin(seconds * 1.25 + index) * 0.1;
      });
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);
    frame = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="dp-universe-shell" aria-label="Interactive gift universe. Move your pointer and select a gift box.">
      <div ref={hostRef} className={`dp-universe-canvas ${webglReady ? 'ready' : ''}`} />
      {!webglReady ? (
        <div className="dp-css-universe" aria-label="Choose a gift mood">
          {sceneOccasions.map((item, index) => (
            <button
              type="button"
              key={item}
              className={`dp-css-gift gift-${index + 1} ${occasion === item ? 'selected' : ''}`}
              onClick={() => onOccasionChange(item)}
              aria-label={`Explore ${item} gifts`}
            >
              <span className="dp-css-lid" /><span className="dp-css-ribbon" /><small>{item}</small>
            </button>
          ))}
        </div>
      ) : null}
      <div className="dp-universe-note"><span /> Drag your attention around · tap a box to choose a mood</div>
    </div>
  );
}
