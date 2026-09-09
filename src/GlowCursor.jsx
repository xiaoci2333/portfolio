import React, { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import './GlowCursor.css';

const MAX_POINTS = 40;

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

#define MAX_POINTS 40

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float filmGrain(vec2 p, float time) {
  float frame = time * 16.0;
  float frameIndex = mod(floor(frame), 256.0);
  float nextFrameIndex = mod(frameIndex + 1.0, 256.0);
  float blend = fract(frame);
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec2 pixel = floor(p);
  float current = hash(pixel + vec2(frameIndex * 17.0, frameIndex * 31.0));
  float next = hash(pixel + vec2(nextFrameIndex * 17.0, nextFrameIndex * 31.0));
  return mix(current, next, blend) * 2.0 - 1.0;
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.12;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);

    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float grain = filmGrain(pixel, uTime);
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.4;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  gl_FragColor = vec4(color * luminance, alpha);
}
`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hexToRgb = hex => {
  let value = hex.replace('#', '').trim();
  if (value.length === 3) value = value.split('').map(char => char + char).join('');
  const parsed = Number.parseInt(value, 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
};

export default function GlowCursor({
  color = '#D7FB74',
  secondaryColor = '#F1F2ED',
  trailLength = 30,
  trailWidth = 7,
  trailTaper = 0.86,
  followSpeed = 0.18,
  glowIntensity = 1.45,
  glowSpread = 1.05,
  hotspot = 0.72,
  brightness = 1.1,
  opacity = 0.78,
  pulseSpeed = 0.65,
  noiseStrength = 0.015,
  idleTimeout = 420,
  fadeDuration = 720,
  maxDevicePixelRatio = 1.25,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canAnimate = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    ).matches;
    if (!canvas || !canAnimate) return undefined;

    let renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        dpr: Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio),
      });
    } catch {
      return undefined;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const pointData = Array(MAX_POINTS * 2).fill(0);
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    let program;
    let mesh;
    try {
      program = new Program(gl, {
        vertex: VERTEX_SHADER,
        fragment: FRAGMENT_SHADER,
        uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: clamp(Math.round(trailLength), 2, MAX_POINTS) },
        uColor: { value: hexToRgb(color) },
        uSecondaryColor: { value: hexToRgb(secondaryColor) },
        uTrailWidth: { value: trailWidth },
        uTaper: { value: trailTaper },
        uGlowIntensity: { value: glowIntensity },
        uGlowSpread: { value: glowSpread },
        uHotspot: { value: hotspot },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uPulseSpeed: { value: pulseSpeed },
        uNoiseStrength: { value: noiseStrength },
        uTime: { value: 0 },
        uFade: { value: 0 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    } catch (error) {
      canvas.dataset.glowError = error instanceof Error ? error.message : String(error);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return undefined;
    }

    let width = 1;
    let height = 1;
    let initialized = false;
    let pointerInside = false;
    let fade = 0;
    let lastInputTime = performance.now();
    let lastFrameTime = lastInputTime;
    let raf = 0;
    let destroyed = false;

    const resize = () => {
      width = Math.max(window.innerWidth, 1);
      height = Math.max(window.innerHeight, 1);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const initializeTrail = (x, y) => {
      target.x = x;
      target.y = y;
      head.x = x;
      head.y = y;
      points.forEach(point => {
        point.x = x;
        point.y = y;
      });
      initialized = true;
      fade = 1;
    };

    const wake = () => {
      if (!raf && !destroyed && !document.hidden) {
        lastFrameTime = performance.now();
        raf = requestAnimationFrame(render);
      }
    };

    const updatePointer = event => {
      const x = clamp(event.clientX, 0, width);
      const y = clamp(height - event.clientY, 0, height);
      if (!initialized) initializeTrail(x, y);
      target.x = x;
      target.y = y;
      pointerInside = true;
      lastInputTime = performance.now();
      wake();
    };

    const onPointerLeave = event => {
      if (event.relatedTarget) return;
      pointerInside = false;
      lastInputTime = performance.now();
      wake();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (pointerInside) {
        wake();
      }
    };

    function render(now) {
      if (destroyed) return;
      raf = 0;
      const delta = Math.min((now - lastFrameTime) / 16.667, 3);
      lastFrameTime = now;

      if (initialized) {
        const headEase = 1 - Math.pow(1 - clamp(followSpeed, 0.01, 0.99), delta);
        const chainEase = 1 - Math.pow(1 - clamp(0.28 + followSpeed * 0.35, 0.08, 0.92), delta);
        head.x += (target.x - head.x) * headEase;
        head.y += (target.y - head.y) * headEase;
        points[0].x = head.x;
        points[0].y = head.y;

        for (let i = 1; i < MAX_POINTS; i += 1) {
          points[i].x += (points[i - 1].x - points[i].x) * chainEase;
          points[i].y += (points[i - 1].y - points[i].y) * chainEase;
        }
        for (let i = 0; i < MAX_POINTS; i += 1) {
          pointData[i * 2] = points[i].x;
          pointData[i * 2 + 1] = points[i].y;
        }
      }

      const idleFor = now - lastInputTime;
      const shouldFade = !pointerInside || idleFor > idleTimeout;
      const fadeStep = (16.667 * delta) / Math.max(fadeDuration, 16);
      fade += ((initialized && !shouldFade ? 1 : 0) - fade) * Math.min(1, fadeStep * 7);

      program.uniforms.uTime.value = now * 0.001;
      program.uniforms.uFade.value = fade;
      try {
        renderer.render({ scene: mesh });
      } catch (error) {
        canvas.dataset.glowError = error instanceof Error ? error.message : String(error);
        destroyed = true;
        return;
      }

      const stillMoving = Math.abs(target.x - head.x) + Math.abs(target.y - head.y) > 0.15;
      const shouldContinue = pointerInside ? idleFor <= idleTimeout || fade > 0.002 || stillMoving : fade > 0.002;
      if (shouldContinue && !document.hidden) raf = requestAnimationFrame(render);
    }

    try {
      resize();
    } catch (error) {
      canvas.dataset.glowError = error instanceof Error ? error.message : String(error);
      mesh.geometry.remove();
      program.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return undefined;
    }
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerout', onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerout', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      mesh.geometry.remove();
      program.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    brightness,
    color,
    fadeDuration,
    followSpeed,
    glowIntensity,
    glowSpread,
    hotspot,
    idleTimeout,
    maxDevicePixelRatio,
    noiseStrength,
    opacity,
    pulseSpeed,
    secondaryColor,
    trailLength,
    trailTaper,
    trailWidth,
  ]);

  return <canvas ref={canvasRef} className="glow-cursor" aria-hidden="true" />;
}
