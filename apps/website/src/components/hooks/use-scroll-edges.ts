import type { RefObject } from "react";
import { useEffect, useState } from "react";

type UseScrollEdgesOptions = {
  offset?: number;
  offsetX?: number;
  offsetY?: number;
};

export function useScrollEdges(
  ref: RefObject<HTMLElement | null>,
  { offset, offsetX: _offsetX, offsetY: _offsetY }: UseScrollEdgesOptions = {},
) {
  const offsetX = _offsetX ?? offset ?? 1;
  const offsetY = _offsetY ?? offset ?? 1;

  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtLeft, setIsAtLeft] = useState(true);
  const [isAtRight, setIsAtRight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const check = () => {
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;

      const maxY = Math.max(0, scrollHeight - clientHeight);
      setIsAtTop(scrollTop <= offsetY || maxY <= offsetY);
      setIsAtBottom(maxY - scrollTop <= offsetY);

      const maxX = Math.max(0, scrollWidth - clientWidth);
      setIsAtLeft(scrollLeft <= offsetX || maxX <= offsetX);
      setIsAtRight(maxX - scrollLeft <= offsetX);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };

    check();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(check);
    ro.observe(el);

    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, [ref, offsetX, offsetY, ref.current]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ref, isAtTop, isAtBottom, isAtLeft, isAtRight };
}
