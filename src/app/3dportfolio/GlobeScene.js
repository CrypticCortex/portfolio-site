"use client";

import { useState, useEffect, useRef, useMemo, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture, Html, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";


// -- Bangalore coords --
const BLR_LAT = 12.9716;
const BLR_LNG = 77.5946;

// convert lat/lng to 3D position on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}


// -- cloud platformphere shader --
const cloud platformphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloud platformphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 glowColor;
  uniform float coefficient;
  uniform float power;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float intensity = pow(coefficient - dot(vNormal, viewDir), power);
    gl_FragColor = vec4(glowColor, intensity * 0.6);
  }
`;


// -- Earth component --
function Earth({ weatherData }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const atmoRef = useRef();

  const [dayMap, nightMap, bumpMap] = useTexture([
    "/textures/earth-day.jpg",
    "/textures/earth-night.jpg",
    "/textures/earth-bump.png",
  ]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.02;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={dayMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          emissiveMap={nightMap}
          emissive={new THREE.Color(0xffff88)}
          emissiveIntensity={0.4}
          specularMap={dayMap}
          specular={new THREE.Color(0x333333)}
          shininess={15}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshPhongMaterial
          transparent
          opacity={0.15}
          color={0xffffff}
          depthWrite={false}
        />
      </mesh>

      {/* cloud platformphere glow */}
      <mesh ref={atmoRef} scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={cloud platformphereVertexShader}
          fragmentShader={cloud platformphereFragmentShader}
          uniforms={{
            glowColor: { value: new THREE.Color(0x4488ff) },
            coefficient: { value: 0.6 },
            power: { value: 3.5 },
          }}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}


// -- Bangalore marker (glowing pin) --
function BangaloreMarker({ weatherData, onClick }) {
  const markerRef = useRef();
  const ringRef = useRef();
  const pos = latLngToVector3(BLR_LAT, BLR_LNG, 2.02);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.15);
      ringRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    if (markerRef.current) {
      // billboard - always face camera
      markerRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group position={pos} ref={markerRef}>
      {/* Glowing dot */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      {/* Pulse ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.04, 0.06, 32]} />
        <meshBasicMaterial color="#ff6666" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Glow */}
      <pointLight color="#ff4444" intensity={0.5} distance={0.5} />
    </group>
  );
}


// -- Rain particles --
function RainParticles({ count = 600 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    const center = latLngToVector3(BLR_LAT, BLR_LNG, 2.3);
    for (let i = 0; i < count; i++) {
      arr.push({
        position: new THREE.Vector3(
          center.x + (Math.random() - 0.5) * 0.8,
          center.y + (Math.random() - 0.5) * 0.8,
          center.z + (Math.random() - 0.5) * 0.8
        ),
        speed: 0.002 + Math.random() * 0.004,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const center = latLngToVector3(BLR_LAT, BLR_LNG, 2.3);
    const down = center.clone().normalize().multiplyScalar(-1);

    particles.forEach((p, i) => {
      p.position.addScaledVector(down, p.speed);
      // reset when too far
      const dist = p.position.distanceTo(center);
      if (dist > 0.6) {
        p.position.set(
          center.x + (Math.random() - 0.5) * 0.6,
          center.y + (Math.random() - 0.5) * 0.6,
          center.z + (Math.random() - 0.5) * 0.6
        );
      }
      dummy.position.copy(p.position);
      dummy.scale.set(0.003, 0.015, 0.003);
      dummy.lookAt(p.position.clone().add(down));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.5, 0.5, 1, 4]} />
      <meshBasicMaterial color="#88bbff" transparent opacity={0.4} />
    </instancedMesh>
  );
}


// -- Sun rays (for clear weather) --
function SunRays() {
  const groupRef = useRef();
  const pos = latLngToVector3(BLR_LAT, BLR_LNG, 2.5);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={pos} ref={groupRef}>
      <pointLight color="#ffdd44" intensity={1.5} distance={2} />
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffee88" />
      </mesh>
      {/* Ray beams */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
          <planeGeometry args={[0.01, 0.3]} />
          <meshBasicMaterial color="#ffdd44" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}


// -- Cloud particles (for cloudy/overcast) --
function CloudParticles({ count = 30 }) {
  const groupRef = useRef();
  const center = latLngToVector3(BLR_LAT, BLR_LNG, 2.25);

  const clouds = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3(
        center.x + (Math.random() - 0.5) * 0.5,
        center.y + (Math.random() - 0.5) * 0.3,
        center.z + (Math.random() - 0.5) * 0.5
      ),
      scale: 0.03 + Math.random() * 0.06,
      speed: (Math.random() - 0.5) * 0.0005,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const c = clouds[i];
      if (!c) return;
      c.pos.x += c.speed;
      child.position.copy(c.pos);
      child.lookAt(state.camera.position);
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <sphereGeometry args={[c.scale, 8, 8]} />
          <meshBasicMaterial color="#aabbcc" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}


// -- Weather effects selector --
function WeatherEffects({ weatherData }) {
  if (!weatherData) return null;

  const code = weatherData.current?.weather_code ?? 0;
  // WMO weather codes:
  // 0-1: clear, 2-3: cloudy, 45-48: fog, 51-67: drizzle/rain, 71-77: snow, 80-82: showers, 95-99: thunderstorm
  const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 99);
  const isCloudy = code >= 2 && code <= 48;
  const isClear = code <= 1;

  return (
    <>
      {isRainy && <RainParticles count={800} />}
      {isCloudy && !isRainy && <CloudParticles count={40} />}
      {isClear && <SunRays />}
    </>
  );
}


// -- Connection line from marker to label --
function ConnectionLine() {
  const pos = latLngToVector3(BLR_LAT, BLR_LNG, 2.02);
  const endPos = pos.clone().normalize().multiplyScalar(2.6);

  const points = useMemo(() => [pos, endPos], []);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([
            pos.x, pos.y, pos.z,
            endPos.x, endPos.y, endPos.z,
          ])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ff4444" transparent opacity={0.4} />
    </line>
  );
}


// -- Camera controller: auto-focus on Bangalore --
function CameraController() {
  const { camera } = useThree();
  const targetPos = useMemo(() => {
    const blrPos = latLngToVector3(BLR_LAT, BLR_LNG, 2);
    // position camera looking at Bangalore from an angle
    return blrPos.clone().normalize().multiplyScalar(5).add(new THREE.Vector3(0, 1, 0));
  }, []);

  const initialized = useRef(false);

  useFrame(() => {
    if (!initialized.current) {
      camera.position.lerp(targetPos, 0.01);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(targetPos) < 0.1) {
        initialized.current = true;
      }
    }
  });

  return null;
}


// -- Main 3D scene --
function Scene({ weatherData }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -1, -5]} intensity={0.2} color="#4488ff" />

      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Earth */}
      <Suspense fallback={null}>
        <Earth weatherData={weatherData} />
      </Suspense>

      {/* Bangalore marker */}
      <BangaloreMarker weatherData={weatherData} />
      <ConnectionLine />

      {/* Weather effects */}
      <WeatherEffects weatherData={weatherData} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.4}
        autoRotate
        autoRotateSpeed={0.3}
      />

      <CameraController />
    </>
  );
}


// -- Weather HUD component --
function WeatherHUD({ weatherData, loading }) {
  if (loading) {
    return (
      <div style={styles.hud}>
        <div style={styles.hudTitle}>BANGALORE, IN</div>
        <div style={styles.hudLoading}>fetching weather data...</div>
      </div>
    );
  }

  if (!weatherData) return null;

  const current = weatherData.current;
  const temp = current?.temperature_2m ?? "--";
  const windSpeed = current?.wind_speed_10m ?? "--";
  const humidity = current?.relative_humidity_2m ?? "--";
  const code = current?.weather_code ?? 0;

  const weatherDesc = getWeatherDescription(code);
  const now = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", year: "numeric", month: "short", day: "numeric" });

  return (
    <div style={styles.hud}>
      <div style={styles.hudTitle}>BANGALORE, IN</div>
      <div style={styles.hudTime}>{now} IST</div>
      <div style={styles.hudDate}>{date}</div>
      <div style={styles.hudDivider} />
      <div style={styles.hudTemp}>{temp}°C</div>
      <div style={styles.hudCondition}>{weatherDesc}</div>
      <div style={styles.hudDivider} />
      <div style={styles.hudRow}>
        <span style={styles.hudLabel}>wind</span>
        <span style={styles.hudValue}>{windSpeed} km/h</span>
      </div>
      <div style={styles.hudRow}>
        <span style={styles.hudLabel}>humidity</span>
        <span style={styles.hudValue}>{humidity}%</span>
      </div>
      <div style={styles.hudRow}>
        <span style={styles.hudLabel}>lat</span>
        <span style={styles.hudValue}>{BLR_LAT.toFixed(4)}</span>
      </div>
      <div style={styles.hudRow}>
        <span style={styles.hudLabel}>lng</span>
        <span style={styles.hudValue}>{BLR_LNG.toFixed(4)}</span>
      </div>
    </div>
  );
}


// -- Info panel --
function InfoPanel() {
  return (
    <div style={styles.infoPanel}>
      <div style={styles.infoPanelTitle}>3D Weather Globe</div>
      <div style={styles.infoPanelDesc}>
        Real-time weather visualization over Bangalore, India.
        <br />
        Data from Open-Meteo API. Globe renders with Three.js.
      </div>
      <div style={styles.infoPanelHint}>drag to orbit / scroll to zoom</div>
      <a href="/" style={styles.backLink}>back to portfolio</a>
    </div>
  );
}


// -- Weather code to description --
function getWeatherDescription(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    96: "Thunderstorm w/ hail",
    99: "Thunderstorm w/ heavy hail",
  };
  return map[code] || `Code ${code}`;
}


// -- Styles --
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "#000",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
  hud: {
    position: "absolute",
    top: 24,
    right: 24,
    background: "rgba(5, 5, 15, 0.85)",
    border: "1px solid rgba(255, 68, 68, 0.2)",
    borderRadius: 0,
    padding: "20px 24px",
    color: "#e0e0e0",
    fontSize: 13,
    minWidth: 200,
    backdropFilter: "blur(12px)",
    zIndex: 10,
  },
  hudTitle: {
    fontSize: 11,
    letterSpacing: "0.15em",
    color: "#ff4444",
    marginBottom: 4,
    fontWeight: 600,
  },
  hudTime: {
    fontSize: 22,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 2,
    fontVariantNumeric: "tabular-nums",
  },
  hudDate: {
    fontSize: 11,
    color: "#888",
    marginBottom: 8,
  },
  hudLoading: {
    fontSize: 11,
    color: "#666",
    marginTop: 8,
  },
  hudDivider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "10px 0",
  },
  hudTemp: {
    fontSize: 36,
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1,
  },
  hudCondition: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
    marginBottom: 4,
  },
  hudRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "3px 0",
  },
  hudLabel: {
    color: "#666",
    fontSize: 11,
  },
  hudValue: {
    color: "#ccc",
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
  },
  infoPanel: {
    position: "absolute",
    bottom: 24,
    left: 24,
    color: "#888",
    fontSize: 12,
    zIndex: 10,
  },
  infoPanelTitle: {
    fontSize: 14,
    color: "#e0e0e0",
    fontWeight: 600,
    marginBottom: 4,
  },
  infoPanelDesc: {
    lineHeight: 1.6,
    maxWidth: 300,
  },
  infoPanelHint: {
    marginTop: 8,
    fontSize: 10,
    color: "#555",
    letterSpacing: "0.05em",
  },
  backLink: {
    display: "inline-block",
    marginTop: 12,
    color: "#ff4444",
    fontSize: 11,
    textDecoration: "none",
    borderBottom: "1px solid rgba(255,68,68,0.3)",
    paddingBottom: 1,
  },
  loadingScreen: {
    width: "100vw",
    height: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    color: "#e0e0e0",
    fontFamily: "'JetBrains Mono', monospace",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
    letterSpacing: "0.1em",
  },
  crosshair: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 20,
    height: 20,
    pointerEvents: "none",
    zIndex: 10,
  },
};


// -- Main page --
export default function ThreeDPortfolio() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  // fetch weather from Open-Meteo
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${BLR_LAT}&longitude=${BLR_LNG}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Kolkata`
        );
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
    // refresh every 30 min
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // update time every second for the HUD
  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles.container}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={styles.canvas}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#000005"]} />
        <fog attach="fog" args={["#000005", 15, 30]} />
        <Scene weatherData={weatherData} />
      </Canvas>

      {/* Crosshair */}
      <svg style={styles.crosshair} viewBox="0 0 20 20">
        <line x1="10" y1="0" x2="10" y2="7" stroke="#ff444444" strokeWidth="0.5" />
        <line x1="10" y1="13" x2="10" y2="20" stroke="#ff444444" strokeWidth="0.5" />
        <line x1="0" y1="10" x2="7" y2="10" stroke="#ff444444" strokeWidth="0.5" />
        <line x1="13" y1="10" x2="20" y2="10" stroke="#ff444444" strokeWidth="0.5" />
      </svg>

      <WeatherHUD weatherData={weatherData} loading={loading} />
      <InfoPanel />
    </div>
  );
}
