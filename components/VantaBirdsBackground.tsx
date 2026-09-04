'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';


export default function VantaBirdsBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let isMounted = true;
    let effect: { destroy: () => void } | null = null;

    if (!vantaEffect && vantaRef.current) {
      import('vanta/dist/vanta.birds.min').then((module) => {
        if (!isMounted || !vantaRef.current) return;

        const BIRDS = module.default;
        effect = BIRDS({
          el: vantaRef.current,
          THREE, // pass npm's three.js in directly instead of relying on window.THREE
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0xffffff, // matches the site's white background for now
          color1: 0x1a1a1a,
          color2: 0x1a1a1a,
          birdSize: 3,
          wingSpan: 10.0,
          separation: 40.0,
          alignment: 40.0,
          cohesion: 40.0,
          quantity: 1.0,
          speedLimit: 4.0,
        });

        setVantaEffect(effect);
      });
    }

    return () => {
      isMounted = false;
      effect?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={vantaRef}
      // Fixed + negative z-index so it sits behind everything, full
      // viewport, and doesn't affect document flow/scroll.
      style={{ position: 'fixed', inset: 0, zIndex: -1 }}
      aria-hidden="true"
    />
  );
}