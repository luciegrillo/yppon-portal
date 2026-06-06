// The vertex shader gives the flag depth while keeping the source artwork intact.
export const flagVertexShader = `
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

// The fragment shader combines the reveal mask with a procedural dissolve edge.
export const flagFragmentShader = `
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
