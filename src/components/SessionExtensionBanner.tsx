import { useAuth } from "../hooks/useAuth";

export function SessionExtensionBanner() {
  const { showExtendBanner, extendSession } = useAuth();

  if (!showExtendBanner) return null;

  return (
    <div className="fixed top-[70px] inset-x-0 z-[101] bg-accent/95 backdrop-blur-sm px-4 py-3 shadow-[0_8px_30px_rgba(127,173,173,0.2)]">
      <div className="flex max-w-[1200px] mx-auto items-center justify-between gap-4">
        <p className="font-mono text-[12px] text-white">
          Your session is about to expire. Would you like to extend it?
        </p>
        <button
          type="button"
          onClick={extendSession}
          className="whitespace-nowrap rounded-sm border border-white/30 bg-white px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-accent transition hover:bg-accent hover:text-white"
        >
          Extend Session
        </button>
      </div>
    </div>
  );
}