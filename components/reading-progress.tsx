"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useRef, type RefObject } from "react";

interface ReadingProgressProps {
  target: RefObject<HTMLElement | null>;
}

/** 0–1 scale for the bar. Short articles fill on the first scroll, matching the old bar. */
export function readingProgressScale(scrollTop: number, totalHeight: number): number {
  if (scrollTop <= 0) return 0;
  if (!(totalHeight > 0) || scrollTop >= totalHeight) return 1;
  return scrollTop / totalHeight;
}

const ReadingProgress = ({ target }: ReadingProgressProps) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;

    const write = () => {
      frame = 0;
      const element = target.current;
      if (!element) return;

      const totalHeight = element.clientHeight - element.offsetTop - window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scale = readingProgressScale(scrollTop, totalHeight);
      bar.style.transform = `translateY(2px) scaleX(${scale})`;
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <Box
      ref={barRef}
      aria-hidden
      pointerEvents="none"
      position="fixed"
      bg={{ _light: "blue.500", _dark: "blue.200" }}
      left={0}
      right={0}
      top={{ base: "auto", md: "16" }}
      bottom={{ base: "calc(4rem + var(--safe-bottom, 0px))", md: "auto" }}
      h="2px"
      mt="-2px"
      w="100%"
      transformOrigin="left"
      transform="translateY(2px) scaleX(0)"
      willChange="transform"
      zIndex={100}
    />
  );
};

export default ReadingProgress;
