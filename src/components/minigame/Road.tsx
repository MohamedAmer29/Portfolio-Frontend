import * as THREE from "three";

const ROAD_LENGTH = 20;
const END_Z = -ROAD_LENGTH / 2 + 2;
const ROAD_WIDTH = 2;

export function Road() {
  const dashMat = new THREE.MeshBasicMaterial({
    color: "#d7e0e0",
    transparent: true,
    opacity: 0.85,
  });

  const dashes = [];
  for (let z = -ROAD_LENGTH / 2 + 0.6; z < ROAD_LENGTH / 2; z += 0.9) {
    const curveOffset = Math.sin(z * 0.5) * 0.15;
    dashes.push({ z, x: curveOffset, key: `dash-${z}` });
  }

  const roadSegments = [];
  for (let z = -ROAD_LENGTH / 2; z < ROAD_LENGTH / 2; z += 1) {
    const curveOffset = Math.sin(z * 0.5) * 0.15;
    roadSegments.push({ z, x: curveOffset, key: `segment-${z}` });
  }

  return (
    <group>
      {/* Curved Asphalt */}
      {roadSegments.map((segment) => (
        <mesh
          key={segment.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[segment.x, -0.02, segment.z]}
          receiveShadow
        >
          <planeGeometry args={[ROAD_WIDTH, 1.2]} />
          <meshStandardMaterial
            color="#2c3338"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Road edges - curved */}
      {roadSegments.map((segment) => (
        <>
          <mesh
            key={`left-edge-${segment.key}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[segment.x - ROAD_WIDTH / 2, -0.01, segment.z]}
          >
            <planeGeometry args={[0.08, 1.1]} />
            <meshBasicMaterial color="#8ebaba" />
          </mesh>
          <mesh
            key={`right-edge-${segment.key}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[segment.x + ROAD_WIDTH / 2, -0.01, segment.z]}
          >
            <planeGeometry args={[0.08, 1.1]} />
            <meshBasicMaterial color="#8ebaba" />
          </mesh>
        </>
      ))}

      {/* Center dashes - curved */}
      {dashes.map((dash) => (
        <mesh
          key={dash.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[dash.x, 0, dash.z]}
          material={dashMat}
        >
          <planeGeometry args={[0.08, 0.38]} />
        </mesh>
      ))}

      {/* Portfolio destination line */}
      <group position={[Math.sin(END_Z * 0.5) * 0.15, 0, END_Z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[ROAD_WIDTH, 0.16]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={0.9}
          />
        </mesh>
        <mesh position={[-ROAD_WIDTH / 2 - 0.1, 0.3, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
          <meshStandardMaterial color="#3a4850" roughness={0.5} />
        </mesh>
        <mesh position={[-ROAD_WIDTH / 2 - 0.1, 0.55, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={1.0}
          />
        </mesh>
        <mesh position={[ROAD_WIDTH / 2 + 0.1, 0.3, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
          <meshStandardMaterial color="#3a4850" roughness={0.5} />
        </mesh>
        <mesh position={[ROAD_WIDTH / 2 + 0.1, 0.55, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={1.0}
          />
        </mesh>
        {/* PORTFOLIO Sign */}
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 0.35, 0.08]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#7e22ce"
              emissiveIntensity={1.0}
            />
          </mesh>
          <mesh position={[0, 0.15, 0.05]}>
            <boxGeometry args={[1.0, 0.25, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
