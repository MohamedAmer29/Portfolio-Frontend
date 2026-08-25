import { useEffect, useState } from "react";

export function useThemeColor(variable: string): string {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return "#e2e8e8";
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  });

  useEffect(() => {
    const update = () => {
      setValue(getComputedStyle(document.documentElement).getPropertyValue(variable).trim());
    };
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [variable]);

  return value;
}
