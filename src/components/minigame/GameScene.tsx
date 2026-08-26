import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Road } from "./Road";
import { GameCar } from "./GameCar";

const ROAD_LENGTH = 20;
const END_Z = -ROAD_LENGTH / 2 + 2;

export function GameScene({
  carPosition,
  gameStarted,
  keysPressed,
  onReachDestination,
}: {
  carPosition: THREE.Vector3;
  gameStarted: boolean;
  keysPressed: React.MutableRefObject<Set<string>>;
  onReachDestination: () => void;
}) {
  useFrame((_, delta) => {
    if (!gameStarted) return;

    const speed = 8 * delta;
    const car = carPosition;

    if (
      keysPressed.current.has("ArrowUp") ||
      keysPressed.current.has("w") ||
      keysPressed.current.has("W")
    ) {
      car.z = Math.max(car.z - speed, END_Z);
    }
  });

  return (
    <>
      <color attach="background" args={["#e2e8e8"]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[2.5, 6, 3]} intensity={1.35} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.48} />
      <pointLight position={[0, 0.7, 1.05]} intensity={0.95} color="#ffffff" />
      <spotLight
        position={[0, 1.8, 2.2]}
        intensity={0.7}
        angle={0.8}
        penumbra={0.8}
        color="#ffffff"
      />

      <Road />
      <GameCar position={carPosition} onReachDestination={onReachDestination} />

      {/* Soft ground under road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[4, ROAD_LENGTH + 1]} />
        <meshBasicMaterial color="#d8e0e0" />
      </mesh>
    </>
  );
}
