import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  MathUtils,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import ypponFlagUrl from './assets/yppon-flag.webp';

const vertexShader = `
  uniform float uTime;
  uniform float uDissolve;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float edge = sin(uv.x * 3.14159265);
    float primaryWave = sin(uv.x * 7.0 - uTime * 1.2) * 0.105;
    float secondaryWave = sin(uv.y * 10.0 + uTime * 0.72) * 0.035;
    float pointerWave = sin((uv.x + uPointer.x * 0.08) * 10.0 + uTime) * uPointer.y * 0.025;
    pos.z += (primaryWave + secondaryWave + pointerWave) * edge;
    pos.y += sin(uv.x * 5.0 + uTime * 0.55) * 0.025 * edge;
    pos.x += uDissolve * (uv.x - 0.5) * 0.32;
    vDepth = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uReveal;
  uniform float uDissolve;
  varying vec2 vUv;
  varying float vDepth;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    float n = noise(vUv * 19.0 + vec2(uTime * 0.018, 0.0));
    float threshold = uDissolve * 1.16 - 0.12;
    if (n < threshold) discard;

    float dissolveEdge = 1.0 - smoothstep(threshold, threshold + 0.095, n);
    float revealRadius = distance(vUv, vec2(0.5));
    float reveal = smoothstep(0.72, 0.08, revealRadius - uReveal * 0.76);
    vec3 gold = vec3(0.79, 0.61, 0.24);
    float movingLight = 0.76 + sin(vUv.x * 5.0 - uTime * 0.45) * 0.13;
    vec3 color = tex.rgb * movingLight;
    color += max(vDepth, 0.0) * vec3(0.15, 0.18, 0.23);
    color = mix(color, gold * 1.8, dissolveEdge * 0.82);
    float alpha = reveal * (1.0 - uDissolve * 0.18);

    gl_FragColor = vec4(color, alpha);
  }
`;

type FlagProps = {
  progressRef: RefObject<number>;
  reducedMotion: boolean;
};

function GoldenDust({
  progressRef,
  reducedMotion,
  mobile,
}: FlagProps & { mobile: boolean }) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const geometry = useMemo(() => {
    const count = mobile ? 260 : 720;
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      positions[offset] = (Math.random() - 0.5) * 5.8;
      positions[offset + 1] = (Math.random() - 0.5) * 3.8;
      positions[offset + 2] = (Math.random() - 0.5) * 1.2;
    }

    const nextGeometry = new BufferGeometry();
    nextGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    return nextGeometry;
  }, [mobile]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const progress = reducedMotion ? 0 : progressRef.current ?? 0;
    const dissolve = MathUtils.smoothstep(progress, 0.48, 0.94);
    material.opacity = Math.sin(dissolve * Math.PI) * 0.72;
    points.rotation.z += delta * 0.035;
    points.rotation.y += delta * 0.025;
    points.scale.setScalar(0.82 + dissolve * 0.46);
    points.position.z = dissolve * 0.8;
    material.size = (mobile ? 0.012 : 0.016) + dissolve * 0.018;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        color="#d6aa45"
        size={0.016}
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function LivingFlag({
  progressRef,
  reducedMotion,
  mobile,
}: FlagProps & { mobile: boolean }) {
  const texture = useLoader(TextureLoader, ypponFlagUrl);
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const revealRef = useRef(reducedMotion ? 1 : 0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uReveal: { value: reducedMotion ? 1 : 0 },
      uDissolve: { value: 0 },
      uPointer: { value: { x: 0, y: 0 } },
    }),
    [reducedMotion, texture],
  );

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    const group = groupRef.current;
    if (!material || !group) return;

    const elapsed = state.clock.elapsedTime;
    const progress = reducedMotion ? 0 : progressRef.current ?? 0;
    revealRef.current = reducedMotion ? 1 : Math.min(1, revealRef.current + delta * 0.52);

    material.uniforms.uTime.value = elapsed;
    material.uniforms.uReveal.value = revealRef.current;
    material.uniforms.uDissolve.value = MathUtils.smoothstep(progress, 0.54, 1);

    const targetX = mobile ? Math.sin(elapsed * 0.38) * 0.035 : state.pointer.y * 0.085;
    const targetY = mobile ? Math.sin(elapsed * 0.24) * 0.055 : state.pointer.x * 0.12;
    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 3.2, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 3.2, delta);
    group.rotation.z = MathUtils.damp(group.rotation.z, -0.015 + progress * 0.035, 2.8, delta);
    group.position.z = -progress * 0.82;
    group.scale.setScalar(1 - progress * 0.06);

    material.uniforms.uPointer.value.x = state.pointer.x;
    material.uniforms.uPointer.value.y = state.pointer.y;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[4.8, 3.2, mobile ? 40 : 72, mobile ? 28 : 48]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
        />
      </mesh>
      <GoldenDust progressRef={progressRef} reducedMotion={reducedMotion} mobile={mobile} />
    </group>
  );
}

export default function FlagScene({
  progressRef,
  paused,
  reducedMotion,
}: FlagProps & { paused: boolean }) {
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches;
  const maxDpr = mobile ? 1.25 : 1.5;

  return (
    <Canvas
      className="flag-canvas"
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 5.2], fov: 42, near: 0.1, far: 30 }}
      frameloop={paused || reducedMotion ? 'demand' : 'always'}
      gl={{ alpha: true, antialias: !mobile, powerPreference: 'high-performance' }}
      fallback={null}
      onCreated={({ gl }) => {
        gl.setClearColor(new Color('#030711'), 0);
      }}
    >
      <LivingFlag progressRef={progressRef} reducedMotion={reducedMotion} mobile={mobile} />
    </Canvas>
  );
}
