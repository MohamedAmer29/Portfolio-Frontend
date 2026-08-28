import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

const POSITION_KEY = "portfolio_health_panel_position";

type Position = { x: number; y: number };

function readPosition(): Position {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return { x: 16, y: 80 };
    const parsed = JSON.parse(raw) as Position;
    if (typeof parsed.x === "number" && typeof parsed.y === "number") {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return { x: 16, y: 80 };
}

function persistPosition(pos: Position) {
  localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
}

export function AdminHealthPanel() {
  const { isAdmin } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [position, setPosition] = useState<Position>(readPosition);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data: result } = await api.get<unknown>("health");
      return result;
    },
    enabled: isAdmin,
    refetchInterval: 30_000,
    retry: 1,
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const next = {
        x: Math.max(8, dragRef.current.originX + dx),
        y: Math.max(8, dragRef.current.originY + dy),
      };
      setPosition(next);
    };

    const onUp = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      setPosition((pos) => {
        persistPosition(pos);
        return pos;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (!isAdmin) return null;

  const statusLabel = isLoading || isFetching
    ? "checking…"
    : isError
      ? "offline"
      : "healthy";

  const statusColor = isError ? "text-error" : "text-accent";

  const detail = isError
    ? (error as { message?: string })?.message ?? "Request failed"
    : typeof data === "object" && data !== null
      ? JSON.stringify(data)
      : String(data ?? "OK");

  return (
    <div
      ref={panelRef}
      className="fixed z-[95] w-[min(280px,calc(100vw-2rem))] rounded-lg border border-ink/10 bg-bg-elevated/95 p-3 shadow-[0_12px_40px_rgba(26,31,36,0.18)] backdrop-blur-md"
      style={{ left: position.x, top: position.y }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className="flex cursor-grab items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted active:cursor-grabbing"
          onPointerDown={(e) => {
            dragRef.current = {
              startX: e.clientX,
              startY: e.clientY,
              originX: position.x,
              originY: position.y,
            };
          }}
          aria-label="Drag health panel"
        >
          <GripVertical className="size-3.5" aria-hidden="true" />
          API Health
        </button>
        <button
          type="button"
          onClick={() => refetch()}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent transition hover:text-accent/80"
        >
          Refresh
        </button>
      </div>
      <p className={`font-mono text-[11px] uppercase tracking-[0.1em] ${statusColor}`}>
        {statusLabel}
      </p>
      <p className="mt-1 max-h-24 overflow-auto break-all font-mono text-[10px] leading-relaxed text-ink-muted">
        {detail}
      </p>
    </div>
  );
}
