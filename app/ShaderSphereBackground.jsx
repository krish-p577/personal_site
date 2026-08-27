import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ShaderSphereBackground
 * ------------------------------------------------------------------
 * A full-screen (or container-filling) Three.js background: a mostly
 * white sphere covered in a grid of fixed-size particle "slots." Each
 * slot has its own random threshold; a noise field drifting over time
 * decides which slots currently clear their threshold and show their
 * (constant-size) particle. The result: particle SIZE never changes,
 * but the DENSITY of visible particles rises and falls as the wave
 * passes — like a stipple/dither pattern shifting over time, rather
 * than dots that grow and shrink.
 *
 * Usage in Next.js (App Router):
 *
 *   import dynamic from 'next/dynamic';
 *   const ShaderSphereBackground = dynamic(
 *     () => import('../components/ShaderSphereBackground'),
 *     { ssr: false }
 *   );
 *
 *   export default function Page() {
 *     return (
 *       <div style={{ position: 'relative' }}>
 *         <ShaderSphereBackground />
 *         <div style={{ position: 'relative', zIndex: 1 }}>
 *           {/* your page content *\/}
 *         </div>
 *       </div>
 *     );
 *   }
 *
 * Plain three.js only — no react-three-fiber dependency.
 */

const SIMPLEX_NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  ${SIMPLEX_NOISE_GLSL}

  void main() {
    vec3 pos = position;
    // Barely-there displacement — just enough for a whisper of 3D shading.
    float n = snoise(pos * uFrequency + vec3(0.0, 0.0, uTime * uSpeed));
    pos += normal * (n * uAmplitude);

    vUv = uv; // sphere's own surface UV — the dot grid lives in this space
    vNormal = normalize(normalMatrix * normal);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewDir = normalize(-mvPosition.xyz);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorLight;
  uniform vec3 uColorDark;
  uniform float uPatternFrequency;
  uniform float uPatternSpeed;
  uniform float uGridDensity;     // cells per "row" (columns are 2x this, to match sphere UV wrap) — controls how many POSSIBLE particle slots exist, and therefore particle size
  uniform float uParticleRadius;  // CONSTANT size for every particle, in cell-units (doesn't change with density)
  uniform float uJitter;          // random per-particle position offset, for a less mechanical grid
  uniform float uDensityFade;     // how gradually particles fade in/out as the density wave passes their threshold

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  ${SIMPLEX_NOISE_GLSL}

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
  }

  void main() {
    // Grid in UV space. X gets 2x the cell count of Y since longitude
    // wraps a full 360° while latitude only spans 180° — keeps particle
    // slots roughly even-sized around the sphere instead of stretched.
    vec2 gridCount = vec2(uGridDensity * 2.0, uGridDensity);

    vec2 cell = floor(vUv * gridCount);
    vec2 cellUV = (cell + 0.5) / gridCount;

    // Density field: noise sampled once per CELL, so each slot has one
    // stable value per frame rather than flickering pixel to pixel.
    vec3 samplePos = vec3(cellUV * uPatternFrequency, uTime * uPatternSpeed);
    float n1 = snoise(samplePos);
    float n2 = snoise(samplePos * 2.1 + 7.0);
    float raw = n1 * 0.65 + n2 * 0.35;
    float density = clamp(raw * 0.5 + 0.5, 0.0, 1.0);

    // Subtle rim boost so the sphere still reads as a 3D form.
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.0);
    density = clamp(density + fresnel * 0.15, 0.0, 1.0);

    // The key trick: every cell gets its own fixed random "threshold"
    // (stable across time, since it only depends on the integer cell
    // coordinate). A cell's particle only shows once the local density
    // wave rises above ITS threshold — so which slots are "on" changes
    // as the wave moves, giving you shifting density with constant-size
    // particles, rather than particles that grow and shrink.
    float threshold = hash(cell);
    float presence = smoothstep(threshold - uDensityFade, threshold + uDensityFade, density);

    // Particle placement within its cell, with jitter so slots don't
    // read as a mechanical grid — radius stays CONSTANT regardless of
    // density; only whether it's visible (presence) changes.
    vec2 jitter = (hash2(cell + 17.0) - 0.5) * uJitter;
    vec2 localPos = fract(vUv * gridCount) - 0.5 - jitter;

    float dist = length(localPos);
    float edge = 0.035;
    float shape = 1.0 - smoothstep(uParticleRadius - edge, uParticleRadius + edge, dist);

    float darkAmount = presence * shape;
    vec3 color = mix(uColorLight, uColorDark, darkAmount);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ShaderSphereBackground({
  amplitude = 0.03,
  frequency = 1.2,
  speed = 0.15,

  patternFrequency = 0.5, // higher = smaller, more numerous density "waves" across the sphere
  patternSpeed = 0.22, // how fast those waves drift/morph
  gridDensity = 100, // number of possible particle slots per row — higher = smaller, more numerous fixed-size particles
  particleRadius = 0.16, // CONSTANT size for every particle (cell-units) — does not change with density
  dotJitter = 0.52, // 0 = perfect grid, higher = more organic/scattered placement
  densityFade = 0.55, // lower = crisp on/off flip as waves pass; higher = softer fade in/out

  colorLight = '#ffffff', // matches backgroundColor by default so low-density areas vanish into the page
  colorDark = '#111111',
  backgroundColor = '#ffffff',

  opacity = 1,
  style = {},
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1.4, 256, 256);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uSpeed: { value: speed },
        uPatternFrequency: { value: patternFrequency },
        uPatternSpeed: { value: patternSpeed },
        uGridDensity: { value: gridDensity },
        uParticleRadius: { value: particleRadius },
        uJitter: { value: dotJitter },
        uDensityFade: { value: densityFade },
        uColorLight: { value: new THREE.Color(colorLight) },
        uColorDark: { value: new THREE.Color(colorDark) },
      },
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;
      sphere.rotation.y = elapsed * 0.08;
      sphere.rotation.x = Math.sin(elapsed * 0.05) * 0.1;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    amplitude,
    frequency,
    speed,
    patternFrequency,
    patternSpeed,
    gridDensity,
    particleRadius,
    dotJitter,
    densityFade,
    colorLight,
    colorDark,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: backgroundColor,
        opacity,
        ...style,
      }}
    />
  );
}