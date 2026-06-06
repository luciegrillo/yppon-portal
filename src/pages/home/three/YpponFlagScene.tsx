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
import ypponFlagUrl from '../../../assets/yppon-flag.webp';
import { flagFragmentShader, flagVertexShader } from './flagShaders';

type FlagAnimationProps = {
  progressRef: RefObject<number>;
  prefersReducedMotion: boolean;
};

type YpponFlagSceneProps = FlagAnimationProps & {
  isPaused: boolean;
};

function createDustGeometry(particleCount: number) {
  const positions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    positions[offset] = (Math.random() - 0.5) * 5.8;
    positions[offset + 1] = (Math.random() - 0.5) * 3.8;
    positions[offset + 2] = (Math.random() - 0.5) * 1.2;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  return geometry;
}

function GoldenDust({
  progressRef,
  prefersReducedMotion,
  isMobile,
}: FlagAnimationProps & { isMobile: boolean }) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const geometry = useMemo(
    () => createDustGeometry(isMobile ? 260 : 720),
    [isMobile],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const progress = prefersReducedMotion ? 0 : progressRef.current ?? 0;
    const dissolveProgress = MathUtils.smoothstep(progress, 0.48, 0.94);

    material.opacity = Math.sin(dissolveProgress * Math.PI) * 0.72;
    material.size =
      (isMobile ? 0.012 : 0.016) + dissolveProgress * 0.018;
    points.rotation.z += delta * 0.035;
    points.rotation.y += delta * 0.025;
    points.scale.setScalar(0.82 + dissolveProgress * 0.46);
    points.position.z = dissolveProgress * 0.8;
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
  prefersReducedMotion,
  isMobile,
}: FlagAnimationProps & { isMobile: boolean }) {
  const texture = useLoader(TextureLoader, ypponFlagUrl);
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const revealProgressRef = useRef(prefersReducedMotion ? 1 : 0);

  const shaderUniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uReveal: { value: prefersReducedMotion ? 1 : 0 },
      uDissolve: { value: 0 },
      uPointer: { value: { x: 0, y: 0 } },
    }),
    [prefersReducedMotion, texture],
  );

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    const group = groupRef.current;
    if (!material || !group) return;

    const elapsedTime = state.clock.elapsedTime;
    const scrollProgress = prefersReducedMotion
      ? 0
      : progressRef.current ?? 0;

    revealProgressRef.current = prefersReducedMotion
      ? 1
      : Math.min(1, revealProgressRef.current + delta * 0.52);

    material.uniforms.uTime.value = elapsedTime;
    material.uniforms.uReveal.value = revealProgressRef.current;
    material.uniforms.uDissolve.value = MathUtils.smoothstep(
      scrollProgress,
      0.54,
      1,
    );

    const targetRotationX = isMobile
      ? Math.sin(elapsedTime * 0.38) * 0.035
      : state.pointer.y * 0.085;
    const targetRotationY = isMobile
      ? Math.sin(elapsedTime * 0.24) * 0.055
      : state.pointer.x * 0.12;

    group.rotation.x = MathUtils.damp(
      group.rotation.x,
      targetRotationX,
      3.2,
      delta,
    );
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      targetRotationY,
      3.2,
      delta,
    );
    group.rotation.z = MathUtils.damp(
      group.rotation.z,
      -0.015 + scrollProgress * 0.035,
      2.8,
      delta,
    );
    group.position.z = -scrollProgress * 0.82;
    group.scale.setScalar(1 - scrollProgress * 0.06);

    material.uniforms.uPointer.value.x = state.pointer.x;
    material.uniforms.uPointer.value.y = state.pointer.y;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry
          args={[4.8, 3.2, isMobile ? 40 : 72, isMobile ? 28 : 48]}
        />
        <shaderMaterial
          ref={materialRef}
          uniforms={shaderUniforms}
          vertexShader={flagVertexShader}
          fragmentShader={flagFragmentShader}
          transparent
          depthWrite={false}
        />
      </mesh>

      <GoldenDust
        progressRef={progressRef}
        prefersReducedMotion={prefersReducedMotion}
        isMobile={isMobile}
      />
    </group>
  );
}

export default function YpponFlagScene({
  progressRef,
  isPaused,
  prefersReducedMotion,
}: YpponFlagSceneProps) {
  const isMobile =
    typeof window !== 'undefined'
    && window.matchMedia('(max-width: 720px)').matches;
  const maximumPixelRatio = isMobile ? 1.25 : 1.5;

  return (
    <Canvas
      className="flag-canvas"
      dpr={[1, maximumPixelRatio]}
      camera={{ position: [0, 0, 5.2], fov: 42, near: 0.1, far: 30 }}
      frameloop={isPaused || prefersReducedMotion ? 'demand' : 'always'}
      gl={{
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      }}
      fallback={null}
      onCreated={({ gl }) => {
        gl.setClearColor(new Color('#030711'), 0);
      }}
    >
      <LivingFlag
        progressRef={progressRef}
        prefersReducedMotion={prefersReducedMotion}
        isMobile={isMobile}
      />
    </Canvas>
  );
}
