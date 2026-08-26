import { useMemo } from "react";
import * as THREE from "three";

export interface StationConfig {
  id: string;
  name: string;
  color: string;
  activeColor: string;
  emissive: string;
}

const ROAD_LENGTH = 14;

export function Road({
  stations,
  activeId,
  onSelectStation,
}: {
  stations: (StationConfig & { progress: number; z: number })[];
  activeId: string;
  onSelectStation: (id: string) => void;
}) {
  const dashMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#d7e0e0",
        transparent: true,
        opacity: 0.85,
      }),
    [],
  );

  const dashes = useMemo(() => {
    const items: { z: number; key: string }[] = [];
    for (let z = -ROAD_LENGTH / 2 + 0.6; z < ROAD_LENGTH / 2; z += 0.9) {
      items.push({ z, key: `dash-${z}` });
    }
    return items;
  }, []);

  return (
    <group>
      {/* Asphalt */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[1.35, ROAD_LENGTH]} />
        <meshStandardMaterial
          color="#2c3338"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Road edges */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.62, -0.01, 0]}>
        <planeGeometry args={[0.06, ROAD_LENGTH]} />
        <meshBasicMaterial color="#8ebaba" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.62, -0.01, 0]}>
        <planeGeometry args={[0.06, ROAD_LENGTH]} />
        <meshBasicMaterial color="#8ebaba" />
      </mesh>

      {/* Center dashes */}
      {dashes.map((dash) => (
        <mesh
          key={dash.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, dash.z]}
          material={dashMat}
        >
          <planeGeometry args={[0.06, 0.38]} />
        </mesh>
      ))}

      {/* Stop Stations */}
      {stations.map((station) => {
        const isActive = activeId === station.id;
        const mainColor = isActive ? station.activeColor : "#6f8b94";
        const emissiveColor = isActive ? station.emissive : "#3d545c";

        return (
          <group key={station.id} position={[0, 0, station.z]}>
            {/* Station platform line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
              <planeGeometry args={[1.35, 0.16]} />
              <meshStandardMaterial
                color={mainColor}
                emissive={emissiveColor}
                emissiveIntensity={isActive ? 0.9 : 0.25}
              />
            </mesh>

            {/* Left post & sign indicator */}
            <mesh position={[-0.675, 0.3, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
              <meshStandardMaterial color="#3a4850" roughness={0.5} />
            </mesh>
            <mesh
              position={[-0.675, 0.55, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(station.id);
              }}
            >
              <boxGeometry args={[0.22, 0.22, 0.05]} />
              <meshStandardMaterial
                color={mainColor}
                emissive={emissiveColor}
                emissiveIntensity={isActive ? 1.0 : 0.4}
              />
            </mesh>

            {/* Right post & sign indicator */}
            <mesh position={[0.675, 0.3, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
              <meshStandardMaterial color="#3a4850" roughness={0.5} />
            </mesh>
            <mesh
              position={[0.675, 0.55, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(station.id);
              }}
            >
              <boxGeometry args={[0.22, 0.22, 0.05]} />
              <meshStandardMaterial
                color={mainColor}
                emissive={emissiveColor}
                emissiveIntensity={isActive ? 1.0 : 0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
