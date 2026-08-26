import { Road, type StationConfig } from "./Road";
import { Car } from "./Car";

const ROAD_LENGTH = 14;

type ProgressRef = React.MutableRefObject<number>;

export function Scene({
  progressRef,
  stations,
  activeId,
  onSelectStation,
  shouldAnimate,
  bgColor,
  groundColor,
}: {
  progressRef: ProgressRef;
  stations: (StationConfig & { progress: number; z: number })[];
  activeId: string;
  onSelectStation: (id: string) => void;
  shouldAnimate: boolean;
  bgColor: string;
  groundColor: string;
}) {
  return (
    <>
      <color attach="background" args={[bgColor]} />
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

      <Road
        stations={stations}
        activeId={activeId}
        onSelectStation={onSelectStation}
      />
      <Car progressRef={progressRef} shouldAnimate={shouldAnimate} />

      {/* Soft ground under road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[2.2, ROAD_LENGTH + 1]} />
        <meshBasicMaterial color={groundColor} />
      </mesh>
    </>
  );
}
